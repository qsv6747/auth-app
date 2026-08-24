<template>
  <div class="screen">
    <button class="back-arrow" @click="$router.back()" aria-label="Back">‹</button>

    <h1 class="title">Login</h1>

    <div class="tabs">
      <button
        class="tab"
        :class="{ active: mode === 'email' }"
        @click="mode = 'email'"
      >
        Email
      </button>
      <button
        class="tab"
        :class="{ active: mode === 'phone' }"
        @click="mode = 'phone'"
      >
        Phone Number
      </button>
    </div>
    <div class="tab-underline" :style="{ transform: mode === 'phone' ? 'translateX(90px)' : 'none' }"></div>

    <label class="field-label">{{ mode === "email" ? "Email" : "Phone Number" }}</label>
    <div class="field-wrap">
      <input
        v-if="mode === 'email'"
        v-model="email"
        type="email"
        class="field-input"
        placeholder="Please enter email"
        autocomplete="username"
      />
      <input
        v-else
        v-model="phone"
        type="tel"
        class="field-input"
        placeholder="Please enter phone number"
        autocomplete="tel"
      />
    </div>

    <label class="field-label">Password</label>
    <div class="field-wrap">
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        class="field-input"
        placeholder="Please enter password"
        autocomplete="current-password"
      />
      <button class="toggle-visibility" type="button" @click="showPassword = !showPassword">
        {{ showPassword ? "🙈" : "🐵" }}
      </button>
    </div>

    <div class="row" @click="rememberPassword = !rememberPassword">
      <span class="checkbox" :class="{ checked: rememberPassword }">✓</span>
      <span>Remember Password</span>
    </div>

    <button class="forgot-link" type="button" @click="goForgotPassword">Forgot Password</button>

    <div class="row agreement-row" @click="agreed = !agreed">
      <span class="checkbox" :class="{ checked: agreed }">✓</span>
      <span>
        I have read and agree
        <a href="/terms" @click.stop>User Agreement</a>
      </span>
    </div>

    <div v-if="errorMessage" class="banner error">{{ errorMessage }}</div>

    <button class="submit-btn" :disabled="!canSubmit || loading" @click="handleLogin">
      {{ loading ? "Logging in…" : "Login" }}
    </button>

    <a class="download-link" href="/download">Download App</a>

    <div class="switch-row">
      No Account?
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const router = useRouter();

const mode = ref("email");
const email = ref("");
const phone = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberPassword = ref(true);
const agreed = ref(true);
const loading = ref(false);
const errorMessage = ref("");

const canSubmit = computed(() => {
  const idFilled = mode.value === "email" ? email.value.trim() : phone.value.trim();
  return idFilled && password.value && agreed.value;
});

function goForgotPassword() {
  router.push("/forgot-password");
}

async function handleLogin() {
  errorMessage.value = "";
  if (!canSubmit.value) return;
  loading.value = true;
  try {
    const body =
      mode.value === "email"
        ? { email: email.value.trim(), password: password.value }
        : { phone: phone.value.trim(), password: password.value };

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      errorMessage.value = data.error || "Login failed.";
      return;
    }

    if (rememberPassword.value) {
      localStorage.setItem("auth_token", data.token);
    } else {
      sessionStorage.setItem("auth_token", data.token);
    }

    router.push("/"); // redirect to your app's home/dashboard route
  } catch (err) {
    errorMessage.value = "Could not reach the server. Is the backend running?";
  } finally {
    loading.value = false;
  }
}
</script>
