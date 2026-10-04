# Same Fear, Different Day — implementation plan

Build a dependency-free static microsite matching the supplied KitiKat catalog reference. Isolate all code and optimized derivative media in `site/`; preserve every source file and the dirty production website. Use central `tracks.json` for seven products, with local audio for supplied tracks 02–07 and explicit unavailability for track 01. Product dialogs show media, features, warnings, clearly labeled fictional reviews and operating instructions (not invented song lyrics). Add search, condition filters, sorting, persistent cart, keyboard-accessible native dialogs, sharing and humorous support. Create reusable SVG stickers plus a generated hero.

Verify original media with ffprobe and record checksums/metadata in an upload manifest. MOVs are candidates for upload, not editorially certified final masters. No discovered YouTube uploader or authorized channel: prepare metadata, leave IDs null, and request channel authorization only after the build is reviewable. Never invent links or upload state.

Test actual desktop/mobile browser rendering, every product and cart flow, audio decoding, keyboard dismissal, empty search, and asset URLs. Stage an additive `/same-fear/` integration for the existing static export; verify account/project before publication. Do not deploy the entire dirty website or replace existing production output.
