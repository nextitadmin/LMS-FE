import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Settings,
} from "lucide-vue-next";

export function buildLecturerMenu(courses = []) {
  return [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/lecturer/dashboard",
    },
    {
      label: "Calendar",
      icon: CalendarDays,
      path: "/lecturer/calendar",
    },
    {
      label: "My Courses",
      icon: BookOpen,
      path: "/lecturer/courses",
      children: courses.map((course) => ({
        label: `${course.code} - ${course.shortTitle || course.title}`,
        path: `/lecturer/courses/${course.id}/materials`,
      })),
    },
    {
      label: "Test",
      icon: ClipboardCheck,
      path: "/lecturer/test",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/lecturer/settings",
    },
  ];
}