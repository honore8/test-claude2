<script setup>
import MonumentalComb from "./MonumentalComb.vue";

defineProps({
  onRequestInvitation: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <section class="hero">
    <div class="hero__comb" aria-hidden="true">
      <MonumentalComb tone="light" />
    </div>

    <div class="hero__content container">
      <h1 class="hero__title">THE SALON</h1>
      <p class="hero__signature">Convened by Bluemind Foundation.</p>

      <div class="hero__meta">
        <p>September 17, 2026 · New York</p>
        <p>By invitation only.</p>
      </div>

      <button class="btn btn-primary-on-navy hero__cta" @click="onRequestInvitation">
        Request an Invitation
      </button>
    </div>

    <div class="hero__scroll" aria-hidden="true">
      <span class="hero__scroll-line"></span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
}

.hero__comb {
  position: absolute;
  top: -6vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 150vw);
  height: 78vh;
  color: var(--white);
  z-index: 0;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 82%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 82%);
}

.hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-bottom: clamp(3.5rem, 9vh, 6rem);
  padding-top: clamp(6rem, 16vh, 9rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 13vw, 8.5rem);
  line-height: 0.92;
  letter-spacing: -0.01em;
}

.hero__signature {
  margin-top: clamp(0.9rem, 2vw, 1.3rem);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted-on-navy);
}

.hero__meta {
  margin-top: clamp(2.5rem, 7vh, 4rem);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}

.hero__meta p:last-child {
  color: var(--muted-on-navy);
}

.hero__cta {
  margin-top: clamp(2.25rem, 6vh, 3.25rem);
}

.hero__scroll {
  position: absolute;
  bottom: clamp(1.25rem, 3vh, 2rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.hero__scroll-line {
  display: block;
  width: 1px;
  height: 42px;
  background: linear-gradient(to bottom, transparent, var(--muted-on-navy) 55%, transparent);
  animation: scrollcue 2.6s var(--ease) infinite;
}

@keyframes scrollcue {
  0% { opacity: 0; transform: translateY(-8px); }
  40% { opacity: 1; }
  100% { opacity: 0; transform: translateY(14px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .hero {
    align-items: center;
  }
  .hero__comb {
    height: 62vh;
    top: -4vh;
  }
}
</style>
