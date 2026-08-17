<script setup>
import { computed, reactive, ref, nextTick } from "vue";
import PeignePick from "./PeignePick.vue";

const TOTAL_STEPS = 5;
const MAX_WORDS = 300;
const DONATION_URL = "https://www.bluemindfoundation.org/donate#ready-to-make-donation";

const STEP_META = [
  { key: "who", title: "Tell us who you are" },
  { key: "about", title: "About you" },
  { key: "source", title: "How did you hear about THE SALON?" },
  { key: "referral", title: "Who else should be in the room?" },
  { key: "contribute", title: "How would you like to contribute?" },
];

const HEAR_ABOUT_OPTIONS = [
  "Through Bluemind Foundation",
  "Through Marie-Alix de Putter",
  "Through Praxis community",
  "Through Mulago community",
  "Through a speaker, partner or advisor",
  "Through a colleague or friend",
  "Through LinkedIn",
  "Through another social media platform",
  "Through the media",
  "Other",
];

const CONTRIBUTION_OPTIONS = [
  "Attend as a participant",
  "Introduce a speaker or moderator",
  "Connect a Founding Cultural Partner",
  "Introduce a potential funding partner or philanthropic supporter",
  "Introduce media, editors or storytellers",
  "Volunteer during the event",
  "Explore a future collaboration",
  "Support THE SALON financially",
  "Other",
];

const currentStep = ref(1);
const direction = ref("forward");
const submitted = ref(false);
const submitting = ref(false);
const submitError = ref("");
const stepRoot = ref(null);
const touched = reactive({});

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  role: "",
  linkedin: "",
  aboutYou: "",
  hearAbout: "",
  hearAboutOther: "",
  refFirstName: "",
  refLastName: "",
  refEmail: "",
  refOrganization: "",
  refRole: "",
  contributions: [],
  contributionOther: "",
  consent: false,
});

const wordCount = computed(() =>
  form.aboutYou.trim().length ? form.aboutYou.trim().split(/\s+/).length : 0
);

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));

const stepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        form.firstName.trim() &&
        form.lastName.trim() &&
        emailValid.value &&
        form.organization.trim() &&
        form.role.trim()
      );
    case 2:
      return form.aboutYou.trim().length > 0 && wordCount.value <= MAX_WORDS;
    case 3:
      return form.hearAbout && (form.hearAbout !== "Other" || form.hearAboutOther.trim());
    case 4:
      return true;
    case 5:
      return (
        form.contributions.length > 0 &&
        (!form.contributions.includes("Other") || form.contributionOther.trim()) &&
        form.consent
      );
    default:
      return false;
  }
});

const progressPercent = computed(() =>
  Math.round(((currentStep.value - 1) / TOTAL_STEPS) * 100)
);

const errorMessage = computed(() => {
  if (!touched[currentStep.value] || stepValid.value) return "";
  switch (currentStep.value) {
    case 1:
      return "Please complete all fields with a valid email address.";
    case 2:
      return wordCount.value > MAX_WORDS
        ? `Please keep your answer under ${MAX_WORDS} words.`
        : "Please tell us why you'd like to join.";
    case 3:
      return "Please select one option.";
    case 5:
      return !form.consent
        ? "Please confirm you understand before continuing."
        : "Please select at least one way to contribute.";
    default:
      return "";
  }
});

function focusStep() {
  nextTick(() => {
    const field = stepRoot.value?.querySelector("input, textarea");
    field?.focus({ preventScroll: true });
  });
}

function goNext() {
  touched[currentStep.value] = true;
  if (!stepValid.value) return;
  if (currentStep.value < TOTAL_STEPS) {
    direction.value = "forward";
    currentStep.value += 1;
    focusStep();
  } else {
    submit();
  }
}

function goBack() {
  if (currentStep.value > 1) {
    direction.value = "backward";
    currentStep.value -= 1;
    focusStep();
  }
}

function goToStep(step) {
  if (step >= currentStep.value) return;
  direction.value = "backward";
  currentStep.value = step;
  focusStep();
}

