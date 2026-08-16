<script setup></script>

<template>
  <section class="idea">
    <div class="container idea__inner">
      <p class="eyebrow idea__eyebrow" v-reveal>The Idea</p>
      <p class="idea__statement" v-reveal>
        A gathering where evidence, public leadership and the wisdom of
        communities come together to shape the future of care.
      </p>
      <p class="idea__context" v-reveal>
        THE SALON takes place during UNGA week.
      </p>
    </div>
  </section>
</template>

<style scoped>
.idea {
  min-height: 92svh;
  display: flex;
  align-items: center;
  padding: clamp(4rem, 12vh, 7rem) 0;
}

.idea__inner {
  max-width: 920px;
}

.idea__eyebrow {
  color: var(--muted-on-navy);
  margin-bottom: clamp(1.75rem, 6vh, 3rem);
}

.idea__statement {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(1.9rem, 5.4vw, 3.6rem);
  line-height: 1.14;
  letter-spacing: -0.01em;
}

.idea__context {
  margin-top: clamp(2.5rem, 7vh, 4rem);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--muted-on-navy);
}
</style>
