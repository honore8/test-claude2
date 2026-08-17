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
- `src/components/ThreeActs.vue` — Act I / II / III
- `src/components/InvitationForm.vue` — multi-step "Request an Invitation" form
- `src/components/DashboardView.vue` — password-protected requests dashboard (`/dashboard`)
- `src/components/StickyCta.vue` — discreet sticky CTA
- `src/components/TheFooter.vue` — footer
- `src/components/PeignePick.vue` — the peigne artwork
- `src/directives/reveal.js` — subtle scroll-reveal directive (`v-reveal`)
- `server/index.js` — Express API (invitation submissions + dashboard)
- `server/lib/ics.js` — builds the provisional "Save the Date" `.ics` file
- `server/lib/email.js` — sends the automated confirmation email via Resend

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

## Automated confirmation email

Each submitted request triggers a confirmation email (subject "Your request
to join THE SALON by Bluemind Foundation 💙") with a provisional, TENTATIVE
`.ics` calendar attachment reserving September 17, 2026, 4–8pm New York time
— clearly labeled as pending confirmation, not a confirmed invitation.

Sending is handled by [Resend](https://resend.com) and is entirely optional:
set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in your `.env` to enable it (see
`.env.example`). If they're not set, submissions still work normally — the
email step is just skipped, exactly like the dashboard is skipped without
`DASHBOARD_PASSWORD`. Resend requires verifying a sending domain before
`RESEND_FROM_EMAIL` can send from an address on it.

## Notes

- English only, no locale switching.
