export type Category = "soup" | "salad" | "sandwich";
export type Verdict = {
  id: string;
  choice: Category;
  probabilities: Record<Category, number>;
  durationMs: number;
};
export type HumanAnswer = {
  choice: Category;
  durationMs: number;
  interrupted: boolean;
};
export const categories: Category[] = ["soup", "salad", "sandwich"];
export const labels: Record<Category, string> = {
  soup: "Soup",
  salad: "Salad",
  sandwich: "Sandwich",
};
export function time(ms: number) {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}
export function selectFoods<T extends { debatable: boolean }>(
  items: T[],
  count = 5,
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const selection = copy.slice(0, count);
  if (!selection.some((f) => f.debatable)) {
    const debate = copy.find((f) => f.debatable);
    if (debate && selection.length) selection[selection.length - 1] = debate;
  }
  return selection;
}
export function parseEvent(line: string): {
  type: string;
  [key: string]: unknown;
} {
  const value = JSON.parse(line);
  if (!value || typeof value !== "object" || typeof value.type !== "string")
    throw new Error("Invalid game response.");
  return value;
}
