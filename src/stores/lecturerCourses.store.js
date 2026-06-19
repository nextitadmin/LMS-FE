import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_lecturer_courses_v1";
const CURRENT_LECTURER_ID = "lec-001";

const defaultState = {
  currentLecturerId: CURRENT_LECTURER_ID,

  lecturers: [
    {
      id: "lec-001",
      name: "Dr. Folake Adesanya",
      email: "folake@uniosun.edu.ng",
      department: "Computer Science",
      initials: "AO",
    },
    {
      id: "lec-002",
      name: "Prof. Taiwo Akinwale",
      email: "taiwo@uniosun.edu.ng",
      department: "Computer Science",
      initials: "TA",
    },
  ],

  availableCourses: [
    {
      id: "csc-112",
      code: "CSC 112",
      title: "Introduction to Computer Science",
      shortTitle: "Introduction to Co...",
      units: 3,
      students: 110,
      toGrade: 5,
      newPosts: 2,
      theme: "purple",
    },
    {
      id: "csc-321",
      code: "CSC 321",
      title: "Data Structures & Algorithms",
      shortTitle: "Data Science...",
      units: 3,
      students: 68,
      toGrade: 3,
      newPosts: 5,
      theme: "orange",
    },
    {
      id: "csc-322",
      code: "CSC 322",
      title: "Database Management Systems",
      shortTitle: "Database Systems...",
      units: 3,
      students: 84,
      toGrade: 11,
      newPosts: 1,
      theme: "blue",
    },
  ],

  assignments: [
    { lecturerId: "lec-001", courseId: "csc-112" },
    { lecturerId: "lec-001", courseId: "csc-321" },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : clone(defaultState);
  } catch {
    return clone(defaultState);
  }
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

export const useLecturerCoursesStore = defineStore("lecturerCourses", {
  state: () => loadState(),

  getters: {
    currentLecturer(state) {
      return state.lecturers.find(
        (lecturer) => lecturer.id === state.currentLecturerId
      );
    },

    lecturerCourses(state) {
      const assignedIds = state.assignments
        .filter((item) => item.lecturerId === state.currentLecturerId)
        .map((item) => item.courseId);

      return state.availableCourses.filter((course) =>
        assignedIds.includes(course.id)
      );
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentLecturerId: this.currentLecturerId,
          lecturers: this.lecturers,
          availableCourses: this.availableCourses,
          assignments: this.assignments,
        })
      );
    },

    getCourseById(courseId) {
      return this.availableCourses.find((course) => course.id === courseId);
    },

    getUnassignedCourses() {
      const assignedIds = this.lecturerCourses.map((course) => course.id);

      return this.availableCourses.filter(
        (course) => !assignedIds.includes(course.id)
      );
    },

    assignCourse(courseId) {
      const safeCourseId = sanitizeText(courseId);

      if (!safeCourseId) {
        return { success: false, message: "Select a course." };
      }

      const exists = this.availableCourses.some(
        (course) => course.id === safeCourseId
      );

      if (!exists) {
        return { success: false, message: "Invalid course selected." };
      }

      const alreadyAssigned = this.assignments.some(
        (item) =>
          item.lecturerId === this.currentLecturerId &&
          item.courseId === safeCourseId
      );

      if (alreadyAssigned) {
        return { success: false, message: "Course already registered." };
      }

      this.assignments.push({
        lecturerId: this.currentLecturerId,
        courseId: safeCourseId,
      });

      this.persist();

      return { success: true };
    },

    removeCourse(courseId) {
      this.assignments = this.assignments.filter(
        (item) =>
          !(
            item.lecturerId === this.currentLecturerId &&
            item.courseId === courseId
          )
      );

      this.persist();
    },
  },
});