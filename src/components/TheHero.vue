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
      <p class="hero__signature">
        <span class="hero__signature-light">Convened by</span>
        <span class="hero__signature-bold">Bluemind Foundation</span>
      </p>

      <div class="hero__meta">
        <span class="hero__meta-bar" aria-hidden="true"></span>
        <div class="hero__meta-text">
          <p><span class="hero__date">September 17, 2026</span> · New York</p>
          <p class="hero__meta-sub">By invitation only</p>
        </div>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__comb {
  position: absolute;
  top: 0;
  right: 0;
  height: clamp(560px, 92vh, 980px);
  width: auto;
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
  padding-bottom: clamp(3rem, 8vh, 5rem);
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero__title {
  font-family: var(--font-wordmark);
  font-weight: 900;
  font-size: clamp(3.6rem, 9.5vw, 7rem);
  line-height: 0.9;
  letter-spacing: -0.01em;
}

.hero__signature {
  margin-top: clamp(0.9rem, 2vw, 1.3rem);
  font-family: var(--font-body);
  font-size: clamp(1rem, 2.2vw, 1.35rem);
  font-weight: 400;
  color: var(--white);
}

.hero__signature-light {
  font-weight: 400;
  margin-right: 0.32em;
}

.hero__signature-bold {
  font-weight: 700;
}

.hero__meta {
  margin-top: clamp(3.25rem, 8vh, 4.75rem);
  display: flex;
  align-items: stretch;
  gap: 0.9rem;
}

.hero__meta-bar {
  width: 3px;
  flex-shrink: 0;
  border-radius: 2px;
  background: var(--white);
  opacity: 0.5;
}

.hero__meta-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: clamp(1.05rem, 2.4vw, 1.4rem);
}

.hero__date {
  color: var(--terracotta);
}

.hero__meta-sub {
  color: var(--muted-on-navy);
  font-size: 0.92em;
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

@media (max-width: 1160px) {
  .hero__comb {
    top: 0;
    right: 0;
    height: auto;
    width: clamp(130px, 20vw, 230px);
  }
}

@media (max-width: 640px) {
  .hero__comb {
    top: 0;
    right: 0;
    width: clamp(80px, 20vw, 140px);
  }
}

@media (max-width: 400px) {
  .hero__comb {
    width: clamp(64px, 20vw, 100px);
  }
}
</style>
