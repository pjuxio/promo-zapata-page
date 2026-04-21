# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:8080 (live reload)
npm run build    # Production build → _site/
npm run convert:128  # Convert audio via scripts/convert-zapata-to-vbr.sh
```

No lint or test commands exist in this project.

## Architecture

This is a single-page 11ty (Eleventy v2) static site. The entire site is one HTML file rendered with Nunjucks.

**Assets** live at the project root (not inside `src/`) and are passthrough-copied verbatim to `_site/` by `.eleventy.js`: `css/`, `js/`, `img/`, `mp3/`.

**Input/output:**
- `src/` → 11ty input (`src/index.html` is the only template)
- `_site/` → build output (do not edit directly)
- Template engine: Nunjucks (set in `.eleventy.js`)

**JavaScript:** `js/player.js` handles all interactivity — audio playback, playlist state, volume drag, navbar toggle, and scroll-based active nav highlighting. It is loaded as a plain script at the bottom of `index.html`; there is no bundler.

**Styles:** Split across two files — `css/style.css` (layout, sections, typography) and `css/player.css` (player UI, playlist, album art). Both are loaded in `<head>`.

**Nav order:** The navbar links must match DOM section order (top to bottom) — the scroll-spy in `player.js` activates links based on `offsetTop`, so out-of-order links will never highlight correctly.

**Audio:** MP3 files in `mp3/` are referenced directly from `data-src` attributes on `.track-item` elements in the playlist. Duration (in seconds) is hardcoded as `data-duration` on each track item and used for progress bar calculation since the audio element uses `preload="none"`.

**Deployment:** Netlify, configured in `netlify.toml`. Build command is `npm run build`, publish dir is `_site`, Node 18.
