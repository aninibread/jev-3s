import { FloatingEmojis } from "../components/FloatingEmojis";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { dogCategories, type DogCategory, type DogClassification } from "../lib/ai-contract";
import { dogGalleryVerdicts } from "../lib/dog-gallery-verdicts";
import { dogs, type Dog } from "../lib/dogs";

export function meta() {
  return [
    { title: "Wolf, pig, or rat? — Ask Jev" },
    { name: "description", content: "Give Jev a dog. It decides: wolf, pig, or rat." },
  ];
}

type Mode = "text" | "photo" | "gallery";
type Selection = { id?: string; name: string; description: string; image?: string };
const labels: Record<DogCategory, string> = { wolf: "Wolf", pig: "Pig", rat: "Rat" };
const emoji: Record<DogCategory, string> = { wolf: "🐺", pig: "🐷", rat: "🐀" };

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
      <p><b><span aria-hidden="true">🐺</span> Wolf</b> is athletic or substantial, usually with a longer muzzle and a medium or large frame.</p>
      <p><b><span aria-hidden="true">🐷</span> Pig</b> is compact, broad or stocky, often with a blunt muzzle, broad face or short sturdy legs.</p>
      <p><b><span aria-hidden="true">🐀</span> Rat</b> is small or fine-boned, with a narrow face, prominent ears or eyes, or a very long low body.</p>
      <p className="muted">This is about looks, not personality. When the traits conflict, Jev picks the strongest overall resemblance.</p>
    </div>
  );
}

function Credits() {
  return (
    <div className="credits-list">
      <p className="muted">Photos resized and converted to WebP; gallery thumbnails may be cropped.</p>
      {dogs.map((dog) => (
        <div key={dog.id}>
          <a href={dog.sourceUrl} target="_blank" rel="noreferrer"><span>{dog.name}</span><small>{dog.creator}</small></a>
          <a href={dog.licenseUrl} target="_blank" rel="noreferrer"><small>{dog.license}</small></a>
        </div>
      ))}
    </div>
  );
}

function validVerdict(value: unknown): value is DogClassification {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  if (!dogCategories.includes(result.choice as DogCategory) || typeof result.durationMs !== "number") return false;
  if (!result.probabilities || typeof result.probabilities !== "object") return false;
  const probabilities = result.probabilities as Record<string, unknown>;
  return dogCategories.every((category) => typeof probabilities[category] === "number");
}

async function readResponse(response: Response): Promise<Record<string, unknown>> {
  let body: Record<string, unknown> = {};
  try { body = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Jev couldn’t answer. Try again.");
  return body;
}

async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Couldn’t prepare that photo.")),
      "image/jpeg",
      0.85,
    ));
  } finally { bitmap.close(); }
}

export default function Dogs() {
  const fileId = useId();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [verdict, setVerdict] = useState<DogClassification | null>(null);
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
    if (item.id && dogGalleryVerdicts[item.id]) {
      setStatus("idle");
      setVerdict(dogGalleryVerdicts[item.id]);
      return;
    }
    setStatus("deciding");
    try {
      const body = await readResponse(await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: item.description, game: "dogs" }),
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
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 8 * 1024 * 1024) { setError("Choose an image smaller than 8 MB."); return; }
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
      data.append("image", await prepareImage(file), "dog.jpg");
      data.append("game", "dogs");
      const body = await readResponse(await fetch("/api/analyze", {
        method: "POST",
        body: data,
        signal: AbortSignal.any([next.signal, AbortSignal.timeout(35000)]),
      }));
      if (typeof body.description !== "string" || !body.description.trim()) throw new Error("Couldn’t identify a dog in that image.");
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
        <button className="brand" onClick={() => reset("text")}>wpr</button>
        <nav><button onClick={() => setDialog("rules")}>Rules</button></nav>
      </header>
      <main className="classifier">
        <section className="intro">
          <FloatingEmojis game="dogs" />
          <div className="title-row">
            <h1>Wolf, pig, or rat?</h1>
            <Link className="game-switch-tag" to="/" aria-label="Play Soup, salad, or sandwich">🍜</Link>
          </div>
          <p>Give Jev a dog. It has to pick one.</p>
        </section>
        <div className="mode-tabs" role="tablist" aria-label="Choose a dog source">
          {(["text", "photo", "gallery"] as Mode[]).map((item) => (
            <button key={item} role="tab" aria-selected={mode === item} className={mode === item ? "active" : ""} onClick={() => reset(item)}>
              {item === "text" ? "Type" : item === "photo" ? "Photo" : "Gallery"}
            </button>
          ))}
        </div>
        <section className="input-area">
          {mode === "text" && (
            <form className="text-form" onSubmit={(event) => {
              event.preventDefault(); const value = text.trim();
              if (value.length < 2) { setError("Type a dog first."); return; }
              void classify({ name: value, description: value });
            }}>
              <input autoFocus value={text} maxLength={1200} disabled={busy} placeholder="corgi, greyhound, fluffy mutt…" aria-label="Dog breed or description" onChange={(event) => { setText(event.target.value); setError(""); }} />
              <button disabled={busy || text.trim().length < 2}>{status === "deciding" ? "Deciding…" : "Ask Jev"}</button>
            </form>
          )}
          {mode === "photo" && (
            <label className={`photo-drop${dragging ? " dragging" : ""}`} htmlFor={fileId} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void usePhoto(file); }}>
              {selection?.image ? <img src={selection.image} alt="Selected dog" /> : <span aria-hidden="true">＋</span>}
              <strong>{status === "reading" ? "Reading the photo…" : status === "deciding" ? "Jev is deciding…" : selection?.image ? "Choose another photo" : "Choose or drop a dog photo"}</strong>
              <small>JPG, PNG, or WebP · 8 MB max</small>
              <input id={fileId} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void usePhoto(file); }} />
            </label>
          )}
          {mode === "gallery" && !selection && (
            <div className="food-gallery">
              {dogs.map((dog: Dog) => (
                <button key={dog.id} disabled={busy} aria-label={`Ask Jev about ${dog.name}`} onClick={() => void classify({ id: dog.id, name: dog.name, description: dog.description, image: dog.image })}>
                  <img src={dog.image} alt="" /><span>{dog.name}</span>
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
              <h2><span className={`verdict-emoji ${verdict.choice}`} aria-hidden="true">{emoji[verdict.choice]}</span><span>Jev says {verdict.choice}.</span></h2>
              {mode === "photo" && selection.description && <p className="detected">{selection.description}</p>}
              <div className="probability-list">
                {dogCategories.map((category) => (
                  <div key={category}><span className="category-label"><span aria-hidden="true">{emoji[category]}</span>{labels[category]}</span><i><b style={{ width: `${verdict.probabilities[category] * 100}%` }} /></i><strong>{Math.round(verdict.probabilities[category] * 100)}%</strong></div>
                ))}
              </div>
              <button className="again" onClick={() => reset(mode)}>Try another dog</button>
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer"><Link to="/">🥣 Soup, salad, sandwich</Link><button onClick={() => setDialog("credits")}>Photo credits</button></footer>
      {dialog === "rules" && <Dialog title="The rules" onClose={() => setDialog(null)}><Rules /></Dialog>}
      {dialog === "credits" && <Dialog title="Photo credits" onClose={() => setDialog(null)}><Credits /></Dialog>}
    </div>
  );
}