function toggleContribution(option) {
  const list = form.contributions;
  const idx = list.indexOf(option);
  if (idx === -1) list.push(option);
  else list.splice(idx, 1);
}

function handleKeydown(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
    event.preventDefault();
    goNext();
  }
}

async function submit() {
  touched[5] = true;
  if (!stepValid.value) return;
  submitting.value = true;
  submitError.value = "";
  try {
    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
    submitted.value = true;
  } catch (err) {
    submitError.value = err.message || "Something went wrong. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section id="invitation" class="invitation">
    <div class="invitation__comb" aria-hidden="true">
      <PeignePick tone="light" />
    </div>
    <div class="container invitation__inner">
      <div class="invitation__intro" v-reveal>
        <p class="eyebrow invitation__eyebrow">Request an Invitation</p>
        <h2 class="invitation__headline">
          THE SALON by Bluemind Foundation is an invitation-only gathering.
        </h2>
        <p class="invitation__lede">
          Attendance is intentionally limited to 45 guests. If you believe you
          should be in the room, we'd like to hear from you.
        </p>
      </div>

      <div class="card" v-reveal>
        <Transition name="fade" mode="out-in">
          <div v-if="submitted" key="done" class="card__done">
            <div class="card__done-mark" aria-hidden="true">✓</div>
            <p class="eyebrow">Request Received</p>
            <h3>Thank you.</h3>
            <p>
              We've received your request to join THE SALON by Bluemind
              Foundation. Given our intentionally limited capacity, we review
              every request personally and will be in touch.
            </p>
          </div>

          <div v-else key="form" class="card__body">
            <header class="card__head">
              <div class="progress-track" aria-hidden="true">
                <div class="progress-track__fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="progress-row">
                <ol class="dots" aria-hidden="true">
                  <li
                    v-for="n in TOTAL_STEPS"
                    :key="n"
                    class="dot"
                    :class="{ 'is-done': n < currentStep, 'is-current': n === currentStep }"
                    @click="goToStep(n)"
                  ></li>
                </ol>
                <span class="progress-row__count">
                  {{ String(currentStep).padStart(2, "0") }} / {{ String(TOTAL_STEPS).padStart(2, "0") }}
                  <b>{{ progressPercent }}%</b>
                </span>
              </div>
            </header>

            <Transition :name="direction === 'forward' ? 'slide-forward' : 'slide-backward'" mode="out-in">
              <div :key="currentStep" ref="stepRoot" class="step" @keydown="handleKeydown">
                <div class="step__scroll">
                  <p class="step__label">{{ STEP_META[currentStep - 1].title }}</p>

                  <!-- Step 1 — Tell us who you are -->
                  <div v-if="currentStep === 1" class="step__grid">
                    <label class="field">
                      <span class="field__label">First Name</span>
                      <input class="field__input" v-model.trim="form.firstName" type="text" autocomplete="given-name" />
                    </label>
                    <label class="field">
                      <span class="field__label">Last Name</span>
                      <input class="field__input" v-model.trim="form.lastName" type="text" autocomplete="family-name" />
                    </label>
                    <label class="field">
                      <span class="field__label">Email Address</span>
                      <input class="field__input" v-model.trim="form.email" type="email" inputmode="email" autocomplete="email" />
                    </label>
                    <label class="field">
                      <span class="field__label">Organization</span>
                      <input class="field__input" v-model.trim="form.organization" type="text" autocomplete="organization" />
                    </label>
                    <label class="field">
                      <span class="field__label">Role / Title</span>
                      <input class="field__input" v-model.trim="form.role" type="text" />
                    </label>
                    <label class="field">
                      <span class="field__label">LinkedIn Profile (optional)</span>
                      <input class="field__input" v-model.trim="form.linkedin" type="url" placeholder="linkedin.com/in/…" />
                    </label>
                  </div>

                  <!-- Step 2 — About you -->
                  <div v-else-if="currentStep === 2" class="step__single">
                    <label class="field">
                      <span class="field__label">Why would you like to join THE SALON?</span>
                      <textarea class="field__input field__input--area" v-model="form.aboutYou" rows="6" maxlength="2200"></textarea>
                      <span class="field__hint" :class="{ 'field__hint--warn': wordCount > MAX_WORDS }">
                        {{ wordCount }} / {{ MAX_WORDS }} words
                      </span>
                    </label>
                  </div>

                  <!-- Step 3 — How did you hear about THE SALON -->
                  <div v-else-if="currentStep === 3" class="step__single">
                    <div class="chips">
                      <label v-for="option in HEAR_ABOUT_OPTIONS" :key="option" class="chip">
                        <input v-model="form.hearAbout" type="radio" name="hearAbout" :value="option" />
                        <span>{{ option }}</span>
                      </label>
                    </div>
                    <label v-if="form.hearAbout === 'Other'" class="field field--inline">
                      <span class="field__label">Please specify</span>
                      <input class="field__input" v-model.trim="form.hearAboutOther" type="text" />
                    </label>
                  </div>

                  <!-- Step 4 — Referral -->
                  <div v-else-if="currentStep === 4" class="step__single">
                    <p class="step__helper">
                      Is there someone you believe should also be in the room?
                      Optional.
                    </p>
                    <div class="step__grid">
                      <label class="field">
                        <span class="field__label">First Name</span>
                        <input class="field__input" v-model.trim="form.refFirstName" type="text" />
                      </label>
                      <label class="field">
                        <span class="field__label">Last Name</span>
                        <input class="field__input" v-model.trim="form.refLastName" type="text" />
                      </label>
                      <label class="field">
                        <span class="field__label">Email</span>
                        <input class="field__input" v-model.trim="form.refEmail" type="email" inputmode="email" />
                      </label>
                      <label class="field">
                        <span class="field__label">Organization</span>
                        <input class="field__input" v-model.trim="form.refOrganization" type="text" />
                      </label>
                      <label class="field">
                        <span class="field__label">Role / Title</span>
                        <input class="field__input" v-model.trim="form.refRole" type="text" />
                      </label>
                    </div>
                  </div>

                  <!-- Step 5 — Contribution -->
                  <div v-else-if="currentStep === 5" class="step__single">
                    <div class="chips">
                      <label v-for="option in CONTRIBUTION_OPTIONS" :key="option" class="chip">
                        <input
                          type="checkbox"
                          :value="option"
                          :checked="form.contributions.includes(option)"
                          @change="toggleContribution(option)"
                        />
                        <span>{{ option }}</span>
                      </label>
                    </div>
                    <label v-if="form.contributions.includes('Other')" class="field field--inline">
                      <span class="field__label">Please specify</span>
                      <input class="field__input" v-model.trim="form.contributionOther" type="text" />
                    </label>

                    <div v-if="form.contributions.includes('Support THE SALON financially')" class="donation-note">
                      <p>
                        Financial contributions help make THE SALON possible and
                        support Bluemind Foundation's broader mission. You're welcome
                        to make a donation now — it's entirely separate from this
                        request, which you can still submit either way.
                      </p>
                      <a
                        class="donation-note__link"
                        :href="DONATION_URL"
                        target="_blank"
                        rel="noopener"
                        >Make a donation to Bluemind Foundation ↗</a
                      >
                    </div>

                    <label class="consent">
                      <input v-model="form.consent" type="checkbox" />
                      <span>
                        I understand that, due to the intentionally limited
                        capacity of THE SALON, submitting this request does not
                        guarantee an invitation.
                      </span>
                    </label>
                  </div>

                  <p v-if="errorMessage" class="step__error" role="alert">{{ errorMessage }}</p>
                  <p v-if="submitError" class="step__error" role="alert">{{ submitError }}</p>
                </div>

                <div class="step__actions">
                  <button v-if="currentStep > 1" type="button" class="step__back" @click="goBack">
                    ← Back
                  </button>
                  <span v-else></span>
                  <button
                    type="button"
                    class="step__next"
                    :disabled="(touched[currentStep] && !stepValid) || submitting"
                    @click="goNext"
                  >
                    <span v-if="submitting">Sending…</span>
                    <span v-else-if="currentStep === TOTAL_STEPS">Request an Invitation</span>
                    <span v-else>Continue</span>
                    <span v-if="!submitting" class="step__next-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.invitation {
  position: relative;
  background: var(--navy);
  color: var(--white);
  padding: clamp(4.5rem, 12vh, 7rem) 0 clamp(5rem, 12vh, 8rem);
  overflow: hidden;
  isolation: isolate;
}

.invitation__comb {
  display: none;
  position: absolute;
  top: 6%;
  right: 0;
  height: 88%;
  width: auto;
  aspect-ratio: 139.07036 / 420.37173;
  opacity: 0.16;
  z-index: 0;
  pointer-events: none;
}

.invitation__inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(2.5rem, 6vw, 3.5rem);
}

