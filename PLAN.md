# 3s — Human vs. Jev

## What we are building

A minimal, playful food classification game built on the existing React Router, Tailwind, and Cloudflare Workers project. Every food must be classified as soup, salad, or sandwich.

The hook: Jev works through the entire five-food set while the human makes their decisions one at a time. Its answers stay hidden until the human answers each corresponding question. The game showcases measured speed and entertaining disagreements, rather than assuming Jev is always correct.

## First release

- Five-round games drawn from a curated collection of food photos.
- Live Jev classification through Workers AI.
- A visible Jev completion counter, with answers concealed until the player commits.
- Per-round choices, timing, and category probabilities.
- A final comparison and shareable result.
- A separate upload flow for trying a personal food photo.
- Responsive layout, touch controls, keyboard support, and reduced-motion support.

Accounts, public leaderboards, persistent uploads, and community voting are outside the first release.

## Visual direction

Warm cream background, near-black typography, generous whitespace, and a single central food card. Soup uses tomato red, salad uses leafy green, and sandwich uses mustard yellow. Category labels and icons accompany color everywhere.

Use large food photography, chunky rounded buttons, small progress dots, and subtle card transitions. Keep motion short and functional. The tone is playful and slightly argumentative: “You disagree on cereal. Understandable.”

The opening screen reads “All food is three things. How fast can you decide?” with a primary “Race Jev” action and secondary “Upload a food” action. A short rules panel is available before play.

## Game flow

### 1. Prepare the race

Select five distinct food cards and preload their images. Each card includes a neutral description that identifies visible ingredients and presentation without assigning a category. Display that description to the player too, so the information supplied to Jev is inspectable.

After the player starts, reveal the first card and begin the session clock. Start fresh classification calls for all five foods at this point; do not classify them before the race or substitute cached answers for live timings.

### 2. Jev works on the full set

The Worker dispatches a bounded group of five independent Jev calls concurrently, one per food. Each call uses the same category rules. This is parallel classification, not a claimed native batch API.

Stream completed results to the browser as they arrive, keyed by food ID. The UI shows real progress such as “Jev: 3/5 decided,” then “Jev finished all 5.” It never invents progress or delays a completed answer to simulate thinking. The answer labels remain hidden until the player has committed their corresponding choices.

Answers may be held in browser memory because this is a casual game; hiding them in the interface is not an anti-cheat mechanism.

### 3. The human answers one at a time

Show one food photo, its name and neutral description, the round counter, and three large category buttons. Support keys 1, 2, and 3 as an alternative to tapping.

Begin each human decision timer when that card is visible and interactive. Lock the choice on the first valid input, preventing double submissions. Pause before a new card if the page is hidden; mark interrupted rounds as unsuitable for speed comparison.

### 4. Reveal each result

After the human chooses, unveil Jev’s answer for that food, both choices, the human decision time, the Jev call duration, and three category probability bars. Use “You agree” or “A food dispute,” not “correct” or “wrong.”

If Jev is still working on that item, keep the human answer locked and show an honest waiting state. A “Next food” button advances when the player is ready. Reading results does not count toward active decision time.

A compact strip of five cards gradually reveals completed comparisons while leaving future Jev answers concealed.

### 5. Final result

Show agreement out of five, human active decision time, and Jev’s elapsed time to finish the full set. Label these as different measurements: the human answers sequentially while Jev processes foods concurrently. Also show total human session duration separately from active thinking time.

Provide per-food timing details, “Play again,” “Upload a food,” and a shareable summary card. Avoid accuracy scores and universal speed claims. Only calculate ratios for complete, valid measurements, with the compared metrics clearly named.

## Classification rules

Use a single versioned ruleset based on the linked soup/salad/sandwich discussion:

- Soup: a dish whose ingredients are served in substantial liquid and eaten as such.
- Sandwich: a dish held together or supported by an edible wrapper, casing, or bread-like base, including the intentionally broad interpretations used by the game.
- Salad: a prepared dish that fits neither of the other categories.

Include explicit examples and precedence for ambiguous cases, such as cereal with milk, pizza, tacos, and bread-bowl soup. Make this ruleset available to users. Curated descriptions must describe the dish without embedding the expected answer.

