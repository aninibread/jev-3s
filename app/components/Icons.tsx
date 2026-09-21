import type { Category } from "../lib/game";
export function FoodIcon({
  type,
  size = 28,
}: {
  type: Category;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "soup" ? (
        <>
          <path d="M5 19h30c-1 9-6 14-15 14S6 28 5 19Z" />
          <path d="M12 35h16M14 13c-5-5 5-5 0-10M24 13c-5-5 5-5 0-10" />
        </>
      ) : type === "salad" ? (
        <>
          <path d="M5 23h30c-2 8-7 12-15 12S7 31 5 23Z" />
          <path d="M12 22C1 12 13 5 20 16c-1-14 13-14 10-3 12 0 7 12 0 10M13 13l7 9M27 11l-4 11" />
        </>
      ) : (
        <>
          <path d="M5 27 21 7l15 20H5ZM5 27v6h31v-6M10 23h20M12 27l6 4 5-4 6 4" />
          <path d="m20 16 1-1m3 6 1-1" />
        </>
      )}
    </svg>
  );
}
export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      style={back ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}
export function Spark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
    </svg>
  );
}
