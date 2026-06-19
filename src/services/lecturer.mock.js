const CURRENT_LECTURER_ID = "lec-001";

export const lecturers = [
  {
    id: "lec-001",
    name: "Dr. Folake Adesanya",
    email: "folake@uniosun.edu.ng",
    department: "Computer Science",
  },
  {
    id: "lec-002",
    name: "Prof. Taiwo Akinwale",
    email: "taiwo@uniosun.edu.ng",
    department: "Computer Science",
  },
];

export const availableCourses = [
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
    shortTitle: "Data Structures...",
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
];

export const lecturerCourseAssignments = [
  {
    lecturerId: "lec-001",
    courseId: "csc-112",
  },
  {
    lecturerId: "lec-001",
    courseId: "csc-321",
  },
];

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

export function getCurrentLecturer() {
  return lecturers.find((lecturer) => lecturer.id === CURRENT_LECTURER_ID);
}

export function getAvailableCourses() {
  return availableCourses;
}

export function getLecturerCourses(lecturerId = CURRENT_LECTURER_ID) {
  const assignedCourseIds = lecturerCourseAssignments
    .filter((assignment) => assignment.lecturerId === lecturerId)
    .map((assignment) => assignment.courseId);

  return availableCourses.filter((course) =>
    assignedCourseIds.includes(course.id)
  );
}

export function getCourseById(courseId) {
  return availableCourses.find((course) => course.id === courseId);
}

export function assignCourseToLecturer(
  lecturerId = CURRENT_LECTURER_ID,
  courseId
) {
  const safeLecturerId = sanitizeText(lecturerId);
  const safeCourseId = sanitizeText(courseId);

  const lecturerExists = lecturers.some(
    (lecturer) => lecturer.id === safeLecturerId
  );

  const courseExists = availableCourses.some(
    (course) => course.id === safeCourseId
  );

  if (!lecturerExists || !courseExists) {
    return {
      success: false,
      message: "Invalid lecturer or course selected.",
    };
  }

  const alreadyAssigned = lecturerCourseAssignments.some(
    (assignment) =>
      assignment.lecturerId === safeLecturerId &&
      assignment.courseId === safeCourseId
  );

  if (alreadyAssigned) {
    return {
      success: false,
      message: "Course is already assigned to this lecturer.",
    };
  }

  lecturerCourseAssignments.push({
    lecturerId: safeLecturerId,
    courseId: safeCourseId,
  });

  return {
    success: true,
    message: "Course assigned successfully.",
  };
}

export function removeCourseFromLecturer(
  lecturerId = CURRENT_LECTURER_ID,
  courseId
) {
  const safeLecturerId = sanitizeText(lecturerId);
  const safeCourseId = sanitizeText(courseId);

  const index = lecturerCourseAssignments.findIndex(
    (assignment) =>
      assignment.lecturerId === safeLecturerId &&
      assignment.courseId === safeCourseId
  );

  if (index === -1) {
    return {
      success: false,
      message: "Course assignment not found.",
    };
  }

  lecturerCourseAssignments.splice(index, 1);

  return {
    success: true,
    message: "Course removed successfully.",
  };
}