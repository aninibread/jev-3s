# 3s — Soup, salad or sandwich?

A five-food game of human instinct versus Jev, built with React Router, Tailwind CSS, and Cloudflare Workers AI.

## Run locally

Use Node.js 22.12+ (Node 24 recommended), then:

```sh
npm install
npx wrangler login
npm run dev
```

If the computer runs out of file watchers, use `CHOKIDAR_USEPOLLING=true npm run dev`.

Cloudflare account `323f42859527b406beadd91bff779583` is explicitly configured in `wrangler.jsonc`. The AI binding is remote, so local gameplay calls real Cloudflare services. Jev (`typesafe/jev`) requires available AI Gateway credits or a supported provider-key setup. No separate API key is embedded in the app. During initial verification, both the binding and direct account REST endpoint returned HTTP 402 / code 2021, insufficient AI Gateway balance. The photo-reading model completed successfully.

## Included

- Five concurrent Jev classifications, streamed as NDJSON; answers remain hidden in the UI until the matching human choice.
- 23 food photos with individual Wikimedia Commons credit and license links.
- Per-food decisions and probabilities, active human timing, parallel batch timing, and explicit measurement context.
- Upload and drop photos, resize them before sending, review/correct the vision description, then compare with Jev.
- Rules and credits dialogs, keyboard shortcuts, mobile layouts, reduced-motion support.
- Share summary text or download a result image; no account or database needed.

## Endpoints

- `POST /api/race`: `{ "ids": [five unique catalog food IDs] }`; returns result/error events followed by done.
- `POST /api/analyze`: multipart form field `image`; returns description and photo-reading duration. Browser accepts up to 8 MB, resizes to 1280px and JPEG; server caps processed images at 4 MB.
- `POST /api/classify`: `{ "description": "8–1200 characters" }`; returns category, probabilities, and Jev response duration.
- `GET /api/status`: binding presence only, not an inference or billing health check.

The upload vision model is `@cf/llava-hf/llava-1.5-7b-hf`. Jev reads text descriptions, not images. Photos are not persisted by the application. The Worker has a per-IP rate limit of 12 requests per minute. Native model calls can incur usage charges.

## Verify

```sh
npm test
npm run typecheck
npm run build
```

Tests cover response validation, probability distributions, random game selection, asset metadata, bounded request bodies, image signatures, request origin validation, streaming results, and model failures. Test AI responses exist only in tests; production never substitutes fixture answers or timings.

For browser verification, desktop and 390px/320px layouts were checked. The five-round success journey, out-of-order responses, concealed answers, replay, uploads and download were exercised with browser-intercepted test responses. Real photo analysis succeeded. Real Jev success remains unverified pending account credits. No deployment has been made.

## Deploy

After live Jev verification, deploy to the configured account with `npm run deploy`. This publishes the app publicly. Confirm account and billing before doing so.

## Image licenses

Every served food image is listed in `app/lib/foods.ts`, including the original file page, photographer, license, and modifications. Resized WebP copies retain the original image licenses. The app’s Photo credits dialog exposes this information. Source metadata was retrieved from Wikimedia Commons. Game cards may crop images visually; downloaded result images contain text only.
