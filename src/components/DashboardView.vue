<script setup>
import { computed, onMounted, ref } from "vue";

const STORAGE_KEY = "salon-dashboard-token";

const token = ref(sessionStorage.getItem(STORAGE_KEY) || "");
const authenticated = ref(false);
const checkingSession = ref(true);

const password = ref("");
const loginError = ref("");
const loggingIn = ref(false);

const submissions = ref([]);
const loading = ref(false);
const loadError = ref("");
const exporting = ref(false);

const requestCount = computed(() => submissions.value.length);

function authHeaders() {
  return { Authorization: `Bearer ${token.value}` };
}

async function loadSubmissions() {
  loading.value = true;
  loadError.value = "";
  try {
    const response = await fetch("/api/dashboard/submissions", { headers: authHeaders() });
    if (response.status === 401) {
      logout();
      return;
    }
    if (!response.ok) throw new Error("Could not load requests.");
    const data = await response.json();
    submissions.value = data.submissions || [];
    authenticated.value = true;
  } catch (err) {
    loadError.value = err.message || "Could not load requests.";
  } finally {
    loading.value = false;
  }
}

async function login() {
  loggingIn.value = true;
  loginError.value = "";
  try {
    const response = await fetch("/api/dashboard/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.value }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Invalid password.");
    token.value = password.value;
    sessionStorage.setItem(STORAGE_KEY, token.value);
    password.value = "";
    await loadSubmissions();
  } catch (err) {
    loginError.value = err.message || "Invalid password.";
  } finally {
    loggingIn.value = false;
  }
}

function logout() {
  authenticated.value = false;
  token.value = "";
  submissions.value = [];
  sessionStorage.removeItem(STORAGE_KEY);
}

async function downloadExcel() {
  exporting.value = true;
  try {
    const response = await fetch("/api/dashboard/export", { headers: authHeaders() });
    if (response.status === 401) {
      logout();
      return;
    }
    if (!response.ok) throw new Error("Could not export the file.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `the-salon-requests-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    loadError.value = err.message || "Could not export the file.";
  } finally {
    exporting.value = false;
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

onMounted(async () => {
  if (token.value) {
    await loadSubmissions();
  }
  checkingSession.value = false;
});
</script>

<template>
  <div class="dashboard">
    <div v-if="checkingSession" class="dashboard__loading">Loading…</div>

    <div v-else-if="!authenticated" class="dashboard__login">
      <div class="login-card">
        <p class="eyebrow">The Salon</p>
        <h1>Requests Dashboard</h1>
        <p class="login-card__hint">Enter the dashboard password to continue.</p>
        <form @submit.prevent="login">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            autofocus
          />
          <button type="submit" class="btn btn-primary-on-navy" :disabled="loggingIn || !password">
            <span v-if="loggingIn">Checking…</span>
            <span v-else>Enter</span>
          </button>
        </form>
        <p v-if="loginError" class="login-card__error" role="alert">{{ loginError }}</p>
      </div>
    </div>

    <div v-else class="dashboard__app">
      <header class="dashboard__header">
        <div>
          <p class="eyebrow">The Salon</p>
          <h1>Requests Dashboard</h1>
        </div>
        <div class="dashboard__actions">
          <button class="btn btn-primary-on-navy" :disabled="exporting || !requestCount" @click="downloadExcel">
            <span v-if="exporting">Preparing…</span>
            <span v-else>Download Excel</span>
          </button>
          <button class="btn btn-ghost" @click="logout">Log out</button>
        </div>
      </header>

      <p class="dashboard__count">{{ requestCount }} request{{ requestCount === 1 ? "" : "s" }} received</p>

      <p v-if="loadError" class="login-card__error" role="alert">{{ loadError }}</p>
      <p v-if="loading" class="dashboard__loading-inline">Loading…</p>

      <div v-if="!loading && requestCount === 0" class="dashboard__empty">
        No requests yet.
      </div>

      <div v-else class="dashboard__table-wrap">
        <table class="dashboard__table">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Heard About</th>
              <th>Contributions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in submissions" :key="entry.id">
              <td>{{ formatDate(entry.submittedAt) }}</td>
              <td>{{ entry.firstName }} {{ entry.lastName }}</td>
              <td>{{ entry.email }}</td>
              <td>{{ entry.organization }}</td>
              <td>{{ entry.role }}</td>
              <td>{{ entry.hearAbout }}<template v-if="entry.hearAboutOther"> ({{ entry.hearAboutOther }})</template></td>
              <td>{{ (entry.contributions || []).join(", ") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100svh;
  background: var(--navy);
  color: var(--white);
  font-family: var(--font-body);
}

.dashboard__loading {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-on-navy);
}

.dashboard__login {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: var(--bone);
  color: var(--navy);
  border-radius: 18px;
  padding: clamp(1.75rem, 5vw, 2.5rem);
  box-shadow: 0 40px 80px -32px rgba(3, 6, 18, 0.55);
}

.login-card h1 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  margin: 0.6rem 0 0.75rem;
}

.login-card__hint {
  color: var(--muted-on-bone);
  font-size: 0.92rem;
  margin-bottom: 1.5rem;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.login-card input {
  width: 100%;
  border: 1.5px solid transparent;
  background: rgba(13, 21, 51, 0.045);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  color: var(--navy);
}

.login-card input:focus {
  outline: none;
  background: var(--white);
  border-color: var(--navy);
}

.login-card__error {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #a3402b;
}

.dashboard__app {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem);
}

.dashboard__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  border-bottom: 1px solid var(--line);
  padding-bottom: 1.75rem;
}

.dashboard__header h1 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-top: 0.4rem;
}

.dashboard__actions {
  display: flex;
  gap: 0.75rem;
}

.dashboard__count {
  margin-top: 1.5rem;
  color: var(--muted-on-navy);
  font-size: 0.95rem;
}

.dashboard__loading-inline {
  margin-top: 1rem;
  color: var(--muted-on-navy);
}

.dashboard__empty {
  margin-top: 3rem;
  color: var(--muted-on-navy);
  text-align: center;
}

.dashboard__table-wrap {
  margin-top: 1.5rem;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid var(--line);
}

.dashboard__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  white-space: nowrap;
}

.dashboard__table th,
.dashboard__table td {
  text-align: left;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--line);
}

.dashboard__table th {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-on-navy);
  background: rgba(255, 255, 255, 0.03);
}

.dashboard__table tbody tr:last-child td {
  border-bottom: none;
}

.dashboard__table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
</style>
