import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_auth";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function getStoredAuth() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY));

  if (!stored || !stored.user || !stored.token) {
    return {
      user: null,
      token: "",
      isAuthenticated: false,
    };
  }

  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: true,
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    ...getStoredAuth(),
  }),

  getters: {
    userRole: (state) => state.user?.role || "",
    userName: (state) => state.user?.name || "Guest User",
    userInitials: (state) => {
      const name = state.user?.name || "Guest User";

      return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    },
  },

  actions: {
    login(payload) {
      const role = sanitizeText(payload.role).toLowerCase();

      const roleProfiles = {
        admin: {
          name: "Sola Adeyemi",
          email: "sola@uniosun.edu.ng",
          role: "admin",
          label: "Admin",
        },
        lecturer: {
          name: "Dr. Folake Adesanya",
          email: "folake@uniosun.edu.ng",
          role: "lecturer",
          label: "Lecturer",
        },
        student: {
          name: "Adebayo Johnson",
          email: "adebayo@student.uniosun.edu.ng",
          role: "student",
          label: "Student",
        },
      };

      const selectedUser = roleProfiles[role];

      if (!selectedUser) {
        throw new Error("Invalid login role selected.");
      }

      const authPayload = {
        user: selectedUser,
        token: `dummy_${role}_token_${Date.now()}`,
      };

      this.user = authPayload.user;
      this.token = authPayload.token;
      this.isAuthenticated = true;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authPayload));
    },

    logout() {
      this.user = null;
      this.token = "";
      this.isAuthenticated = false;

      localStorage.removeItem(STORAGE_KEY);
    },
  },
});