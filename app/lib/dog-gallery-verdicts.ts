import type { DogClassification } from "./ai-contract";

export const dogGalleryVerdicts: Record<string, DogClassification> = {
  husky: { choice: "wolf", probabilities: { wolf: 1, pig: 0, rat: 0 }, durationMs: 0 },
  corgi: { choice: "pig", probabilities: { wolf: 0, pig: 1, rat: 0 }, durationMs: 0 },
  bulldog: { choice: "pig", probabilities: { wolf: 0, pig: 1, rat: 0 }, durationMs: 0 },
  chihuahua: { choice: "rat", probabilities: { wolf: 0, pig: 0, rat: 1 }, durationMs: 0 },
  dachshund: { choice: "rat", probabilities: { wolf: 0, pig: 0, rat: 1 }, durationMs: 0 },
  "golden-retriever": { choice: "wolf", probabilities: { wolf: 1, pig: 0, rat: 0 }, durationMs: 0 },
};
