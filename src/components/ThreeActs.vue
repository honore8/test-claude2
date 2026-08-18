<script setup>
const acts = [
  {
    numeral: "1",
<<<<<<< HEAD
<<<<<<< HEAD
    label: "Act 1",
=======
    label: "Act I — The Evidence",
>>>>>>> parent of ed06f30 (Final content pass: venue/time, "Join The Salon" CTA, editorial Three Acts)
=======
    label: "Act 1",
>>>>>>> parent of 49f220e (Implement final PDF mockup: pill CTAs, Act labels, wordmark headline, footer CTA)
    title: "Trust as Health Infrastructure.",
    body: "First public presentation of the Trust Study findings.",
    align: "left",
    tone: "deep",
  },
  {
    numeral: "2",
<<<<<<< HEAD
<<<<<<< HEAD
    label: "Act 2",
=======
    label: "Act II — The Conversation",
>>>>>>> parent of ed06f30 (Final content pass: venue/time, "Join The Salon" CTA, editorial Three Acts)
=======
    label: "Act 2",
>>>>>>> parent of 49f220e (Implement final PDF mockup: pill CTAs, Act labels, wordmark headline, footer CTA)
    title: "What can we build from trust?",
    body: "A conversation exploring what trust makes possible across communities, institutions and systems.",
    align: "right",
    tone: "light",
  },
  {
    numeral: "3",
<<<<<<< HEAD
<<<<<<< HEAD
    label: "Act 3",
=======
    label: "Act III — La Clairière",
>>>>>>> parent of ed06f30 (Final content pass: venue/time, "Join The Salon" CTA, editorial Three Acts)
=======
    label: "Act 3",
>>>>>>> parent of 49f220e (Implement final PDF mockup: pill CTAs, Act labels, wordmark headline, footer CTA)
    title: "A Celebration of Black Cultures of Care.",
    body: "Care. Culture. Connection.",
    align: "left",
    tone: "immersive",
  },
];
</script>

<template>
  <section class="acts">
    <article
      v-for="act in acts"
      :key="act.numeral"
      class="act"
      :class="[`act--${act.align}`, `act--${act.tone}`]"
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
  padding: clamp(3rem, 8vh, 5rem) 0 0;
}

.act {
  position: relative;
  min-height: 62vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: background-color 0.4s var(--ease);
}

.act--deep {
  background: var(--navy-deep);
}

.act--light {
  background: var(--bone);
  color: var(--navy);
}

.act--immersive {
  background:
    radial-gradient(120% 140% at 50% 100%, rgba(255, 255, 255, 0.04), transparent 60%),
    var(--navy);
}

.act__numeral {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: clamp(14rem, 42vw, 26rem);
  line-height: 1;
  color: currentColor;
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.act--light .act__numeral {
  opacity: 0.05;
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

.act--light .act__label {
  color: var(--muted-on-bone);
}

.act__title {
  font-family: var(--font-display);
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
<<<<<<< HEAD
}

.act--light .act__body {
  color: var(--muted-on-bone);
}

=======
}

.act--light .act__body {
  color: var(--muted-on-bone);
}

<<<<<<< HEAD
.act--deep .act__body,
.act--immersive .act__body {
  color: var(--ocre);
}

>>>>>>> parent of ed06f30 (Final content pass: venue/time, "Join The Salon" CTA, editorial Three Acts)
=======
>>>>>>> parent of 49f220e (Implement final PDF mockup: pill CTAs, Act labels, wordmark headline, footer CTA)
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
