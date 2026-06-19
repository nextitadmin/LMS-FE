import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Gauge,
  Library,
  Settings,
} from "lucide-vue-next";

export function buildStudentMenu(courses = []) {
  return [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: Gauge,
    },
    {
      label: "Calendar",
      path: "/student/calendar",
      icon: CalendarDays,
    },
    {
      label: "My Courses",
      path: "/student/my-courses",
      icon: BookOpen,
      children: courses.map((course) => ({
        label: `${course.code} - ${course.shortTitle || course.title}`,
        path: `/student/my-courses/${course.id}/materials`,
      })),
    },
    {
      label: "Catalogue",
      path: "/student/catalogue",
      icon: Library,
    },
    {
      label: "Test",
      path: "/student/test",
      icon: ClipboardCheck,
    },
    {
      label: "Settings",
      path: "/student/settings",
      icon: Settings,
    },
  ];
}