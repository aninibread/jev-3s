import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { foods, type Food } from "../lib/foods";
import { UploadPanel } from "../components/UploadPanel";
import { Arrow, FoodIcon, Spark } from "../components/Icons";
import {
  categories,
  labels,
  selectFoods,
  time,
  parseEvent,
  type Category,
  type Verdict,
  type HumanAnswer,
} from "../lib/game";

export function meta() {
  return [
    { title: "3s — Soup, salad or sandwich?" },
    {
      name: "description",
      content:
        "Five foods. Three choices. You versus Jev. A very serious game about very unserious food categories.",
    },
  ];
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <div className="modal-top">
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
function Rules() {
  return (
    <div className="rules-content">
      <p>
        For the purposes of this extremely important experiment, every prepared
        dish is one of three things.
      </p>
      {categories.map((c) => (
        <div className={`rule ${c}`} key={c}>
          <FoodIcon type={c} />
          <div>
            <h3>{labels[c]}</h3>
            <p>
              {c === "soup"
                ? "Ingredients swimming in liquid. Ramen, chowder, and yes, cereal with milk."
                : c === "sandwich"
                  ? "Held together by an edible base or wrapper. Burgers, tacos, and controversially, pizza."
                  : "Everything else. A medley on a plate. Pasta and rice are about to have an identity crisis."}
            </p>
          </div>
        </div>
      ))}
      <p className="small-note">
        Soup takes priority over its container: a bread-bowl soup is still soup.
        You and Jev get the same food description and rules. Disagreement is
        part of the game.
      </p>
    </div>
  );
}
function Credits() {
  return (
    <div className="credits-list">
      <p>
        Real food, real photographers. Thank you to the Wikimedia Commons
        contributors.
      </p>
      {foods.map((f) => (
        <div className="credit-row" key={f.id}>
          <img src={f.image} alt="" loading="lazy" />
          <div>
            <a href={f.sourceUrl} target="_blank" rel="noreferrer">
              {f.name} ↗
            </a>
            <p>
              {f.creator} ·{" "}
              <a href={f.licenseUrl} target="_blank" rel="noreferrer">
                {f.license}
              </a>
            </p>
            {f.modifications && <p>{f.modifications}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"home" | "game" | "summary" | "upload">(
    "home",
  );
  const [dialog, setDialog] = useState<"rules" | "credits" | null>(null);
  const [deck, setDeck] = useState<Food[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, HumanAnswer>>({});
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [failures, setFailures] = useState<Record<string, string>>({});
  const [batchTime, setBatchTime] = useState<number | null>(null);
  const [networkTime, setNetworkTime] = useState<number | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [shared, setShared] = useState("");
  const abort = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const started = useRef(0);
  const roundStart = useRef(0);
  const locked = useRef(false);
  const interrupted = useRef(false);
  const cardHeading = useRef<HTMLHeadingElement>(null);
  const current = deck[index];
  const human = current ? answers[current.id] : undefined;
  const jev = current ? verdicts[current.id] : undefined;
  const complete = Object.keys(verdicts).length;
  const failed = Object.keys(failures).length;
  useEffect(() => {
    if (dialog && screen === "game" && !human) interrupted.current = true;
  }, [dialog, screen, human]);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (screen !== "game" || human) return;
    roundStart.current = performance.now();
    interrupted.current = document.hidden;
    locked.current = false;
    setElapsed(0);
    const timer = window.setInterval(
      () => setElapsed(performance.now() - roundStart.current),
      80,
    );
    const visibility = () => {
      if (document.hidden) interrupted.current = true;
    };
    document.addEventListener("visibilitychange", visibility);
    cardHeading.current?.focus({ preventScroll: true });
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [screen, index, human]);
  const choose = useCallback(
    (choice: Category) => {
      if (screen !== "game" || !current || human || locked.current || dialog)
        return;
      locked.current = true;
      setAnswers((prev) => ({
        ...prev,
        [current.id]: {
          choice,
          durationMs: performance.now() - roundStart.current,
          interrupted: interrupted.current,
        },
      }));
    },
    [screen, current, human, dialog],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (screen !== "game" || human || dialog) return;
      if (
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const c = categories[Number(e.key) - 1];
      if (c) {
        e.preventDefault();
        choose(c);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [choose, screen, human, dialog]);
  const reset = () => {
    generation.current++;
    abort.current?.abort();
    setScreen("home");
    setLoading(false);
    setStartError("");
  };
  async function runRace(selected: Food[], token: number, signal: AbortSignal) {
    const resolved = new Set<string>();
    let finished = false;
    const began = performance.now();
    const receive = (line: string) => {
      if (!line.trim() || generation.current !== token) return;
      const event = parseEvent(line);
      if (event.type === "result" && typeof event.id === "string") {
        resolved.add(event.id);
        setVerdicts((prev) => ({
          ...prev,
          [event.id as string]: event as unknown as Verdict,
        }));
      } else if (event.type === "error" && typeof event.id === "string") {
        resolved.add(event.id);
        setFailures((prev) => ({
          ...prev,
          [event.id as string]:
            typeof event.message === "string"
              ? event.message
              : "Jev could not decide. Try another game.",
        }));
      } else if (event.type === "done") {
        finished = true;
        setBatchTime(
          typeof event.durationMs === "number" ? event.durationMs : null,
        );
        setNetworkTime(performance.now() - began);
      }
    };
    try {
      const response = await fetch("/api/race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected.map((f) => f.id) }),
        signal,
      });
      if (!response.ok) {
        const raw: unknown = await response.json().catch(() => null);
        const body =
          raw && typeof raw === "object"
            ? (raw as Record<string, unknown>)
            : {};
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Jev is unavailable. Try a new game in a moment.",
        );
      }
      if (!response.body)
        throw new Error("The connection to Jev was interrupted. Try again.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let split;
        while ((split = buffer.indexOf("\n")) >= 0) {
          receive(buffer.slice(0, split));
          buffer = buffer.slice(split + 1);
        }
      }
      buffer += decoder.decode();
      if (buffer.trim()) receive(buffer);
      if (!finished)
        throw new Error(
          "Connection interrupted. Your answers are saved for this round.",
        );
    } catch (error) {
      if (generation.current !== token) return;
      const message = signal.aborted
        ? "Jev took too long. Your choices are saved; try a new game."
        : error instanceof Error
          ? error.message
          : "Unable to reach Jev. Try a new game.";
      setFailures((prev) => {
        const next = { ...prev };
        selected.forEach((f) => {
          if (!resolved.has(f.id)) next[f.id] = message;
        });
        return next;
      });
    }
  }
  async function start() {
    if (loading) return;
    const token = ++generation.current;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true);
    setStartError("");
    setShared("");
    const selected = selectFoods(foods);
    try {
      await Promise.all(
        selected.map(
          (f) =>
            new Promise<void>((resolve, reject) => {
              const img = new Image();
              const timeout = setTimeout(
                () =>
                  reject(
                    new Error(
                      "The photos are taking too long to load. Please try again.",
                    ),
                  ),
                12000,
              );
              img.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                reject(
                  new Error("A food photo could not load. Please try again."),
                );
              };
              img.src = f.image;
            }),
        ),
      );
      if (generation.current !== token) return;
      setDeck(selected);
      setIndex(0);
      setAnswers({});
      setVerdicts({});
      setFailures({});
      setBatchTime(null);
      setNetworkTime(null);
      setSessionTime(0);
      started.current = performance.now();
      setScreen("game");
      setLoading(false);
      const timeout = setTimeout(() => controller.abort(), 55000);
      void runRace(selected, token, controller.signal).finally(() =>
        clearTimeout(timeout),
      );
    } catch (e) {
      if (generation.current === token) {
        setLoading(false);
        setStartError(
          e instanceof Error ? e.message : "Unable to load foods. Try again.",
        );
      }
    }
  }
  function next() {
    if (index === deck.length - 1) {
      setSessionTime(performance.now() - started.current);
      setScreen("summary");
    } else setIndex((i) => i + 1);
  }
  const agrees = deck.filter(
    (f) => answers[f.id] && verdicts[f.id]?.choice === answers[f.id].choice,
  ).length;
  const active = Object.values(answers).reduce(
    (sum, a) => sum + a.durationMs,
    0,
  );
  const wasInterrupted = Object.values(answers).some((a) => a.interrupted);
  async function share() {
    const text = `Soup, salad or sandwich?\nJev and I agreed on ${agrees}/${complete} foods.\n${wasInterrupted ? "" : `My thinking time: ${time(active)}. `}${batchTime !== null && failed === 0 ? `Jev's five parallel decisions: ${time(batchTime)}.` : ""}\nSettle your own food disputes: ${location.origin}`;
    try {
      if (navigator.share)
        await navigator.share({ title: "3s — You vs. Jev", text });
      else {
        await navigator.clipboard.writeText(text);
        setShared("Result copied. Send it to your most opinionated friend.");
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setShared(
          "Sharing is unavailable here. You can still save your result below.",
        );
    }
  }
  function download() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f7f5ee";
    ctx.fillRect(0, 0, 1200, 750);
    ctx.fillStyle = "#22231e";
    ctx.font = "bold 35px sans-serif";
    ctx.fillText("3s  /  HUMAN VS. JEV", 65, 80);
    ctx.font = "bold 85px Georgia";
    ctx.fillText("A matter of taste.", 65, 205);
    ctx.font = "34px sans-serif";
    ctx.fillText(
      `${agrees} of ${complete} food decisions in agreement.`,
      65,
      275,
    );
    deck.forEach((f, i) => {
      const y = 345 + i * 55;
      ctx.font = "25px sans-serif";
      ctx.fillText(f.name, 65, y);
      ctx.fillText(answers[f.id] ? labels[answers[f.id].choice] : "—", 620, y);
      ctx.fillText(
        verdicts[f.id] ? labels[verdicts[f.id].choice] : "Unavailable",
        870,
        y,
      );
    });
    ctx.font = "22px sans-serif";
    ctx.fillText(
      `You: ${wasInterrupted ? "interrupted" : time(active) + " active"}  ·  Jev: ${failed ? "partial results" : batchTime === null ? "unavailable" : time(batchTime) + " parallel batch"}`,
      65,
      665,
    );
    ctx.fillText("Soup, salad or sandwich?  ·  " + location.host, 65, 710);
    const link = document.createElement("a");
    link.download = "3s-you-vs-jev.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
  const heroFoods = [
    foods.find((f) => f.id === "ramen") || foods[0],
    foods.find((f) => /pizza/i.test(f.name)) || foods[1],
    foods.find((f) => /salad|sushi/i.test(f.name)) || foods[2],
  ].filter(Boolean);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <button className="brand" onClick={reset} aria-label="3s home">
          <span className="brand-mark">
            3s<span>✳</span>
          </span>
          <span className="brand-caption">
            SOUP. SALAD.
            <br />
            SANDWICH.
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button className="nav-link" onClick={() => setDialog("rules")}>
            The very official rules <span aria-hidden="true">↗</span>
          </button>
          <span className="edition">A LITTLE FOOD FOR THOUGHT</span>
        </nav>
      </header>
      <main id="main">
        {screen === "home" && (
          <div className="landing">
            <div className="eyebrow">
              <span className="live-dot" /> HUMAN INSTINCT MEETS ARTIFICIAL
              INTELLIGENCE
            </div>
            <h1 className="hero-title">
              Soup, salad
              <br />
              or{" "}
              <span className="sandwich-word">
                sandwich
                <svg
                  viewBox="0 0 520 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M4 16C155 0 348 2 511 10M30 22C190 12 380 12 478 18" />
                </svg>
              </span>
              <span className="title-question">?</span>
            </h1>
            <p className="hero-description">
              Every food is one of three things. Allegedly.
              <br />
              Five foods. Your gut feeling. One very fast AI.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary start-button"
                onClick={start}
                disabled={loading}
              >
                {loading ? "Setting the table…" : "Race Jev"}
                <Arrow />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setScreen("upload")}
                disabled={loading}
              >
                <span aria-hidden="true">＋</span> Bring your own food
              </button>
            </div>
            <p className="micro-copy">
              5 ROUNDS <span>·</span> ABOUT A MINUTE <span>·</span> NO WRONG
              OPINIONS
            </p>
            {startError && (
              <p className="notice" role="alert">
                {startError}
              </p>
            )}
            <div
              className="food-stage"
              aria-label="A taste of the foods you will debate"
            >
              <div className="scribble-note">
                things are about to
                <br />
                get unnecessarily debatable.<span aria-hidden="true">⤵</span>
              </div>
              {heroFoods.map((f, i) => (
                <div className={`polaroid polaroid-${i}`} key={f.id}>
                  <div className="photo-tape" />
                  <img
                    src={f.image}
                    alt={f.name}
                    fetchPriority={i === 1 ? "high" : "auto"}
                  />
                  <div className="polaroid-caption">
                    <span>{f.name}</span>
                    <span className="food-question">?</span>
                  </div>
                </div>
              ))}
              <div className="round-stamp">
                <Spark size={25} />
                <span>
                  TRUST
                  <br />
                  YOUR GUT.
                </span>
              </div>
            </div>
            <section className="how-it-works" aria-label="How to play">
              <div>
                <span className="step-number">01</span>
                <div>
                  <h2>Meet the food.</h2>
                  <p>Some obvious. Some existential.</p>
                </div>
              </div>
              <div>
                <span className="step-number">02</span>
                <div>
                  <h2>Go with your gut.</h2>
                  <p>Soup, salad, or sandwich. Commit.</p>
                </div>
              </div>
              <div>
                <span className="step-number">03</span>
                <div>
                  <h2>Compare your taste.</h2>
                  <p>Jev has opinions. See where you agree.</p>
                </div>
              </div>
            </section>
          </div>
        )}
        {screen === "game" && current && (
          <section className="game-page">
            <div className="game-top">
              <button className="text-button" onClick={reset}>
                <Arrow back /> Leave game
              </button>
              <span className="eyebrow">THE GREAT FOOD DEBATE</span>
              <span className="round-counter">
                {String(index + 1).padStart(2, "0")} <span>/ 05</span>
              </span>
            </div>
            <div className="mobile-jev-status" role="status">
              <Spark size={16} />
              <span>
                {complete === 5
                  ? "Jev has all 5 answers ready."
                  : `${complete} of 5 Jev answers ready`}
              </span>
              <span>
                {complete === 5 ? "Your move." : "Your answers stay hidden."}
              </span>
            </div>
            <div className="game-layout">
              <div className="player-side">
                <div className="food-card">
                  <div className="food-image-wrap">
                    <img src={current.image} alt={current.description} />
                    <span className="image-chip">FOOD {index + 1} OF 5</span>
                  </div>
                  <div className="food-card-caption">
                    <h1 ref={cardHeading} tabIndex={-1}>
                      {current.name}
                    </h1>
                    <span className="food-number">0{index + 1}</span>
                  </div>
                </div>
                <p className="food-description">{current.description}</p>
                <div className="decision-heading">
                  <h2>
                    {human
                      ? "You have excellent opinions."
                      : "What’s your gut feeling?"}
                  </h2>
                  <span className="timer">
                    {human ? time(human.durationMs) : time(elapsed)}
                  </span>
                </div>
                <div className="category-buttons">
                  {categories.map((c, i) => (
                    <button
                      key={c}
                      className={`choice-button ${c} ${human?.choice === c ? "selected" : ""}`}
                      disabled={!!human}
                      onClick={() => choose(c)}
                    >
                      <FoodIcon type={c} />
                      <span>{labels[c]}</span>
                      <kbd>{i + 1}</kbd>
                    </button>
                  ))}
                </div>
                {!human && (
                  <p className="keyboard-hint">
                    Your first instinct counts. Press 1, 2, or 3.
                  </p>
                )}
                {human && (
                  <div className="round-reveal" role="status">
                    {jev ? (
                      <>
                        <div className="reveal-heading">
                          <span className="reveal-symbol">
                            {human.choice === jev.choice ? "↔" : "≠"}
                          </span>
                          <div>
                            <h2>
                              {human.choice === jev.choice
                                ? "Great minds. Same menu."
                                : "A delicious disagreement."}
                            </h2>
                            <p>
                              You said {labels[human.choice].toLowerCase()}. Jev
                              said{" "}
                              <strong>
                                {labels[jev.choice].toLowerCase()}
                              </strong>
                              .
                            </p>
                          </div>
                        </div>
                        <div className="probability-bars">
                          {categories.map((c) => (
                            <div key={c}>
                              <span>{labels[c]}</span>
                              <div className="probability-track">
                                <i
                                  className={c}
                                  style={{
                                    width: `${Math.round(jev.probabilities[c] * 100)}%`,
                                  }}
                                />
                              </div>
                              <strong>
                                {Math.round(jev.probabilities[c] * 100)}%
                              </strong>
                            </div>
                          ))}
                        </div>
                        <div className="round-times">
                          <span>
                            You{" "}
                            <b>
                              {human.interrupted
                                ? "Interrupted"
                                : time(human.durationMs)}
                            </b>
                          </span>
                          <span>
                            Jev response <b>{time(jev.durationMs)}</b>
                          </span>
                        </div>
                      </>
                    ) : failures[current.id] ? (
                      <div className="notice">
                        <h2>Jev missed this course.</h2>
                        <p>{failures[current.id]}</p>
                        <p>Your choice still counts.</p>
                      </div>
                    ) : (
                      <div className="waiting">
                        <span className="live-dot" /> Your answer is locked.
                        Waiting for Jev…
                      </div>
                    )}
                    {(jev || failures[current.id]) && (
                      <button
                        className="btn btn-primary next-button"
                        onClick={next}
                      >
                        {index === 4 ? "See the final serving" : "Next food"}
                        <Arrow />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <aside className="jev-side">
                <div className="jev-heading">
                  <div className="jev-avatar">
                    <Spark size={30} />
                  </div>
                  <div>
                    <h2>Jev’s table</h2>
                    <p>FAST THINKER. STRONG OPINIONS.</p>
                  </div>
                  <span className="live-badge">LIVE</span>
                </div>
                <p className="jev-intro">
                  You take it one bite at a time.
                  <br />
                  Jev takes on all five at once.
                </p>
                <div className="jev-progress">
                  <span role="status">
                    {complete === 5
                      ? "All five. Already decided."
                      : complete + failed === 5
                        ? "Jev finished with some missing answers."
                        : `${complete} of 5 decisions ready`}
                  </span>
                  <span>{complete}/5</span>
                </div>
                <div className="progress-track">
                  <i style={{ width: `${(complete / 5) * 100}%` }} />
                </div>
                <div className="jev-queue">
                  {deck.map((f, i) => {
                    const result = verdicts[f.id];
                    const answer = answers[f.id];
                    return (
                      <div
                        className={`queue-row ${i === index ? "current" : ""} ${answer ? "revealed" : ""}`}
                        key={f.id}
                      >
                        <span className="queue-number">0{i + 1}</span>
                        <div className="queue-name">
                          <span>{f.name}</span>
                          <small>
                            {answer
                              ? result
                                ? time(result.durationMs) + " response"
                                : failures[f.id]
                                  ? "Unavailable"
                                  : "Still thinking…"
                              : result
                                ? "Answer locked in"
                                : failures[f.id]
                                  ? "Unavailable"
                                  : "Thinking…"}
                          </small>
                        </div>
                        <span
                          className={`queue-answer ${answer && result ? result.choice : ""}`}
                        >
                          {answer && result ? (
                            <>
                              <FoodIcon type={result.choice} size={18} />
                              {labels[result.choice]}
                            </>
                          ) : answer && failures[f.id] ? (
                            "—"
                          ) : (
                            <span
                              className="concealed"
                              aria-label="Answer hidden"
                            >
                              •••
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="jev-note">
                  <Spark size={18} />
                  <p>
                    No peeking. Each answer is revealed
                    <br />
                    only after you make your choice.
                  </p>
                </div>
                {batchTime !== null && (
                  <p className="batch-time">
                    {failed ? "Batch completed" : "All five decisions"} in{" "}
                    <strong>{time(batchTime)}</strong>
                    <span>Live service time · five parallel requests</span>
                  </p>
                )}
                <details className="timing-details">
                  <summary>A note on the stopwatch</summary>
                  <p>
                    You see a photo and description. Jev reads that same
                    description. Your clock measures active decision time; Jev’s
                    clock includes the AI service call. These are different
                    tasks, not a controlled benchmark.
                  </p>
                </details>
              </aside>
            </div>
          </section>
        )}
        {screen === "summary" && (
          <section className="summary-page">
            <div className="eyebrow">
              THE RESULTS ARE IN. THE DEBATE IS NOT OVER.
            </div>
            <h1>
              A matter of <em>taste.</em>
            </h1>
            <p className="summary-lede">
              {complete === 0
                ? "Your opinions are in. Jev couldn’t join this time."
                : agrees === 5
                  ? "You and Jev could share a menu."
                  : agrees >= 3
                    ? "Mostly on the same plate. A few things to discuss."
                    : "You and Jev should probably order separately."}
            </p>
            <div className="summary-stats">
              <div>
                <span>THE COMMON GROUND</span>
                <strong>
                  {complete ? agrees : "—"}
                  {complete > 0 && <small>/{complete}</small>}
                </strong>
                <p>
                  {complete
                    ? "matching food opinions"
                    : "No AI answers to compare"}
                </p>
              </div>
              <div>
                <span>YOUR THINKING TIME</span>
                <strong>{wasInterrupted ? "—" : time(active)}</strong>
                <p>
                  {wasInterrupted
                    ? "Timing interrupted during this game"
                    : "five choices, one at a time"}
                </p>
              </div>
              <div>
                <span>JEV’S WHOLE TABLE</span>
                <strong>
                  {failed || batchTime === null ? "—" : time(batchTime)}
                </strong>
                <p>
                  {failed
                    ? "Some answers were unavailable"
                    : "five decisions, in parallel"}
                </p>
              </div>
            </div>
            <div className="results-table">
              <div className="results-header">
                <span>ON THE MENU</span>
                <span>YOU</span>
                <span>JEV</span>
              </div>
              {deck.map((f) => (
                <div className="result-row" key={f.id}>
                  <div>
                    <img src={f.image} alt="" />
                    <span>{f.name}</span>
                  </div>
                  <span className={`answer-tag ${answers[f.id]?.choice}`}>
                    {answers[f.id] ? labels[answers[f.id].choice] : "—"}
                  </span>
                  <span
                    className={`answer-tag ${verdicts[f.id]?.choice || ""}`}
                  >
                    {verdicts[f.id]
                      ? labels[verdicts[f.id].choice]
                      : "Unavailable"}
                  </span>
                </div>
              ))}
            </div>
            <p className="summary-footnote">
              Agreement, not accuracy. Human time excludes reading results. Jev
              time includes service overhead.
              <br />
              Full session: {time(sessionTime)}
              {networkTime !== null
                ? ` · Jev round trip: ${time(networkTime)}`
                : ""}
            </p>
            <div className="summary-actions">
              <button
                className="btn btn-primary"
                onClick={start}
                disabled={loading}
              >
                {loading ? "Setting the table…" : "Another helping"}
                <Arrow />
              </button>
              <button className="btn btn-secondary" onClick={share}>
                Share your result ↗
              </button>
              <button className="text-button" onClick={download}>
                Save result image ↓
              </button>
            </div>
            <p className="share-feedback" role="status">
              {shared || startError}
            </p>
            <button
              className="text-button upload-invitation"
              onClick={() => setScreen("upload")}
            >
              Got a food that would break this game? Bring it.
            </button>
          </section>
        )}
        {screen === "upload" && (
          <section className="upload-page">
            <UploadPanel onClose={reset} />
          </section>
        )}
      </main>
      <footer className="site-footer">
        <span>A VERY SERIOUS EXPERIMENT IN UNSERIOUS CATEGORIES.</span>
        <div>
          <span>
            Powered by <strong>Jev</strong>{" "}
            <span className="footer-divider">/</span> Cloudflare
          </span>
          <button onClick={() => setDialog("credits")}>Photo credits ↗</button>
        </div>
      </footer>
      {dialog && (
        <Dialog
          title={
            dialog === "rules"
              ? "The very official rules."
              : "Good food deserves credit."
          }
          onClose={() => setDialog(null)}
        >
          {dialog === "rules" ? <Rules /> : <Credits />}
        </Dialog>
      )}
    </div>
  );
}
