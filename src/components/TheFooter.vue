<script setup></script>

<template>
  <footer class="footer">
    <div class="container footer__top">
      <div class="footer__signature">
        <p class="footer__wordmark">THE SALON</p>
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
  padding: clamp(3rem, 8vh, 4.5rem) 0 clamp(2.25rem, 6vh, 3rem);
  border-top: 1px solid var(--line);
}

.footer__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.footer__wordmark {
  font-family: var(--font-wordmark);
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}

.footer__by {
  margin-top: 0.5rem;
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
