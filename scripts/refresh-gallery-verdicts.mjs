import { writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dogs } from "../app/lib/dogs.ts";
import { foods } from "../app/lib/foods.ts";

const baseUrl = process.env.JEV_BASE_URL || "https://3s.anniwang.workers.dev";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const run = promisify(execFile);

async function post(path, body) {
  while (true) {
    let output;
    try {
      ({ stdout: output } = await run("curl", [
        "-sS",
        "-X", "POST",
        `${baseUrl}${path}`,
        "-H", "Content-Type: application/json",
        "--data", JSON.stringify(body),
        "-w", "\n%{http_code}",
      ], { maxBuffer: 1024 * 1024 }));
    } catch {
      await wait(3_000);
      continue;
    }
    const newline = output.lastIndexOf("\n");
    const text = output.slice(0, newline);
    const status = Number(output.slice(newline + 1));
    if (status === 429) {
      await wait(61_000);
      continue;
    }
    if (status < 200 || status >= 300) throw new Error(`${status}: ${text}`);
    return text;
  }
}

async function classifyDogs(selected) {
  const entries = [];
  for (const dog of selected) {
    const response = await post("/api/classify", {
      description: dog.description,
      game: "dogs",
    });
    entries.push([dog.id, JSON.parse(response)]);
    await wait(5_200);
  }
  return entries;
}

async function classifyFoods(selected) {
  const response = await post("/api/race", { ids: selected.map((food) => food.id) });
  const lines = response.trim().split("\n").map(JSON.parse);
  return lines
    .filter((event) => event.type === "result")
    .map(({ type: _type, ...verdict }) => [verdict.id, verdict]);
}

const dogEntries = [];
dogEntries.push(...(await classifyDogs(dogs)));

const foodEntries = [];
for (let index = 0; index < foods.length; index += 5) {
  foodEntries.push(...(await classifyFoods(foods.slice(index, index + 5))));
  await wait(5_200);
}

const compact = (value) => JSON.stringify(value);
const dogSource = [
  'import type { DogClassification } from "./ai-contract";',
  "",
  "export const dogGalleryVerdicts: Record<string, DogClassification> = {",
  ...dogEntries.map(([id, verdict]) => `  ${JSON.stringify(id)}: ${compact({ ...verdict, durationMs: 0 })},`),
  "};",
  "",
].join("\n");
const foodSource = [
  'import type { Verdict } from "./game";',
  "",
  "// Generated once with the current Jev rules. Gallery inputs are immutable, so",
  "// shipping their verdicts avoids repeat model calls and makes selection instant.",
  "export const galleryVerdicts: Record<string, Verdict> = {",
  ...foodEntries.map(([id, verdict]) => `  ${JSON.stringify(id)}: ${compact({ ...verdict, durationMs: 0 })},`),
  "};",
  "",
].join("\n");

await writeFile(new URL("../app/lib/dog-gallery-verdicts.ts", import.meta.url), dogSource);
await writeFile(new URL("../app/lib/gallery-verdicts.ts", import.meta.url), foodSource);
console.log(`Refreshed ${dogEntries.length} dog and ${foodEntries.length} food verdicts.`);
