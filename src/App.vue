<script setup>
import { nextTick, ref } from "vue";
import TheHero from "./components/TheHero.vue";
import ThreeActs from "./components/ThreeActs.vue";
import InvitationForm from "./components/InvitationForm.vue";
import StickyCta from "./components/StickyCta.vue";
import TheFooter from "./components/TheFooter.vue";
import DashboardView from "./components/DashboardView.vue";

const isDashboard = ref(window.location.pathname.replace(/\/+$/, "") === "/dashboard");

async function scrollToInvitation() {
  await nextTick();
  document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <DashboardView v-if="isDashboard" />
  <div v-else class="page">
    <StickyCta :on-request-invitation="scrollToInvitation" />
    <main>
      <TheHero :on-request-invitation="scrollToInvitation" />
      <ThreeActs />
      <InvitationForm />
    </main>
    <TheFooter :on-request-invitation="scrollToInvitation" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
}
</style>
