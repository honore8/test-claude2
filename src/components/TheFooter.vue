<script setup></script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__signature">
        <p class="footer__wordmark">THE SALON</p>
        <p class="footer__by">Convened by Bluemind Foundation.</p>
      </div>
      <div class="footer__meta">
        <p>New York · September 17, 2026</p>
        <p>© 2026 Bluemind Foundation. By invitation only.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: clamp(3rem, 8vh, 4.5rem) 0 clamp(2.25rem, 6vh, 3rem);
  border-top: 1px solid var(--line);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.footer__wordmark {
  font-family: var(--font-display);
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

.footer__meta {
  text-align: right;
  font-size: 0.8rem;
  color: var(--muted-on-navy);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

@media (max-width: 560px) {
  .footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .footer__meta {
    text-align: left;
  }
}
</style>
