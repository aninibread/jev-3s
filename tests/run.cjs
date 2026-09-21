// Exercise the real TypeScript modules with controlled AI responses, never production fallback data.
const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const cache = new Map();
function load(relative) {
  const file = path.resolve(__dirname, "..", relative);
  if (cache.has(file)) return cache.get(file);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  cache.set(file, module.exports);
  const localRequire = (id) =>
    id.startsWith(".")
      ? load(
          path.relative(
            path.resolve(__dirname, ".."),
            path.resolve(path.dirname(file), id + ".ts"),
          ),
        )
      : require(id);
  vm.runInThisContext("(function(require,module,exports){" + code + "\n})", {
    filename: file,
  })(localRequire, module, module.exports);
  return module.exports;
}
const { parseJevResponse } = load("workers/ai.ts");
const { handleApi, imageMatchesType, limitedBody } = load("workers/api.ts");
const { selectFoods } = load("app/lib/game.ts");
const { foods } = load("app/lib/foods.ts");
const good = {
  answers: {
    category: {
      choice: "soup",
      probabilities: { soup: 0.8, salad: 0.1, sandwich: 0.1 },
    },
  },
};
let count = 0;
async function test(name, fn) {
  await fn();
  console.log("✓ " + name);
  count++;
}
(async () => {
  await test("Jev parser accepts valid typed result", () =>
    assert.equal(parseJevResponse(good).choice, "soup"));
  await test("Jev parser rejects missing, nonfinite and invalid distributions", () => {
    for (const value of [
      null,
      { answers: {} },
      { answers: { category: { choice: "pizza", probabilities: {} } } },
      {
        answers: {
          category: {
            choice: "soup",
            probabilities: { soup: NaN, salad: 0, sandwich: 1 },
          },
        },
      },
      {
        answers: {
          category: {
            choice: "soup",
            probabilities: { soup: 0.3, salad: 0.1, sandwich: 0.1 },
          },
        },
      },
    ])
      assert.throws(() => parseJevResponse(value));
  });
  await test("Every randomized round has five unique foods and a debate", () => {
    for (let i = 0; i < 200; i++) {
      const set = selectFoods(foods);
      assert.equal(new Set(set.map((f) => f.id)).size, 5);
      assert.ok(set.some((f) => f.debatable));
    }
  });
  await test("Every catalog photo and credit exists", () => {
    for (const f of foods) {
      assert.ok(fs.existsSync(path.resolve(__dirname, "../public" + f.image)));
      assert.ok(f.creator && f.license && f.sourceUrl && f.description);
    }
  });
  await test("Image signatures reject mismatched uploads", () => {
    assert.ok(imageMatchesType(new Uint8Array([255, 216, 255]), "image/jpeg"));
    assert.equal(
      imageMatchesType(new Uint8Array([255, 216, 255]), "image/png"),
      false,
    );
    assert.equal(imageMatchesType(new Uint8Array([1, 2]), "image/webp"), false);
  });
  await test("Bounded request reader stops oversized bodies", async () => {
    await assert.rejects(() =>
      limitedBody(
        new Request("http://localhost", { method: "POST", body: "123456" }),
        4,
      ),
    );
  });
  const req = (endpoint, body, headers = {}) =>
    new Request("http://localhost/api/" + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  let calls = 0;
  let tasks = [];
  const env = {
    AI: {
      run: async () => {
        calls++;
        return good;
      },
    },
  };
  const ctx = { waitUntil: (p) => tasks.push(p) };
  await test("API rejects duplicate ids without spending AI calls", async () => {
    const response = await handleApi(
      req("race", { ids: Array(5).fill("ramen") }),
      env,
      ctx,
    );
    assert.equal(response.status, 400);
    assert.equal(calls, 0);
  });
  await test("API rejects cross-origin requests", async () => {
    const response = await handleApi(
      req(
        "classify",
        { description: "A bowl of broth." },
        { origin: "https://foreign.test" },
      ),
      env,
      ctx,
    );
    assert.equal(response.status, 403);
  });
  await test("Live race streams five associated results and a completion", async () => {
    const ids = foods.slice(0, 5).map((f) => f.id);
    const response = await handleApi(req("race", { ids }), env, ctx);
    const events = (await response.text()).trim().split("\n").map(JSON.parse);
    await Promise.all(tasks);
    assert.equal(events.length, 6);
    assert.equal(events[5].type, "done");
    assert.deepEqual(
      new Set(events.slice(0, 5).map((e) => e.id)),
      new Set(ids),
    );
    assert.equal(calls, 5);
  });
  await test("Failed model calls produce errors rather than invented choices", async () => {
    const badEnv = {
      AI: {
        run: async () => {
          throw new Error("Insufficient AI Gateway credits");
        },
      },
    };
    const response = await handleApi(
      req("race", { ids: foods.slice(0, 5).map((f) => f.id) }),
      badEnv,
      ctx,
    );
    const events = (await response.text()).trim().split("\n").map(JSON.parse);
    assert.equal(events.filter((e) => e.type === "error").length, 5);
    assert.equal(events.filter((e) => e.type === "result").length, 0);
    assert.match(events[0].message, /credits/);
  });
  console.log(`${count} tests passed.`);
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
