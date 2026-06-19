<template>
  <main class="login-page">
    <section class="login-card">
      <div class="brand-area">
        <div class="logo-mark">
          UNIOSUN
        </div>

        <div>
          <h1>UNIOSUN LMS</h1>
          <p>Secure portal access</p>
        </div>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          Email Address
          <input
            v-model.trim="form.email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
          />
        </label>

        <label>
          Password
          <input
            v-model.trim="form.password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </label>

        <label>
          Login As
          <select v-model="form.role">
            <option value="admin">Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="student">Student</option>
          </select>
        </label>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit">
          Login
        </button>
      </form>

      <p class="helper-text">
        Demo mode: choose a role to enter the relevant portal.
      </p>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
const auth = useAuthStore();

const errorMessage = ref("");

const form = reactive({
  email: "",
  password: "",
  role: "admin",
});

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function validateLogin() {
  if (!sanitizeText(form.email)) {
    return "Email address is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return "Enter a valid email address.";
  }

  if (!sanitizeText(form.password)) {
    return "Password is required.";
  }

  if (!["admin", "lecturer", "student"].includes(form.role)) {
    return "Select a valid login role.";
  }

  return "";
}

function getRedirectPath(role) {
  const redirects = {
    admin: "/admin/dashboard",
    lecturer: "/lecturer/dashboard",
    student: "/student/dashboard",
  };

  return redirects[role] || "/login";
}

function handleLogin() {
  const error = validateLogin();

  if (error) {
    errorMessage.value = error;
    return;
  }

  auth.login({
    email: sanitizeText(form.email).toLowerCase(),
    password: sanitizeText(form.password),
    role: form.role,
  });

  router.replace(getRedirectPath(form.role));
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(22, 163, 74, 0.14), transparent 32%),
    linear-gradient(135deg, #f8fafc, #ffffff);
}

.login-card {
  width: min(440px, 100%);
  border: 1px solid #d5deeb;
  border-radius: 18px;
  background: white;
  padding: 32px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.1);
  animation: slideUp 0.45s ease both;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  background: #16a34a;
  color: white;
  font-size: 9px;
  font-weight: 900;
}

.brand-area h1 {
  margin: 0 0 4px;
  color: #0f172a;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 900;
}

.brand-area p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.login-form input,
.login-form select {
  height: 42px;
  border: 1px solid #d5deeb;
  border-radius: 6px;
  padding: 0 12px;
  color: #334155;
  font-size: 14px;
  outline: none;
}

.login-form input:focus,
.login-form select:focus {
  border-color: #0875f5;
}

.login-form button {
  height: 42px;
  border: 0;
  border-radius: 6px;
  background: #16a34a;
  color: white;
  font-size: 14px;
  font-weight: 900;
  transition: 0.2s ease;
}

.login-form button:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.error-message {
  margin: 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 700;
}

.helper-text {
  margin: 20px 0 0;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

@keyframes slideUp {
  from {
    transform: translateY(14px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>