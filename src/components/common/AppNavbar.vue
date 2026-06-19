<template>
  <header class="navbar">
    <div class="breadcrumb">
      <span>{{ portalLabel }}</span>
      <ChevronRight :size="13" :stroke-width="2" />
      <strong>{{ currentPage }}</strong>
    </div>

    <div class="profile-area">
      <div class="profile-text">
        <strong>{{ auth.userName }}</strong>
        <span>{{ roleLabel }}</span>
      </div>

      <button type="button" class="avatar-button">
        {{ auth.userInitials }}
      </button>

      <ChevronDown :size="15" class="chevron" />

      <button type="button" class="notify-button" aria-label="Notifications">
        <Bell :size="18" :stroke-width="1.9" />
        <span></span>
      </button>

      <button type="button" class="logout-button" @click="handleLogout">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Bell, ChevronDown, ChevronRight } from "lucide-vue-next";

import { useAuthStore } from "../../stores/auth.store";

const props = defineProps({
  currentPage: {
    type: String,
    default: "Dashboard",
  },
});

const router = useRouter();
const auth = useAuthStore();

const roleLabel = computed(() => {
  return auth.user?.label || "User";
});

const portalLabel = computed(() => {
  const role = auth.userRole;

  if (role === "admin") return "Admin Portal";
  if (role === "lecturer") return "Lecturer Portal";
  if (role === "student") return "Student Portal";

  return "Portal";
});

function handleLogout() {
  auth.logout();
  router.replace("/login");
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--page-padding-x);
  border-bottom: 1px solid #edf2f7;
  background: #ffffff;
  box-shadow: var(--shadow-topbar);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 600;
}

.breadcrumb strong {
  color: var(--color-primary);
  font-weight: 700;
}

.profile-area {
  display: flex;
  align-items: center;
  gap: 9px;
}

.profile-text {
  text-align: right;
}

.profile-text strong {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.1;
}

.profile-text span {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.avatar-button {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
}

.chevron {
  color: #0f172a;
}

.notify-button {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #b7c4d7;
  border-radius: 4px;
  background: #ffffff;
  color: #475569;
}

.notify-button span {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #ef4444;
}

.logout-button {
  height: 34px;
  padding: 0 12px;
  border: 1px solid #ef4444;
  border-radius: 4px;
  background: #ffffff;
  color: #ef4444;
  font-size: 12px;
  font-weight: 800;
  transition: 0.2s ease;
}

.logout-button:hover {
  background: #fef2f2;
}

@media (max-width: 900px) {
  .profile-text,
  .logout-button {
    display: none;
  }
}
</style>