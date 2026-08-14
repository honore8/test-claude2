<script setup>
import { computed, reactive, ref, nextTick } from "vue";

const TOTAL_STEPS = 5;
const MAX_WORDS = 300;

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
  // Wire this to your submission endpoint (e.g. POST to a form backend).
  await new Promise((resolve) => setTimeout(resolve, 700));
  submitting.value = false;
  submitted.value = true;
}
</script>

<template>
  <section id="invitation" class="invitation">
    <div class="container invitation__inner">
      <div class="invitation__intro" v-reveal>
        <p class="eyebrow invitation__eyebrow">Request an Invitation</p>
        <h2 class="invitation__headline">
          THE SALON is an invitation-only gathering.
        </h2>
        <p class="invitation__lede">
          Attendance is intentionally limited to 45 guests. If you believe you
          should be in the room, we'd like to hear from you.
        </p>
      </div>

      <div class="form-panel" v-reveal>
        <Transition name="fade" mode="out-in">
          <div v-if="submitted" key="done" class="form-panel__done">
            <p class="eyebrow">Request Received</p>
            <h3>Thank you.</h3>
            <p>
              We've received your request to join THE SALON. Given our
              intentionally limited capacity, we review every request
              personally and will be in touch.
            </p>
          </div>

          <div v-else key="form" class="form-panel__body">
            <div class="progress">
              <div class="progress__bar">
                <div class="progress__fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="progress__meta">
                <span>Step {{ String(currentStep).padStart(2, "0") }} — {{ String(TOTAL_STEPS).padStart(2, "0") }}</span>
                <span>{{ progressPercent }}%</span>
              </div>
            </div>

            <Transition :name="direction === 'forward' ? 'slide-forward' : 'slide-backward'" mode="out-in">
              <div :key="currentStep" ref="stepRoot" class="step" @keydown="handleKeydown">
                <p class="step__label">{{ STEP_META[currentStep - 1].title }}</p>

                <!-- Step 1 — Tell us who you are -->
                <div v-if="currentStep === 1" class="step__grid">
                  <label class="field">
                    <span class="field__label">First Name</span>
                    <input v-model.trim="form.firstName" type="text" autocomplete="given-name" />
                  </label>
                  <label class="field">
                    <span class="field__label">Last Name</span>
                    <input v-model.trim="form.lastName" type="text" autocomplete="family-name" />
                  </label>
                  <label class="field">
                    <span class="field__label">Email Address</span>
                    <input v-model.trim="form.email" type="email" autocomplete="email" />
                  </label>
                  <label class="field">
                    <span class="field__label">Organization</span>
                    <input v-model.trim="form.organization" type="text" autocomplete="organization" />
                  </label>
                  <label class="field">
                    <span class="field__label">Role / Title</span>
                    <input v-model.trim="form.role" type="text" />
                  </label>
                  <label class="field">
                    <span class="field__label">LinkedIn Profile (optional)</span>
                    <input v-model.trim="form.linkedin" type="url" placeholder="linkedin.com/in/…" />
                  </label>
                </div>

                <!-- Step 2 — About you -->
                <div v-else-if="currentStep === 2" class="step__single">
                  <label class="field">
                    <span class="field__label">Why would you like to join THE SALON?</span>
                    <textarea v-model="form.aboutYou" rows="6" maxlength="2200"></textarea>
                    <span class="field__hint" :class="{ 'field__hint--warn': wordCount > MAX_WORDS }">
                      {{ wordCount }} / {{ MAX_WORDS }} words
                    </span>
                  </label>
                </div>

                <!-- Step 3 — How did you hear about THE SALON -->
                <div v-else-if="currentStep === 3" class="step__single">
                  <div class="options">
                    <label v-for="option in HEAR_ABOUT_OPTIONS" :key="option" class="option">
                      <input v-model="form.hearAbout" type="radio" name="hearAbout" :value="option" />
                      <span>{{ option }}</span>
                    </label>
                  </div>
                  <label v-if="form.hearAbout === 'Other'" class="field field--inline">
                    <span class="field__label">Please specify</span>
                    <input v-model.trim="form.hearAboutOther" type="text" />
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
                      <input v-model.trim="form.refFirstName" type="text" />
                    </label>
                    <label class="field">
                      <span class="field__label">Last Name</span>
                      <input v-model.trim="form.refLastName" type="text" />
                    </label>
                    <label class="field">
                      <span class="field__label">Email</span>
                      <input v-model.trim="form.refEmail" type="email" />
                    </label>
                    <label class="field">
                      <span class="field__label">Organization</span>
                      <input v-model.trim="form.refOrganization" type="text" />
                    </label>
                    <label class="field">
                      <span class="field__label">Role / Title</span>
                      <input v-model.trim="form.refRole" type="text" />
                    </label>
                  </div>
                </div>

                <!-- Step 5 — Contribution -->
                <div v-else-if="currentStep === 5" class="step__single">
                  <div class="options options--check">
                    <label v-for="option in CONTRIBUTION_OPTIONS" :key="option" class="option">
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
                    <input v-model.trim="form.contributionOther" type="text" />
                  </label>

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

                <div class="step__actions">
                  <button v-if="currentStep > 1" type="button" class="step__back" @click="goBack">
                    ← Back
                  </button>
                  <span v-else></span>
                  <button
                    type="button"
                    class="btn btn-primary-on-bone"
                    :disabled="(touched[currentStep] && !stepValid) || submitting"
                    @click="goNext"
                  >
                    <span v-if="submitting">Sending…</span>
                    <span v-else-if="currentStep === TOTAL_STEPS">Request an Invitation</span>
                    <span v-else>Continue →</span>
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
  background: var(--bone);
  color: var(--navy);
  padding: clamp(4.5rem, 12vh, 7rem) 0 clamp(5rem, 12vh, 8rem);
}

