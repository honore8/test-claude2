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
  <footer class="footer">
    <div class="footer__comb" aria-hidden="true">
      <PeignePick tone="light" />
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

      <div class="footer__right">
        <div class="footer__meta">
          <p>September 17, 2026 · New York</p>
        </div>
        <button type="button" class="footer__cta" @click="onRequestInvitation">
          Join The Salon
        </button>
      </div>
    </div>

    <div class="container footer__bottom">
      <p class="footer__copyright">© 2026 Bluemind Foundation <span aria-hidden="true">|</span> Mental health is health.</p>
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
  gap: 1.5rem 2.5rem;
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

.footer__right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 1.75rem;
}

.footer__meta {
  text-align: right;
  font-size: 0.8rem;
  color: var(--muted-on-navy);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  border: 1.5px solid var(--white);
  background: transparent;
  color: var(--white);
  cursor: pointer;
  transition: background-color 0.3s var(--ease), color 0.3s var(--ease);
}

.footer__cta:hover {
  background: var(--white);
  color: var(--navy);
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

.footer__copyright span {
  margin: 0 0.5em;
  opacity: 0.5;
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
  .footer__right {
    align-items: flex-start;
    flex-direction: column;
  }
  .footer__meta {
    text-align: left;
  }
}
</style>
