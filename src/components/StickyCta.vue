<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  onRequestInvitation: {
    type: Function,
    required: true,
  },
});

const visible = ref(false);
const inFormSection = ref(false);
let observer = null;

function handleScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.75 && !inFormSection.value;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const formSection = document.getElementById("invitation");
  if (formSection && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      ([entry]) => {
        inFormSection.value = entry.isIntersecting;
        handleScroll();
      },
      { threshold: 0.15 }
    );
    observer.observe(formSection);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  observer?.disconnect();
});
</script>

<template>
  <Transition name="fade">
    <button
      v-if="visible"
      type="button"
      class="sticky-cta"
      @click="props.onRequestInvitation"
    >
      Join The Salon
    </button>
  </Transition>
</template>

<style scoped>
.sticky-cta {
  position: fixed;
  z-index: 40;
  top: 1.5rem;
  right: clamp(1.25rem, 4vw, 2.5rem);
  background: rgba(13, 21, 51, 0.86);
  backdrop-filter: blur(6px);
  color: var(--white);
  border: 1px solid var(--line);
  padding: 0.7rem 1.35rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s var(--ease), transform 0.2s var(--ease);
}

.sticky-cta:hover {
  background: var(--navy);
}

.sticky-cta:active {
  transform: scale(0.97);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .sticky-cta {
    top: auto;
    bottom: 1.1rem;
    left: 1.1rem;
    right: 1.1rem;
    width: calc(100% - 2.2rem);
    text-align: center;
    padding: 0.95rem 1.35rem;
  }
}
</style>
