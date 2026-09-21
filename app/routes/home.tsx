import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { foods, type Food } from "../lib/foods";
import { galleryVerdicts } from "../lib/gallery-verdicts";
import { categories, labels, type Category, type Verdict } from "../lib/game";

export function meta() {
  return [
    { title: "3s — Ask Jev" },
    { name: "description", content: "Give Jev any food. It decides: soup, salad, or sandwich." },
  ];
}

type Mode = "text" | "photo" | "gallery";
type Selection = { id?: string; name: string; description: string; image?: string };
const emoji: Record<Category, string> = { soup: "🥣", salad: "🥗", sandwich: "🥪" };

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} className="modal" onCancel={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="modal-inner">
        <div className="modal-top"><h2>{title}</h2><button onClick={onClose} aria-label="Close">×</button></div>
        {children}
      </div>
    </dialog>
  );
}

function Rules() {
  return (
    <div className="rules-content">
      <p><b><span aria-hidden="true">{emoji.soup}</span> Soup</b> is a wet mixture with substantial liquid that is eaten with the rest.</p>
      <p><b><span aria-hidden="true">{emoji.sandwich}</span> Sandwich</b> has a distinct edible outer layer or base holding other ingredients.</p>
      <p><b><span aria-hidden="true">{emoji.salad}</span> Salad</b> is a dry or moist mixture of ingredients or pieces, with no substantial liquid or edible outer layer.</p>
      <p className="muted">When nothing fits perfectly, Jev picks the closest structure. Yes, cereal is soup and pizza is a sandwich.</p>
    </div>
  );
}

function Credits() {
  return (
    <div className="credits-list">
      {foods.map((food) => food.sourceUrl ? (
        <a href={food.sourceUrl} target="_blank" rel="noreferrer" key={food.id}>
          <span>{food.name}</span><small>{food.creator} · {food.license}</small>
        </a>
      ) : (
        <div key={food.id}>
          <span>{food.name}</span><small>{food.creator}</small>
        </div>
      ))}
    </div>
  );
}

function validVerdict(value: unknown): value is Verdict {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  if (!categories.includes(result.choice as Category) || typeof result.durationMs !== "number") return false;
  if (!result.probabilities || typeof result.probabilities !== "object") return false;
  const probabilities = result.probabilities as Record<string, unknown>;
  return categories.every((category) => typeof probabilities[category] === "number");
}

async function readResponse(response: Response): Promise<Record<string, unknown>> {
  const value: unknown = await response.json().catch(() => null);
  const body = value && typeof value === "object" ? value as Record<string, unknown> : {};
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Jev couldn’t answer. Try again.");
  return body;
}

async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const ratio = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Couldn’t prepare that photo.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Couldn’t prepare that photo.")),
      "image/jpeg",
      0.85,
    ));
  } finally {
    bitmap.close();
  }
}

