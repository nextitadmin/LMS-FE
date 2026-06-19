<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-top">
          <div class="logo-mark">
            <span>UNIOSUN</span>
          </div>

          <span v-if="isAdmin" class="lms-pill">LMS</span>
        </div>

        <p>Osun State University</p>
      </div>

      <nav class="menu" aria-label="Dashboard navigation">
        <div v-for="item in menu" :key="item.path" class="menu-group">
          <button
            v-if="item.children?.length"
            type="button"
            class="menu-link menu-button"
            :class="{ active: isParentActive(item), open: openMenus[item.path] }"
            @click="toggleMenu(item.path)"
          >
            <component :is="item.icon" :size="18" :stroke-width="1.8" />
            <span>{{ item.label }}</span>

            <ChevronDown
              :size="14"
              class="menu-chevron"
              :class="{ rotated: openMenus[item.path] }"
            />
          </button>

          <router-link
            v-else
            :to="item.path"
            class="menu-link"
            active-class="active"
          >
            <component :is="item.icon" :size="18" :stroke-width="1.8" />
            <span>{{ item.label }}</span>
          </router-link>

          <div v-if="item.children?.length && openMenus[item.path]" class="submenu">
            <router-link
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="submenu-link"
              active-class="active"
            >
              {{ child.label }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="session-label">
        2025/2026 Session - Semester 2
      </div>
    </aside>

    <section class="workspace">
      <AppNavbar :current-page="currentPage" />

      <main class="page-body">
        <router-view />
      </main>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { ChevronDown } from "lucide-vue-next";

import AppNavbar from "../components/common/AppNavbar.vue";
import { adminMenu } from "../constants/adminMenu";
import { buildLecturerMenu } from "../constants/lecturerMenu";
import { buildStudentMenu } from "../constants/studentMenu";
import { useAuthStore } from "../stores/auth.store";
import { useLecturerCoursesStore } from "../stores/lecturerCourses.store";
import { useStudentStore } from "../stores/student.store";

const route = useRoute();
const auth = useAuthStore();
const lecturerCoursesStore = useLecturerCoursesStore();
const studentStore = useStudentStore();

const openMenus = reactive({});

const isAdmin = computed(() => auth.userRole === "admin");

const menu = computed(() => {
  if (auth.userRole === "lecturer") {
    return buildLecturerMenu(lecturerCoursesStore.lecturerCourses);
  }

  if (auth.userRole === "student") {
    return buildStudentMenu(studentStore.courses);
  }

  return adminMenu;
});

const currentPage = computed(() => {
  const flatMenu = menu.value.flatMap((item) => [
    item,
    ...(item.children || []),
  ]);

  const activeItem = flatMenu.find((item) => {
    if (item.path === route.path) return true;
    return route.path.startsWith(item.path) && item.path !== "/";
  });

  return activeItem?.label?.split(" - ")[0] || "Dashboard";
});

watch(
  () => route.path,
  () => {
    menu.value.forEach((item) => {
      if (item.children?.some((child) => route.path.startsWith(child.path))) {
        openMenus[item.path] = true;
      }
    });
  },
  { immediate: true }
);

function toggleMenu(path) {
  openMenus[path] = !openMenus[path];
}

function isParentActive(item) {
  return item.children?.some((child) => route.path.startsWith(child.path));
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

.sidebar {
  position: sticky;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  flex: 0 0 var(--sidebar-width);
  border-right: 1px solid var(--color-border);
  background: #ffffff;
  overflow-y: auto;
}

.brand {
  padding: 18px 16px 28px;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border: 4px solid #d8e7db;
  border-radius: 999px;
  background:
    radial-gradient(circle at center, #f8fafc 0 28%, transparent 29%),
    conic-gradient(#16a34a, #f59e0b, #16a34a);
  color: #0f5132;
  font-size: 7px;
  font-weight: 900;
}

.lms-pill {
  height: 24px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  background: #334155;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
}

.brand p {
  margin: 4px 0 0 72px;
  color: #26344d;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.menu {
  display: grid;
  margin-top: 14px;
}

.menu-link {
  position: relative;
  min-height: 39px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 16px;
  color: #64748b;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s ease;
}

.menu-button {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.menu-link:hover,
.menu-link.active,
.menu-link.open {
  background: #f4f7fb;
  color: var(--color-primary);
}

.menu-link.active::before,
.menu-link.open::before {
  content: "";
  position: absolute;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--color-primary);
}

.menu-chevron {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.menu-chevron.rotated {
  transform: rotate(180deg);
}

.submenu {
  display: grid;
  padding: 4px 0 6px;
}

.submenu-link {
  display: block;
  padding: 9px 16px 9px 40px;
  color: #64748b;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submenu-link:hover,
.submenu-link.active {
  background: #eef6ff;
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
  padding-left: 37px;
}

.session-label {
  margin-top: 70px;
  padding: 0 16px;
  color: #334155;
  font-size: 14px;
  font-weight: 800;
}

.workspace {
  width: calc(100% - var(--sidebar-width));
  min-width: 0;
}

.page-body {
  padding: var(--page-padding-y) var(--page-padding-x);
}

@media (max-width: 900px) {
  .brand p,
  .lms-pill,
  .menu-link span,
  .submenu,
  .session-label,
  .menu-chevron {
    display: none;
  }

  .brand-top {
    justify-content: center;
  }

  .logo-mark {
    width: 44px;
    height: 44px;
  }

  .menu-link {
    justify-content: center;
    padding: 0;
  }
}
</style>