.invitation__inner {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.invitation__eyebrow {
  color: var(--muted-on-bone);
  margin-bottom: 1.25rem;
}

.invitation__headline {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4.4vw, 2.6rem);
  line-height: 1.15;
  max-width: 18ch;
}

.invitation__lede {
  margin-top: 1.25rem;
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--muted-on-bone);
  max-width: 46ch;
}

.form-panel {
  max-width: 640px;
}

.progress {
  margin-bottom: clamp(2rem, 5vh, 2.75rem);
}

.progress__bar {
  height: 2px;
  background: var(--line-dark);
  border-radius: 2px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: var(--navy);
  transition: width 0.5s var(--ease);
}

.progress__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.65rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-on-bone);
}

.step__label {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3.2vw, 1.85rem);
  line-height: 1.2;
  margin-bottom: clamp(1.75rem, 4vh, 2.5rem);
}

.step__helper {
  color: var(--muted-on-bone);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.step__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 1.75rem;
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
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-on-bone);
}

.field input,
.field textarea {
  border: none;
  border-bottom: 1px solid var(--line-dark);
  background: transparent;
  padding: 0.65rem 0.1rem;
  font-size: 1.02rem;
  color: var(--navy);
  transition: border-color 0.3s var(--ease);
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--navy);
}

.field__hint {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--muted-on-bone);
}

.field__hint--warn {
  color: #a3402b;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem 1.5rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.1rem;
  cursor: pointer;
  font-size: 0.98rem;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s var(--ease);
}

.option:hover {
  border-color: var(--line-dark);
}

.option input {
  accent-color: var(--navy);
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-top: clamp(1.75rem, 4vh, 2.5rem);
  padding-top: clamp(1.5rem, 4vh, 2rem);
  border-top: 1px solid var(--line-dark);
  font-size: 0.88rem;
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
  margin-top: clamp(1.5rem, 4vh, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.step__back {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  color: var(--muted-on-bone);
  cursor: pointer;
  letter-spacing: 0.02em;
}

.step__back:hover {
  color: var(--navy);
}

.form-panel__done h3 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 1rem 0 1.25rem;
}

.form-panel__done p:last-child {
  color: var(--muted-on-bone);
  max-width: 46ch;
  line-height: 1.6;
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
  transform: translateX(24px);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-backward-leave-to {
  opacity: 0;
  transform: translateX(24px);
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
  .step__grid,
  .options {
    grid-template-columns: 1fr;
  }
}
</style>