export default function Home() {
  const fileId = useId();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "deciding">("idle");
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<"rules" | "credits" | null>(null);
  const [dragging, setDragging] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const previewUrl = useRef<string | null>(null);

  useEffect(() => () => {
    controller.current?.abort();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  function reset(nextMode = mode) {
    controller.current?.abort();
    setMode(nextMode);
    setSelection(null);
    setVerdict(null);
    setError("");
    setStatus("idle");
  }

  async function classify(item: Selection) {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setSelection(item);
    setVerdict(null);
    setError("");
    if (item.id && galleryVerdicts[item.id]) {
      setStatus("idle");
      setVerdict(galleryVerdicts[item.id]);
      return;
    }
    setStatus("deciding");
    try {
      const body = await readResponse(await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: item.description }),
        signal: AbortSignal.any([next.signal, AbortSignal.timeout(35000)]),
      }));
      if (!validVerdict(body)) throw new Error("Jev’s answer didn’t arrive correctly.");
      setVerdict(body);
    } catch (issue) {
      if (next.signal.aborted) return;
      setError(issue instanceof Error ? issue.message : "Jev couldn’t answer. Try again.");
    } finally {
      if (!next.signal.aborted) setStatus("idle");
    }
  }

  async function usePhoto(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Choose an image smaller than 8 MB.");
      return;
    }
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    const image = previewUrl.current;
    setSelection({ name: file.name, description: "", image });
    setVerdict(null);
    setError("");
    setStatus("reading");
    try {
      const data = new FormData();
      data.append("image", await prepareImage(file), "food.jpg");
      const body = await readResponse(await fetch("/api/analyze", {
        method: "POST",
        body: data,
        signal: AbortSignal.any([next.signal, AbortSignal.timeout(35000)]),
      }));
      if (typeof body.description !== "string" || !body.description.trim()) throw new Error("Couldn’t identify a food in that image.");
      await classify({ name: file.name, description: body.description.trim(), image });
    } catch (issue) {
      if (next.signal.aborted) return;
      setStatus("idle");
      setError(issue instanceof Error ? issue.message : "Couldn’t read that image.");
    }
  }

  const busy = status !== "idle";

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => reset("text")}>3s</button>
        <nav><button onClick={() => setDialog("rules")}>Rules</button></nav>
      </header>

      <main className="classifier">
        <section className="intro">
          <h1>Soup, salad, or sandwich?</h1>
          <p>Give Jev a food. It has to pick one.</p>
        </section>

        <div className="mode-tabs" role="tablist" aria-label="Choose a food source">
          {(["text", "photo", "gallery"] as Mode[]).map((item) => (
            <button key={item} role="tab" aria-selected={mode === item} className={mode === item ? "active" : ""} onClick={() => reset(item)}>
              {item === "text" ? "Type" : item === "photo" ? "Photo" : "Gallery"}
            </button>
          ))}
        </div>

        <section className="input-area">
          {mode === "text" && (
            <form className="text-form" onSubmit={(event) => {
              event.preventDefault();
              const value = text.trim();
              if (value.length < 2) { setError("Type a food first."); return; }
              void classify({ name: value, description: value });
            }}>
              <input autoFocus value={text} maxLength={1200} disabled={busy} placeholder="hot dog, cereal with milk, tiramisu…" aria-label="Food name or description" onChange={(event) => { setText(event.target.value); setError(""); }} />
              <button disabled={busy || text.trim().length < 2}>{status === "deciding" ? "Deciding…" : "Ask Jev"}</button>
            </form>
          )}

          {mode === "photo" && (
            <label className={`photo-drop${dragging ? " dragging" : ""}`} htmlFor={fileId} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void usePhoto(file); }}>
              {selection?.image ? <img src={selection.image} alt="Selected food" /> : <span aria-hidden="true">＋</span>}
              <strong>{status === "reading" ? "Reading the photo…" : status === "deciding" ? "Jev is deciding…" : selection?.image ? "Choose another photo" : "Choose or drop a food photo"}</strong>
              <small>JPG, PNG, or WebP · 8 MB max</small>
              <input id={fileId} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void usePhoto(file); }} />
            </label>
          )}

          {mode === "gallery" && !selection && (
            <div className="food-gallery">
              {foods.map((food: Food) => (
                <button key={food.id} disabled={busy} aria-label={`Ask Jev about ${food.name}`} onClick={() => void classify({ id: food.id, name: food.name, description: food.description, image: food.image })}>
                  <img src={food.image} alt="" /><span>{food.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {error && <div className="error-card" role="alert"><span>{error}</span>{selection && <button onClick={() => void classify(selection)}>Try again</button>}</div>}
        {selection && status === "deciding" && mode !== "photo" && <div className="thinking"><span className="loader" /> Jev is deciding about {selection.name}…</div>}

        {selection && verdict && (
          <section className="verdict-card" aria-live="polite">
            {selection.image && <img className="verdict-image" src={selection.image} alt={selection.name} />}
            <div className="verdict-content">
              {mode !== "photo" && <p className="verdict-food">{selection.name}</p>}
              <h2>
                <span className={`verdict-emoji ${verdict.choice}`} aria-hidden="true">{emoji[verdict.choice]}</span>
                <span>Jev says {labels[verdict.choice].toLowerCase()}.</span>
              </h2>
              {mode === "photo" && selection.description && <p className="detected">{selection.description}</p>}
              <div className="probability-list">
                {categories.map((category) => (
                  <div key={category}>
                    <span className="category-label"><span aria-hidden="true">{emoji[category]}</span>{labels[category]}</span>
                    <i><b style={{ width: `${verdict.probabilities[category] * 100}%` }} /></i>
                    <strong>{Math.round(verdict.probabilities[category] * 100)}%</strong>
                  </div>
                ))}
              </div>
              <button className="again" onClick={() => reset(mode)}>Try another food</button>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer"><button onClick={() => setDialog("credits")}>Photo credits</button></footer>
      {dialog === "rules" && <Dialog title="The rules" onClose={() => setDialog(null)}><Rules /></Dialog>}
      {dialog === "credits" && <Dialog title="Photo credits" onClose={() => setDialog(null)}><Credits /></Dialog>}
    </div>
  );
}
