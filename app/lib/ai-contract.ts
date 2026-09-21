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
export const RULES_VERSION = "2";
export const dogCategories = ["wolf", "pig", "rat"] as const;
export type DogCategory = (typeof dogCategories)[number];
export type DogClassification = {
  choice: DogCategory;
  probabilities: Record<DogCategory, number>;
  durationMs: number;
};
export const DOG_RULES_VERSION = "4";
export const classificationRules = {
  soup: "A wet mixture: a prepared dish in which free-flowing liquid is a substantial part of the normal presentation and is eaten together with ingredients suspended in, surrounded by or blended into it. Includes broth-based dishes, cereal with milk, stews and soup in a bread bowl.",
  sandwich:
    "A prepared food with a distinct edible outer layer or base that supports, contains, wraps or encloses other ingredients, without substantial free-flowing liquid. The structure can be bread, dough, a tortilla, a casing, rice or another edible base. Includes pizza, tacos, burritos, sushi rolls, dumplings and hot dogs.",
  salad:
    "A dry or moist mixture: a prepared dish made by mixing, tossing or assembling multiple ingredients or separate pieces, without substantial free-flowing liquid and without a distinct edible outer layer or base containing the rest. Includes vegetable, fruit, grain, rice and pasta salads, stir-fries and other loose mixed dishes.",
} as const;

export const dogClassificationRules = {
  wolf:
    "A wolf-like dog: medium or large, athletic or rangy, with a longer muzzle and an alert, substantial frame. Upright ears strengthen this match but are not required. Includes huskies, shepherds and retrievers unless pig or rat traits are clearly stronger.",
  pig:
    "A pig-like dog: compact, broad, stocky or barrel-bodied with a clearly short blunt snout; this is the defining feature. A broad face, wrinkles or heavy jowls strengthen the match. Includes bulldogs and pugs.",
  rat:
    "A rat-like dog: small or fine-boned, with a narrow or pointed face, conspicuously large ears or eyes, delicate limbs, or a very long low body. Includes chihuahuas, dachshunds and many toy breeds.",
} as const;
