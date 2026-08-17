# THE SALON — Convened by Bluemind Foundation

Landing page for THE SALON. A single, fully static Vue 3 + Vite app — no
backend, no server process, no environment variables required to run it.
Form submissions are sent as email, entirely from the browser, via EmailJS.

## Stack

- Vue 3 (`<script setup>`) + Vite — the whole app, `npm run build` produces
  a static `dist/` you can host anywhere (Netlify, Vercel, GitHub Pages, S3, ...)
- [EmailJS](https://www.emailjs.com) — sends the guest confirmation email and
  a team-notification email directly from the browser, no server involved
- No UI framework — bespoke, minimal CSS with design tokens in `src/style.css`
- Self-hosted fonts via `@fontsource/*` (Archivo Black, Fraunces, Poppins)

## Structure

- `src/components/TheHero.vue` — hero screen (title, date/location, CTA)
- `src/components/ThreeActs.vue` — Act I / II / III
- `src/components/InvitationForm.vue` — multi-step "Request an Invitation" form
- `src/components/StickyCta.vue` — discreet sticky CTA
- `src/components/TheFooter.vue` — footer
- `src/components/PeignePick.vue` — the peigne artwork
- `src/directives/reveal.js` — subtle scroll-reveal directive (`v-reveal`)
- `src/lib/email.js` — EmailJS config + sends the confirmation/notification emails
- `src/lib/ics.js` — builds the provisional "Save the Date" `.ics` file (downloaded
  client-side from the thank-you screen, not emailed as an attachment)

## Setup

```bash
npm install
```

Then configure EmailJS (see below) by editing `src/lib/email.js` directly —
there's no `.env` file; the whole app is one static build.

## Develop

```bash
npm run dev
```

## Build & deploy

```bash
npm run build
```

This produces a static `dist/` folder — upload it to any static host. There
is nothing to run on a server; the site works identically wherever it's hosted.

## Sending invitation requests (EmailJS)

Because there's no backend, submitting the form sends two emails directly
from the visitor's browser via EmailJS:

1. A confirmation email to the guest (subject "Your request to join THE
   SALON by Bluemind Foundation 💙")
2. A notification email to your team's inbox with every submitted field —
   this is how you'll actually see and manage requests, since there's no
   database or dashboard.

The guest's thank-you screen also offers a "Save the date" button that
downloads a provisional, TENTATIVE `.ics` calendar file (Sept 17, 2026,
4–8pm New York time) directly in the browser.

**One-time setup**, in `src/lib/email.js`:

1. Create a free account at [emailjs.com](https://www.emailjs.com) and
   connect an email provider (Gmail, Outlook, SMTP, ...) as an "Email Service".
2. Create two "Email Templates" in the EmailJS dashboard:
   - a **guest confirmation** template, sending to `{{to_email}}`, using
     `CONFIRMATION_SUBJECT` / `CONFIRMATION_BODY` from `email.js` as its content
   - a **team notification** template, sending to your own inbox, listing
     the submitted fields (the template params are built in
     `buildTemplateParams()` in `email.js` — e.g. `{{first_name}}`,
     `{{email}}`, `{{about_you}}`, `{{contributions}}`, ...)
3. Copy your Service ID, both Template IDs, and your Public Key (found under
   Account > General) into `EMAILJS_CONFIG` at the top of `src/lib/email.js`,
   along with the inbox address that should receive notifications.

EmailJS's public key is designed to be shipped in client-side code — it's
not a secret. Until `EMAILJS_CONFIG` is filled in with real values, the form
shows a clear error instead of silently failing.

## Notes

- English only, no locale switching.
