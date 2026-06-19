import { getToken } from "@/utils/token";

export function authGuard(to, from, next) {
  const token = getToken();

  if (!token && to.meta.requiresAuth) {
    return next("/login");
  }

  next();
}

export function roleGuard(to, from, next, role) {
  const user = JSON.parse(localStorage.getItem("lms_user") || "null");

  if (to.meta.role && user?.role !== role) {
    return next("/unauthorized");
  }

  next();
}