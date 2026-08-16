# THE SALON — Convened by Bluemind Foundation

Landing page V2, built with Vue 3 + Vite, with a small Express backend for the
invitation form and a password-protected requests dashboard.

## Stack

- Vue 3 (`<script setup>`) + Vite — frontend
- Express — backend (saves invitation requests, serves the dashboard API)
- No UI framework — bespoke, minimal CSS with design tokens in `src/style.css`
- Self-hosted fonts via `@fontsource/*` (Archivo Black, Fraunces, Poppins)

## Structure

- `src/components/TheHero.vue` — hero screen (title, date/location, CTA)
- `src/components/TheIdea.vue` — single statement screen
- `src/components/ThreeActs.vue` — Act I / II / III
- `src/components/InvitationForm.vue` — multi-step "Request an Invitation" form
- `src/components/DashboardView.vue` — password-protected requests dashboard (`/dashboard`)
- `src/components/StickyCta.vue` — discreet sticky CTA
- `src/components/TheFooter.vue` — footer
- `src/components/PeignePick.vue` — the peigne artwork
- `src/directives/reveal.js` — subtle scroll-reveal directive (`v-reveal`)
- `server/index.js` — Express API (invitation submissions + dashboard)

## Setup

```bash
npm install
cp .env.example .env   # then set a real DASHBOARD_PASSWORD
```

## Develop

Runs the Vite dev server and the API together (Vite proxies `/api` to the
API server):

```bash
npm run dev:full
```

Or run them separately in two terminals if you prefer:

```bash
npm run server   # API on PORT (default 3001)
npm run dev      # Vite dev server, proxies /api to the server above
```

## Build & run in production

```bash
npm run build
npm start
```

`npm start` runs the Express server, which serves the built frontend
(`dist/`) and the API from a single process/port.

## Invitation data & the dashboard

- Submissions are appended to `server/data/submissions.json` (git-ignored —
  never commit real requests). The file and its parent directory are created
  automatically on first submission.
- Visit `/dashboard` to view requests and download them as an `.xlsx` file.
  It's protected by `DASHBOARD_PASSWORD` from your `.env` — there's no
  dashboard access without it set.

## Notes

- English only, no locale switching.