Jev returns the selected category and probabilities. Any playful response text is templated application copy, not represented as a generated explanation from Jev.

## Uploaded photos

Let a user select or drop a photo, preview it, and submit it. Validate supported file types and size on both client and server, and resize oversized images before sending where practical.

The documented Jev interface does not establish direct image support. Select and verify a currently available Workers AI vision model during implementation. Use it only to produce a neutral food description. Show the description and allow the user to correct it before classification, especially when the image is ambiguous or contains several dishes.

Then run Jev with the same rules and reveal its category probabilities. Allow the user to make their own choice before revealing the result. Show image analysis and Jev classification as distinct steps with separate measured durations. A non-food or unrecognizable image should receive a helpful retry message rather than a fabricated classification.

Uploads are processed transiently by this application; do not save photos to a public gallery or application storage in the first release. Confirm provider data handling before making broader privacy promises.

## Technical approach

Preserve the existing React Router application, Tailwind styling, Cloudflare Vite integration, and Worker entry point.

- Add an AI binding and call `env.AI.run('typesafe/jev', ...)` on the server.
- Use a Choice question with soup, salad, and sandwich criteria, following Cloudflare’s documented input and output shapes.
- Keep the food catalog, neutral descriptions, image attribution, and versioned classification rules in small dedicated modules.
- Add a race endpoint that validates food IDs, runs the five calls with bounded concurrency, and streams per-food results plus completion status.
- Add server endpoints for upload analysis and uploaded-food classification.
- Keep credentials and AI access on the server. Validate response shapes and expose only the fields the UI needs.
- Store current game state in the browser; no database is required for this scope.
- Add request limits, upload limits, timeouts, and useful error states before public launch.

Proposed UI pieces: start screen, food card, category controls, Jev progress indicator, round comparison, session summary, rules panel, and upload panel.

## Timing and measurement

Use monotonic clocks where available. Measure each Jev request around the actual Workers AI call; label it “Jev response time,” because it includes service overhead and is not a pure inference benchmark.

Measure the full-set duration from dispatch until the final successful result returns. Also capture the browser’s request-to-result duration to distinguish visible latency from server-side timing. Do not subtract timestamps from different machines.

Capture human time from visible card to committed choice. Exclude result-reading intervals from active decision totals. Do not fabricate example timings in the working product, extrapolate throughput from one call, or imply an unavailable provider inference metric was measured.

If some model calls fail, show the successful comparisons and a partial-results state. A retry is identified as a retry and is not silently folded into the original race benchmark. Disconnects and timeouts must not leave the UI waiting indefinitely.

## Implementation sequence

1. Establish the visual shell, game state flow, rules, and a curated catalog with licensed or owned photos. Keep any development fixtures explicitly marked.
2. Wire the live Workers AI binding, validate Jev’s response shape, and measure initial latency under five-call concurrency.
3. Implement streamed progress, sequential human choices, concealed answers, incremental reveals, and honest timing summaries.
4. Implement upload preview, vision-based description, correction, and live Jev classification.
5. Add shareable results, responsive polish, keyboard behavior, accessibility, and failure handling.
6. Run the production build and type checks; test the live integration and complete a mobile and desktop playthrough before deployment.

## Acceptance checks

- Starting a game launches classification of all five foods while the human sees the first card.
- Jev progress reflects actual completions, and future answers stay hidden in the UI.
- Results remain associated with the right food even when calls finish out of order.
- Fast human answers, slower model responses, failures, and disconnected streams all produce sensible states.
- Human timing excludes reveal-reading time, and the final screen explains sequential versus concurrent timing.
- Category probabilities and choices come from real validated model responses.
- Keyboard and touch controls work without duplicate answers; reduced-motion preferences are respected.
- Uploads show the recognized description and distinguish vision latency from Jev latency.
- Replay starts a fresh game without stale answers or timers.
- Build, types, targeted game/timing tests, and a live Cloudflare smoke test pass before release.

## References

- Jev on Workers AI: https://developers.cloudflare.com/ai/models/typesafe/jev/
- Original food-category discussion: https://www.reddit.com/r/PaymoneyWubby/comments/tb56v5/food_can_only_be_a_soup_salad_or_a_sandwich/

This document is a proposed implementation plan. No application implementation or deployment is included in this planning step.
