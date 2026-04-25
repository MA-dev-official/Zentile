# Workspace

## Overview

pnpm workspace monorepo. Currently hosting **Zentile**, a vanilla HTML/CSS/JS sliding-tile puzzle (15-puzzle) built with Vite. No backend, no TypeScript in the app, no external CDN/Google assets — entirely client-side.

## Zentile Artifact

- Path: `artifacts/zentile/`
- Stack: Vite + vanilla JS + plain CSS
- Pages: Home (board-size picker for 3×3 / 4×4 / 5×5 / 6×6) and Game
- Engine: `src/main.js` (Puzzle class — pointer/touch/mouse/keyboard, animated CSS transforms, guaranteed-solvable random shuffle, win detection, best-times in `localStorage`, win overlay + confetti)
- Empty cell rests at the top-left in the solved state.
- SEO: meta tags, Open Graph, JSON-LD Game schema, robots.txt, sitemap.xml, web manifest.
- Deep-link: `/#play/N` opens the N×N board directly.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
