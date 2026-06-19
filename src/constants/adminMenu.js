import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-vue-next";

export const adminMenu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Courses",
    icon: BookOpen,
    path: "/admin/courses",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];