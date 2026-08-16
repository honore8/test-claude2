<script setup>
import PeignePick from "./PeignePick.vue";

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
      <PeignePick tone="light" />
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
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__comb {
  position: absolute;
  top: -16vw;
  right: -8vw;
  width: clamp(560px, 46vw, 980px);
  aspect-ratio: 139.07036 / 420.37173;
  z-index: 0;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 640px;
  padding-top: clamp(4.5rem, 9vh, 6.25rem);
  padding-bottom: clamp(7.5rem, 15vh, 9.75rem);
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 9vw, 6.5rem);
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
  margin-top: clamp(3.25rem, 8vh, 4.75rem);
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

@media (max-width: 1024px) {
  .hero__comb {
    top: -10vw;
    right: -18vw;
    width: clamp(300px, 40vw, 460px);
  }
}

@media (max-width: 640px) {
  .hero__comb {
    top: -2vh;
    right: -33vw;
    width: clamp(150px, 40vw, 250px);
    mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 85%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 85%);
  }

  .hero__content {
    max-width: none;
    text-align: center;
    align-items: center;
    padding-top: clamp(5.5rem, 17vh, 7.25rem);
  }
}

@media (max-width: 360px) {
  .hero__comb {
    right: -34vw;
    width: clamp(140px, 44vw, 200px);
  }
}
</style>
