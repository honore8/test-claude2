<script setup>
const acts = [
  {
    numeral: "I",
    label: "Act I — The Evidence",
    title: "Trust as Health Infrastructure.",
    body: "First public presentation of the Trust Study findings.",
    align: "left",
  },
  {
    numeral: "II",
    label: "Act II — The Conversation",
    title: "What can we build from trust?",
    body: "A conversation exploring what trust makes possible across communities, institutions and systems.",
    align: "right",
  },
  {
    numeral: "III",
    label: "Act III — La Clairière",
    title: "A Celebration of Black Cultures of Care.",
    body: "Care. Culture. Connection.",
    align: "left",
  },
];
</script>

<template>
  <section class="acts">
    <p class="eyebrow acts__eyebrow container" v-reveal>The Three Acts</p>

    <article
      v-for="act in acts"
      :key="act.numeral"
      class="act"
      :class="`act--${act.align}`"
    >
      <span class="act__numeral" aria-hidden="true">{{ act.numeral }}</span>
      <div class="container act__row">
        <div class="act__copy" v-reveal>
          <p class="act__label">{{ act.label }}</p>
          <h3 class="act__title">{{ act.title }}</h3>
          <p class="act__body">{{ act.body }}</p>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.acts {
  padding: clamp(3rem, 8vh, 5rem) 0 clamp(2rem, 6vh, 4rem);
}

.acts__eyebrow {
  color: var(--muted-on-navy);
  margin-bottom: clamp(2rem, 6vh, 4rem);
}

.act {
  position: relative;
  min-height: 62vh;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--line);
  overflow: hidden;
}

.act__numeral {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(14rem, 42vw, 26rem);
  line-height: 1;
  color: var(--white);
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.act__row {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
}

.act--right .act__row {
  justify-content: flex-end;
}

.act__copy {
  max-width: 620px;
  padding: clamp(2.5rem, 6vh, 4rem) 0;
}

.act--right .act__copy {
  text-align: right;
}

.act__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted-on-navy);
  margin-bottom: 1.1rem;
}

.act__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(1.7rem, 4.4vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.01em;
}

.act__body {
  margin-top: 1.25rem;
  font-size: 1.02rem;
  line-height: 1.55;
  color: var(--muted-on-navy);
  max-width: 46ch;
}

.act--right .act__body {
  margin-left: auto;
}

@media (max-width: 640px) {
  .act {
    min-height: 46vh;
  }
  .act--right .act__row {
    justify-content: flex-start;
  }
  .act--right .act__copy {
    text-align: left;
  }
  .act--right .act__body {
    margin-left: 0;
  }
}
</style>
