import { useEffect, useId, useRef, useState } from "react";

type Choice = "soup" | "salad" | "sandwich";
type Verdict = {
  choice: Choice;
  probabilities: Record<Choice, number>;
  durationMs: number;
};
const choices: Choice[] = ["soup", "salad", "sandwich"];
const emoji: Record<Choice, string> = {
  soup: "🥣",
  salad: "🥗",
  sandwich: "🥪",
};
const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const time = (milliseconds: number) =>
  milliseconds < 1000
    ? `${Math.round(milliseconds)} ms`
    : `${(milliseconds / 1000).toFixed(2)} s`;

function validProbabilities(value: unknown): value is Record<Choice, number> {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return choices.every(
    (key) =>
      typeof p[key] === "number" &&
      Number.isFinite(p[key]) &&
      p[key] >= 0 &&
      p[key] <= 1,
  );
}

async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const ratio = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Unable to prepare this photo. Try another image.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(
                new Error("Unable to prepare this photo. Try another image."),
              ),
        "image/jpeg",
        0.85,
      ),
    );
  } finally {
    bitmap.close();
  }
}

async function responseBody(response: Response) {
  const raw: unknown = await response.json().catch(() => null);
  const body =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  if (!response.ok) {
    const message =
      typeof body?.error === "string"
        ? body.error
        : "Unable to finish. Check your connection and try again.";
    throw new Error(message);
  }
  return body;
}

