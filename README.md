# THE SALON — Convened by Bluemind Foundation

Landing page V2, built with Vue 3 + Vite.

## Stack

- Vue 3 (`<script setup>`)
- Vite
- No UI framework — bespoke, minimal CSS with design tokens in `src/style.css`
- Self-hosted fonts via `@fontsource/archivo-black` and `@fontsource/inter`

## Structure

- `src/components/TheHero.vue` — hero screen (title, date/location, CTA)
- `src/components/TheIdea.vue` — single statement screen
- `src/components/ThreeActs.vue` — Act I / II / III
- `src/components/InvitationForm.vue` — multi-step "Request an Invitation" form
- `src/components/StickyCta.vue` — discreet sticky CTA
- `src/components/TheFooter.vue` — footer
- `src/components/MonumentalComb.vue` — oversized architectural comb graphic
- `src/directives/reveal.js` — subtle scroll-reveal directive (`v-reveal`)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- English only, no locale switching.
- The invitation form currently mocks submission client-side (see the `submit()`
  function in `InvitationForm.vue`) — wire it to a real endpoint before launch.
