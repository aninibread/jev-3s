export const categories = ["soup", "salad", "sandwich"] as const;
export type Category = (typeof categories)[number];
export type Probabilities = Record<Category, number>;
export type Classification = {
  choice: Category;
  probabilities: Probabilities;
  durationMs: number;
};
export type RaceEvent =
  | ({ type: "result"; id: string } & Classification)
  | { type: "error"; id: string; message: string }
  | { type: "done"; durationMs: number };
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_DESCRIPTION_LENGTH = 1200;
export const RULES_VERSION = "1";
export const classificationRules = {
  soup: "Ingredients served in substantial liquid and eaten with that liquid. Includes cereal with milk, stews and soup in a bread bowl. Soup takes precedence over an edible container.",
  sandwich:
    "A dish supported by or enclosed in bread, dough, an edible wrapper or casing, without substantial serving liquid. Includes pizza, tacos, burritos, sushi rolls and dumplings.",
  salad:
    "Everything else: a prepared dish that is neither served in substantial liquid nor supported by an edible wrapper or base. Includes dressed vegetables, rice dishes and loose pasta.",
} as const;