export function UploadPanel({ onClose }: { onClose: () => void }) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [visionMs, setVisionMs] = useState<number | null>(null);
  const [phase, setPhase] = useState<
    "empty" | "reading" | "ready" | "classifying" | "done"
  >("empty");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [humanChoice, setHumanChoice] = useState<Choice | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const controller = useRef<AbortController | null>(null);
  const revision = useRef(0);
  const previewUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const busy = phase === "reading" || phase === "classifying";

  useEffect(
    () => () => {
      revision.current += 1;
      controller.current?.abort();
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  async function selectFile(file: File) {
    const current = ++revision.current;
    controller.current?.abort();
    controller.current = new AbortController();
    const signal = AbortSignal.any([
      controller.current.signal,
      AbortSignal.timeout(40000),
    ]);
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
    setPreview(null);
    setDescription("");
    setVerdict(null);
    setHumanChoice(null);
    setVisionMs(null);
    setError("");
    setPhase("empty");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP photo.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("This photo is too large. Choose one smaller than 8 MB.");
      return;
    }
    previewUrl.current = URL.createObjectURL(file);
    setPreview(previewUrl.current);
    setFileName(file.name);
    setPhase("reading");
    try {
      const blob = await prepareImage(file);
      if (current !== revision.current) return;
      const data = new FormData();
      data.append("image", blob, "food.jpg");
      const body = await responseBody(
        await fetch("/api/analyze", { method: "POST", body: data, signal }),
      );
      if (current !== revision.current) return;
      if (
        typeof body?.description !== "string" ||
        !body.description.trim() ||
        typeof body.durationMs !== "number" ||
        !Number.isFinite(body.durationMs)
      ) {
        throw new Error("Unable to identify this food. Try a clearer photo.");
      }
      setDescription(body.description);
      setVisionMs(body.durationMs as number);
      setPhase("ready");
    } catch (issue) {
      if (current !== revision.current) return;
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to read this photo. Try another image.",
      );
      setPhase("empty");
    }
  }

  async function classify(choice: Choice) {
    if (busy) return;
    if (description.trim().length < 8) {
      setError(
        "Describe the food in at least 8 characters before choosing a category.",
      );
      descriptionInput.current?.focus();
      return;
    }
    const current = ++revision.current;
    controller.current?.abort();
    controller.current = new AbortController();
    const signal = AbortSignal.any([
      controller.current.signal,
      AbortSignal.timeout(40000),
    ]);
    setHumanChoice(choice);
    setVerdict(null);
    setError("");
    setPhase("classifying");
    try {
      const body = await responseBody(
        await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: description.trim() }),
          signal,
        }),
      );
      if (current !== revision.current) return;
      if (
        !choices.includes(body?.choice as Choice) ||
        typeof body.durationMs !== "number" ||
        !Number.isFinite(body.durationMs) ||
        !validProbabilities(body.probabilities)
      ) {
        throw new Error(
          "Jev’s answer didn’t arrive correctly. Choose a category to try again.",
        );
      }
      setVerdict({
        choice: body.choice as Choice,
        probabilities: body.probabilities as Record<Choice, number>,
        durationMs: body.durationMs as number,
      });
      setPhase("done");
    } catch (issue) {
      if (current !== revision.current) return;
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to reach Jev. Choose a category to try again.",
      );
      setPhase("ready");
    }
  }

  return (
    <section className="upload-panel" aria-labelledby={`${id}-heading`}>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        ← Back to game
      </button>
      <div className="upload-heading">
        <p className="eyebrow">Bring your own debate</p>
        <h1 id={`${id}-heading`}>What’s on your plate?</h1>
        <p>Bring a food photo. Make your call. See if Jev agrees.</p>
      </div>
      <div
        className={`upload-drop${dragging ? " is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void selectFile(file);
        }}
      >
        {preview ? (
          <img
            className="upload-preview"
            src={preview}
            alt="Food photo you selected"
          />
        ) : (
          <span className="upload-illustration" aria-hidden="true">
            🍽️
          </span>
        )}
        <label className="field-label" htmlFor={`${id}-file`}>
          {preview ? "Try a different photo" : "Choose a food photo"}
        </label>
        <input
          ref={fileInput}
          id={`${id}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={`${id}-file-hint`}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void selectFile(file);
          }}
        />
        <p className="upload-meta" id={`${id}-file-hint`}>
          Or drop it here · JPEG, PNG, or WebP · Up to 8 MB
        </p>
        {preview && <p className="upload-meta upload-filename">{fileName}</p>}
      </div>
      <p className="notice" role="status">
        {phase === "reading"
          ? "Reading your photo…"
          : phase === "classifying"
            ? "Your choice is in. Jev is deciding…"
            : phase === "ready"
              ? "Photo read. Check the description, then make your call."
              : phase === "done" && verdict
                ? `You chose ${humanChoice}. Jev chose ${verdict.choice}.`
                : ""}
      </p>
      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}
      {preview && phase === "empty" && error && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            setPhase("ready");
            setError("");
          }}
        >
          Describe this food instead
        </button>
      )}
      {(phase === "ready" || phase === "classifying" || phase === "done") && (
        <>
          <label className="field-label" htmlFor={`${id}-description`}>
            What the photo shows
          </label>
          <textarea
            ref={descriptionInput}
            className="text-input"
            id={`${id}-description`}
            value={description}
            rows={3}
            maxLength={1200}
            disabled={phase === "classifying"}
            aria-invalid={
              !description.trim() && Boolean(error) ? true : undefined
            }
            aria-describedby={`${id}-description-hint`}
            onChange={(event) => {
              setDescription(event.target.value);
              setVerdict(null);
              setHumanChoice(null);
              setPhase("ready");
              setError("");
            }}
          />
          <p className="upload-meta" id={`${id}-description-hint`}>
            Correct anything it missed. Jev classifies this description.
          </p>
          <div className="upload-actions">
            <h2>What’s your call?</h2>
            <div className="category-buttons">
              {choices.map((choice) => (
                <button
                  type="button"
                  key={choice}
                  className={`choice-button choice-${choice}${humanChoice === choice ? " is-selected" : ""}`}
                  disabled={phase === "classifying"}
                  aria-pressed={humanChoice === choice}
                  onClick={() => void classify(choice)}
                >
                  <span aria-hidden="true">{emoji[choice]}</span>{" "}
                  {label(choice)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {verdict && (
        <div className="upload-result">
          <p className="eyebrow">
            {humanChoice === verdict.choice
              ? "Great minds. Same category."
              : "A delicious disagreement."}
          </p>
          <h2>
            You say {humanChoice}. Jev says {verdict.choice}.
          </h2>
          <div
            className="probabilities"
            aria-label="Jev’s category probabilities"
          >
            {choices.map((choice) => (
              <div className="probability-row" key={choice}>
                <span>{label(choice)}</span>
                <strong>
                  {Math.round(verdict.probabilities[choice] * 100)}%
                </strong>
                <div className="probability-track" aria-hidden="true">
                  <div
                    className={`probability-fill probability-${choice}`}
                    style={{ width: `${verdict.probabilities[choice] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="upload-meta upload-timings">
            <span>
              Photo reading: {visionMs === null ? "—" : time(visionMs)}
            </span>
            <span>Jev response: {time(verdict.durationMs)}</span>
          </div>
          <p className="upload-meta">
            Two separate steps. Times measure each AI response, excluding the
            upload.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fileInput.current?.click()}
          >
            Try another food
          </button>
        </div>
      )}
      <p className="upload-meta">
        The photo is read first. Only its description is sent to Jev.
      </p>
    </section>
  );
}
