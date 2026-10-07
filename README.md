# SAME FEAR, DIFFERENT DAY™

KitiKat Studios: real songs, fake products, questionable solutions.

Standalone, dependency-free GitHub Pages album catalog. No payment functionality or external analytics. The main website is untouched.

## Local preview

Run `python3 -m http.server 4173 --directory site` and open http://localhost:4173.

## Products

Edit `site/tracks.json` to add songs, change copy, supply verified lyrics, or connect YouTube. All markup generates from this data. Set `youtubeId` or a valid `youtubeUrl`, and `youtubeStatus` to `public` or `unlisted` only after verifying playback access. Private videos retain local audio playback.

MP3s are optimized listening derivatives. Original WAV/MOV/MP4 masters are excluded from Git. Tracks 02–07 packaging is supplied artwork. Track 01 cover is a frame extracted from the supplied video. Hero is generated using the supplied storefront as a visual reference. SVG labels are original code-native designs, with transparent surroundings. Fake reviews are explicitly labeled fictional in the detail view. Operating instructions are catalog copy, not invented lyrics.

## Deployment

Push to `main` in `tomislavrupic/same-fear-different-day`. The Pages workflow builds and publishes only `_deploy/` from `site/`. All asset URLs are relative for a GitHub project-site subpath. The account and repository are separate from the existing portfolio deployment.

## Upload review

`upload-manifest.json` is local only: source checksums, technical metadata, intended descriptions, candidate thumbnails and returned video IDs. It contains no credentials and is excluded from deployment. Track 03's MOV is about 5.6 seconds longer than its WAV; confirm the intended master before changing uploads. No lyrics were supplied.

## Premium Cognitive Authenticity Scanner

The detector is an interactive premium product in the same catalog data, plus a persistent header button. `site/scanner.js` controls a fullscreen native dialog with timed fictional checks, a 99% pause, randomized metrics, repeat scans and model-blaming replies. `site/scanner-diagnosis.js` chooses exactly one D13 slot out of 13, four contamination slots, and eight probably-human slots. No brain scan, model call, medical diagnosis, or user-data transmission occurs. Only the scan-attempt counter is stored locally. Closing cancels timers and releases scrolling. Supplied detector artwork is optimized to WebP without changing the original.

Run `npm test` for probability and scanner lifecycle checks; no packages are required.

## Cache-safe releases

`npm run build` fingerprints CSS, JavaScript modules, catalog JSON, and sticker data, then rewrites all release references in `_deploy/`. Every changed dependency gets a fresh URL, preventing a new HTML document from using stale scanner code or a seven-product catalog. `node tests/release.mjs` checks this full dependency chain after building. GitHub Pages deploys this generated directory.

Track 08, SEXY INTELLIGENCE™, uses user-supplied packaging and lyrics. The local master is in `9/` despite its album position being 08; preserve this source numbering. Concept credit: Kiri. AI Hater now uses the user-selected full packaging photo `01/HTuBJI_W8AARiA8.jpeg`.

## Titty Tweeter

The Titty Tweeter product is a real, free Pixel Records macOS Audio Unit with a fictional collector’s box. Its catalog card shows the packaging; opening the product detail reveals the 18-second intro, with user-controlled playback and the sound from the creator’s supplied recording. The info/download button opens the public Titty Tweeter landing page. Packaging and intro assets live under `site/assets/titty-tweeter-*`. The source recording and editable video composition remain in the Titty Tweeter workspace; they are not copied into this store repository.
