<script setup>
import { nextTick } from "vue";
import TheHero from "./components/TheHero.vue";
import ThreeActs from "./components/ThreeActs.vue";
import InvitationForm from "./components/InvitationForm.vue";
import StickyCta from "./components/StickyCta.vue";
import TheFooter from "./components/TheFooter.vue";

async function scrollToInvitation() {
  await nextTick();
  document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <div class="page">
    <StickyCta :on-request-invitation="scrollToInvitation" />
    <main>
      <TheHero :on-request-invitation="scrollToInvitation" />
      <ThreeActs />
      <InvitationForm />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
}
</style>
