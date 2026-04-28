# Zentile

A fully client-side sliding-tile puzzle (15-puzzle) built with vanilla HTML, CSS, and JavaScript on Vite. No backend, no environment variables, no external CDN/Google assets...

## Structure

```
artifacts/zentile/
├── index.html              # SEO-rich HTML entry
├── vite.config.js          # Vite config (port and base hardcoded)
├── package.json            # Vite only
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.js             # Game engine + router
    └── style.css           # All styling
```

## Features

- Home page with 3×3 / 4×4 / 5×5 / 6×6 board picker
- Empty cell starts at the top-left in the solved state
- Tap, click, swipe, drag, and arrow-key controls
- Smooth animated CSS transforms
- Local best-time tracking via `localStorage`
- Win overlay with confetti
- Responsive for mobile and desktop
- SEO: meta tags, Open Graph, JSON-LD, robots.txt, sitemap.xml, manifest

## Commands

- `pnpm --filter @workspace/zentile run dev` — start dev server
- `pnpm --filter @workspace/zentile run build` — production build
- `pnpm --filter @workspace/zentile run serve` — preview built output