.invitation__eyebrow {
  color: var(--muted-on-navy);
  margin-bottom: 1.25rem;
}

.invitation__headline {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4.4vw, 2.6rem);
  line-height: 1.15;
  max-width: 20ch;
}

.invitation__lede {
  margin-top: 1.25rem;
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--muted-on-navy);
  max-width: 46ch;
}

/* Card */
.card {
  width: 100%;
  max-width: 760px;
  background: var(--bone);
  color: var(--navy);
  border-radius: 28px;
  box-shadow: 0 40px 80px -32px rgba(3, 6, 18, 0.55), 0 1px 0 rgba(255, 255, 255, 0.04) inset;
  overflow: hidden;
}

@media (min-width: 1000px) {
  .invitation__inner {
    grid-template-columns: minmax(280px, 380px) 1fr;
    align-items: start;
    gap: clamp(2.5rem, 5vw, 4.5rem);
  }

  .invitation__intro {
    position: sticky;
    top: clamp(2rem, 6vh, 3.5rem);
  }
}

@media (min-width: 1440px) {
  .invitation__comb {
    display: block;
  }
}

.card__body {
  display: flex;
  flex-direction: column;
}

.card__head {
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.75rem, 4.5vw, 3rem) 0;
}

.progress-track {
  height: 3px;
  border-radius: 3px;
  background: var(--line-dark);
  overflow: hidden;
  margin: 0 clamp(-2.5rem, -4vw, -1.5rem);
  width: calc(100% + clamp(3rem, 8vw, 5rem));
}

