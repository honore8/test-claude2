<script setup>
import PeignePick from "./PeignePick.vue";
</script>

<template>
  <footer class="footer">
    <div class="footer__comb" aria-hidden="true">
      <PeignePick tone="light" :opacity="0.1" />
    </div>

    <div class="container footer__top">
      <div class="footer__signature">
        <p class="footer__wordmark"><span>THE</span><span>SALON</span></p>
        <p class="footer__by">
          Convened by
          <a
            class="footer__link"
            href="https://www.bluemindfoundation.org/"
            target="_blank"
            rel="noopener"
            >Bluemind Foundation</a
          >.
        </p>
      </div>
      <div class="footer__meta">
        <p>New York · September 17, 2026</p>
        <p>By invitation only</p>
      </div>
    </div>

    <div class="container footer__bottom">
      <p class="footer__copyright">© 2026 Bluemind Foundation</p>
      <p class="footer__tagline">Mental health is health.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: clamp(3.5rem, 9vh, 5.5rem) 0 clamp(2.25rem, 6vh, 3rem);
  border-top: 1px solid var(--line);
  overflow: hidden;
  isolation: isolate;
}

.footer__comb {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: auto;
  aspect-ratio: 152.08364 / 526.43707;
  z-index: 0;
  pointer-events: none;
}

.footer__top {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.footer__wordmark {
  font-family: var(--font-wordmark);
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 0.92;
  letter-spacing: -0.01em;
}

.footer__wordmark span {
  display: block;
}

.footer__by {
  margin-top: 0.85rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-on-navy);
}

.footer__link {
  color: var(--muted-on-navy);
  text-decoration-color: var(--line);
  text-underline-offset: 0.2em;
  transition: color 0.25s var(--ease), text-decoration-color 0.25s var(--ease);
}

.footer__link:hover {
  color: var(--white);
  text-decoration-color: var(--white);
}

.footer__meta {
  text-align: right;
  font-size: 0.8rem;
  color: var(--muted-on-navy);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer__bottom {
  position: relative;
  z-index: 1;
  margin-top: clamp(2.5rem, 6vh, 3.5rem);
  padding-top: clamp(1.5rem, 4vh, 2rem);
  border-top: 1px solid var(--line);
  text-align: center;
}

.footer__copyright {
  font-size: 0.76rem;
  color: var(--muted-on-navy);
}

.footer__tagline {
  margin-top: 0.4rem;
  font-size: 0.72rem;
  color: var(--muted-on-navy);
  opacity: 0.75;
}

@media (min-width: 768px) {
  .footer__comb {
    display: block;
  }
}

@media (max-width: 560px) {
  .footer__top {
    flex-direction: column;
    align-items: flex-start;
  }
  .footer__meta {
    text-align: left;
  }
}
</style>
