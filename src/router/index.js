import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    component: () => import("../pages/auth/Login.vue"),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: "/admin",
    component: () => import("../layouts/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin"],
    },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("../pages/admin/Dashboard.vue"),
      },
      {
        path: "users",
        component: () => import("../pages/admin/Users.vue"),
      },
      {
        path: "courses",
        component: () => import("../pages/admin/Courses.vue"),
      },
      {
        path: "analytics",
        component: () => import("../pages/admin/Analytics.vue"),
      },
      {
        path: "settings",
        component: () => import("../pages/admin/Settings.vue"),
      },
    ],
  },

  {
    path: "/lecturer",
    component: () => import("../layouts/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["lecturer"],
    },
    children: [
      {
        path: "",
        redirect: "/lecturer/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("../pages/lecturer/Dashboard.vue"),
      },
      {
        path: "calendar",
        component: () => import("../pages/lecturer/Calendar.vue"),
      },
      {
        path: "courses",
        component: () => import("../pages/lecturer/MyCourses.vue"),
      },
      {
        path: "courses/:courseId/:section",
        component: () => import("../pages/lecturer/CourseWorkSpace.vue"),
      },
      {
        path: "test",
        component: () => import("../pages/lecturer/Test.vue"),
      },
      {
        path: "settings",
        component: () => import("../pages/lecturer/Settings.vue"),
      },
    ],
  },

  {
    path: "/student",
    component: () => import("../layouts/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["student"],
    },
    children: [
      {
        path: "",
        redirect: "/student/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("../pages/student/Dashboard.vue"),
      },
      {
        path: "calendar",
        component: () => import("../pages/student/Calendar.vue"),
      },
      {
        path: "notifications",
        component: () => import("../pages/student/Notifications.vue"),
      },
      {
        path: "test",
        component: () => import("../pages/student/Tests.vue"),
      },
      {
        path: "test/:testId/take",
        component: () => import("../pages/student/TestTake.vue"),
      },
      {
        path: "test/:testId/result",
        component: () => import("../pages/student/TestResult.vue"),
      },
      {
        path: "settings",
        component: () => import("../pages/student/Settings.vue"),
      },
      {
        path: "my-courses/:courseId",
        component: () => import("../pages/student/StudentCourseWorkspace.vue"),
        children: [
          {
            path: "",
            redirect: (to) =>
              `/student/my-courses/${to.params.courseId}/materials`,
          },
          {
            path: "materials",
            component: () => import("../pages/student/StudentMaterials.vue"),
          },
          {
            path: "materials/:materialId",
            component: () =>
              import("../pages/student/StudentMaterialPreview.vue"),
          },
          {
            path: "videos",
            component: () => import("../pages/student/StudentVideos.vue"),
          },
          {
            path: "assignments",
            component: () => import("../pages/student/StudentAssignments.vue"),
          },
          {
            path: "assignments/:assignmentId",
            component: () =>
              import("../pages/student/StudentAssignmentView.vue"),
          },
          {
            path: "discussion",
            component: () => import("../pages/student/StudentDiscussion.vue"),
          },
          {
            path: "grades",
            component: () => import("../pages/student/StudentGrades.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.guestOnly && auth.isAuthenticated) {
    if (auth.userRole === "admin") return "/admin/dashboard";
    if (auth.userRole === "lecturer") return "/lecturer/dashboard";
    if (auth.userRole === "student") return "/student/dashboard";
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }

  if (
    to.meta.allowedRoles &&
    !to.meta.allowedRoles.includes(auth.userRole)
  ) {
    return "/login";
  }

  return true;
});

export default router;