.progress-track__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--navy), #3350a8);
  transition: width 0.6s var(--ease);
}

.progress-row {
  margin-top: clamp(1.1rem, 3vh, 1.6rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dots {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--line-dark);
  cursor: default;
  transition: width 0.35s var(--ease), background-color 0.35s var(--ease), opacity 0.35s var(--ease);
}

.dot.is-current {
  width: 20px;
  background: var(--navy);
}

.dot.is-done {
  background: var(--navy);
  opacity: 0.42;
  cursor: pointer;
}

.progress-row__count {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-on-bone);
  white-space: nowrap;
}

.progress-row__count b {
  font-weight: 700;
  color: var(--navy);
  margin-left: 0.5em;
}

.step {
  display: flex;
  flex-direction: column;
}

.step__scroll {
  padding: clamp(2rem, 5vh, 2.75rem) clamp(1.75rem, 4.5vw, 3rem) clamp(1.5rem, 3vh, 2rem);
}

.step__label {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.85rem);
  line-height: 1.2;
  margin-bottom: clamp(1.75rem, 4vh, 2.25rem);
}

.step__helper {
  color: var(--muted-on-bone);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.step__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.35rem 1.25rem;
}

.step__single {
  display: block;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field--inline {
  margin-top: 1.25rem;
}

.field__label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted-on-bone);
  padding-left: 0.15rem;
}

.field__input {
  width: 100%;
  border: 1.5px solid transparent;
  background: rgba(13, 21, 51, 0.045);
  border-radius: 14px;
  padding: 1rem 1.15rem;
  font-size: 1.02rem;
  color: var(--navy);
  transition: border-color 0.25s var(--ease), background-color 0.25s var(--ease), box-shadow 0.25s var(--ease);
}

