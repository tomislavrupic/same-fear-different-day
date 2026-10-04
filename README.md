# SAME FEAR, DIFFERENT DAY™

KitiKat Studios: real songs, fake products, questionable solutions.

Standalone, dependency-free GitHub Pages album catalog. No payment functionality or external analytics. The main website is untouched.

## Local preview

Run `python3 -m http.server 4173 --directory site` and open http://localhost:4173.

## Products

Edit `site/tracks.json` to add songs, change copy, supply verified lyrics, or connect YouTube. All markup generates from this data. Set `youtubeId` or a valid `youtubeUrl`, and `youtubeStatus` to `public` or `unlisted` only after verifying playback access. Private videos retain local audio playback.

MP3s are optimized listening derivatives. Original WAV/MOV/MP4 masters are excluded from Git. Tracks 02–07 packaging is supplied artwork. Track 01 cover is a frame extracted from the supplied video. Hero is generated using the supplied storefront as a visual reference. SVG labels are original code-native designs, with transparent surroundings. Fake reviews are explicitly labeled fictional in the detail view. Operating instructions are catalog copy, not invented lyrics.

## Deployment

Push to `main` in `tomislavrupic/same-fear-different-day`. The Pages workflow publishes only `site/`. All asset URLs are relative for a GitHub project-site subpath. The account and repository are separate from the existing portfolio deployment.

## Upload review

`upload-manifest.json` is local only: source checksums, technical metadata, intended descriptions, candidate thumbnails and returned video IDs. It contains no credentials and is excluded from deployment. Track 03's MOV is about 5.6 seconds longer than its WAV; confirm the intended master before changing uploads. No lyrics were supplied.
