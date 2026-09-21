import { useRef } from "react";

function BouncyEmoji({ emoji, label }: { emoji: string; label: string }) {
  const animation = useRef<Animation | null>(null);
  return (
    <button
      type="button"
      className="floating-emoji"
      aria-label={`Bounce ${label}`}
      onClick={(event) => {
        animation.current?.cancel();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        animation.current = event.currentTarget.animate(
          reduced
            ? [{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }]
            : [
                { transform: "translateY(0) scale(1)", offset: 0 },
                { transform: "translateY(3px) scale(1.12, .85)", offset: .15 },
                { transform: "translateY(-22px) scale(.94, 1.08) rotate(-8deg)", offset: .4 },
                { transform: "translateY(2px) scale(1.07, .93)", offset: .7 },
                { transform: "translateY(-6px) scale(1) rotate(3deg)", offset: .85 },
                { transform: "translateY(0) scale(1)", offset: 1 },
              ],
          { duration: reduced ? 180 : 580, easing: "ease-out" },
        );
      }}
    >
      <span aria-hidden="true">{emoji}</span>
    </button>
  );
}

export function FloatingEmojis({ game }: { game: "food" | "dogs" }) {
  const items = game === "food"
    ? [["🍜", "soup"], ["🥗", "salad"], ["🥪", "sandwich"]]
    : [["🐺", "wolf"], ["🐷", "pig"], ["🐀", "rat"]];
  return (
    <div className="floating-emojis" role="group" aria-label="Playful emojis">
      {items.map(([emoji, label]) => (
        <div className="emoji-float" key={label}>
          <BouncyEmoji emoji={emoji} label={label} />
        </div>
      ))}
    </div>
  );
}