.field__input::placeholder {
  color: rgba(13, 21, 51, 0.32);
}

.field__input:hover {
  background: rgba(13, 21, 51, 0.065);
}

.field__input:focus {
  outline: none;
  background: var(--white);
  border-color: var(--navy);
  box-shadow: 0 0 0 4px rgba(13, 21, 51, 0.08);
}

.field__input--area {
  resize: vertical;
  min-height: 9rem;
  line-height: 1.5;
}

.field__hint {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--muted-on-bone);
}

.field__hint--warn {
  color: #a3402b;
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.15rem;
  border-radius: 999px;
  border: 1.5px solid var(--line-dark);
  background: transparent;
  font-size: 0.9rem;
  line-height: 1.2;
  cursor: pointer;
  transition: background-color 0.25s var(--ease), border-color 0.25s var(--ease), color 0.25s var(--ease), transform 0.15s var(--ease);
}

.chip:active {
  transform: scale(0.97);
}

.chip input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.chip:has(input:checked) {
  background: var(--navy);
  border-color: var(--navy);
  color: var(--white);
}

.chip:has(input:focus-visible) {
  box-shadow: 0 0 0 3px rgba(13, 21, 51, 0.18);
}

.donation-note {
  margin-top: 1.25rem;
  padding: 1.1rem 1.25rem;
  border-radius: 14px;
  background: rgba(216, 141, 99, 0.1);
  border: 1px solid rgba(216, 141, 99, 0.3);
}

.donation-note p {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--muted-on-bone);
}

.donation-note__link {
  display: inline-flex;
  margin-top: 0.7rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--navy);
  text-underline-offset: 0.2em;
}

.donation-note__link:hover {
  color: var(--terracotta);
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-top: clamp(1.75rem, 4vh, 2.25rem);
  padding-top: clamp(1.5rem, 4vh, 1.75rem);
  border-top: 1px solid var(--line-dark);
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--muted-on-bone);
  cursor: pointer;
}

.consent input {
  accent-color: var(--navy);
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.step__error {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #a3402b;
}

.step__actions {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem clamp(1.75rem, 4.5vw, 3rem);
  padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
  background: var(--bone);
  border-top: 1px solid var(--line-dark);
}

.step__back {
  background: none;
  border: none;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  color: var(--muted-on-bone);
  cursor: pointer;
  letter-spacing: 0.02em;
}

.step__back:hover {
  color: var(--navy);
}

.step__next {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 1.6rem;
  border-radius: 999px;
  border: none;
  background: var(--navy);
  color: var(--white);
  cursor: pointer;
  transition: transform 0.2s var(--ease), box-shadow 0.25s var(--ease), opacity 0.25s var(--ease);
  box-shadow: 0 12px 24px -12px rgba(13, 21, 51, 0.55);
}

.step__next:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px -12px rgba(13, 21, 51, 0.6);
}

.step__next:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.step__next:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.step__next-arrow {
  transition: transform 0.25s var(--ease);
}

.step__next:hover:not(:disabled) .step__next-arrow {
  transform: translateX(3px);
}

.card__done {
  padding: clamp(3rem, 8vh, 4rem) clamp(1.75rem, 5vw, 2.75rem);
  text-align: center;
}

.card__done-mark {
  width: 52px;
  height: 52px;
  margin: 0 auto clamp(1.5rem, 4vh, 2rem);
  border-radius: 999px;
  background: var(--navy);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.card__done h3 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 1rem 0 1.25rem;
}

.card__done p:last-child {
  color: var(--muted-on-bone);
  max-width: 42ch;
  line-height: 1.6;
  margin-inline: auto;
}

/* Step slide transitions */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(28px) scale(0.99);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-28px) scale(0.99);
}
.slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-28px) scale(0.99);
}
.slide-backward-leave-to {
  opacity: 0;
  transform: translateX(28px) scale(0.99);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .card {
    border-radius: 18px;
  }

  .step__grid,
  .chips {
    grid-template-columns: 1fr;
  }
}
</style>
