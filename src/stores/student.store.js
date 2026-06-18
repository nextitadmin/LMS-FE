import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_student_v1";
const LECTURER_MATERIALS_KEY = "uniosun_lms_lecturer_materials_v1";
const LECTURER_WORKSPACE_KEY = "uniosun_lms_lecturer_workspace_v1";

const defaultState = {
  currentStudent: {
    id: "stu-001",
    name: "Adebayo Tunde",
    firstName: "Tunde",
    initials: "TA",
    matricNo: "CSC/2021/042",
    level: "300L",
    department: "Computer Science",
    departmentShort: "CSC Dept.",
    session: "2025/2026 Session - Semester 2",
  },

  courses: [
    {
      id: "csc-112",
      code: "CSC 112",
      title: "Introduction to Computer Science",
      shortTitle: "Introduction to Co...",
      lecturer: "Dr. Folake Adesanya",
      semester: "1st Semester",
      color: "purple",
      materialsCount: 5,
      videosCount: 5,
      assignmentsCount: 5,
      discussionsCount: 3,
    },
    {
      id: "csc-321",
      code: "CSC 321",
      title: "Data Structures & Algorithms",
      shortTitle: "Data Science...",
      lecturer: "Prof. Taiwo Akinwale",
      semester: "1st Semester",
      color: "blue",
      materialsCount: 3,
      videosCount: 2,
      assignmentsCount: 2,
      discussionsCount: 1,
    },
    {
      id: "csc-322",
      code: "CSC 322",
      title: "Database Management Systems",
      shortTitle: "Database Systems...",
      lecturer: "Dr. Folake Adesanya",
      semester: "1st Semester",
      color: "green",
      materialsCount: 2,
      videosCount: 1,
      assignmentsCount: 1,
      discussionsCount: 1,
    },
  ],

  courseMaterials: [
    {
      id: "mat-1",
      courseId: "csc-112",
      title: "What is Computer Science.pdf",
      category: "Lecture Notes (PDF)",
      type: "pdf",
      week: 7,
      date: "April 4",
      size: "1.2 MB",
      allowDownload: true,
      fileUrl: "",
      fileName: "What is Computer Science.pdf",
    },
    {
      id: "mat-2",
      courseId: "csc-112",
      title: "Number Systems Slide.pptx",
      category: "Slides (PPT)",
      type: "pptx",
      week: 6,
      date: "March 31",
      size: "3.5 MB",
      allowDownload: true,
      fileUrl: "",
      fileName: "Number Systems Slide.pptx",
    },
    {
      id: "mat-3",
      courseId: "csc-112",
      title: "Introduction to Programming.pdf",
      category: "Lecture Notes (PDF)",
      type: "pdf",
      week: 6,
      date: "March 30",
      size: "2.2 MB",
      allowDownload: false,
      fileUrl: "",
      fileName: "Introduction to Programming.pdf",
    },
    {
      id: "mat-4",
      courseId: "csc-112",
      title: "Introduction to Database.docx",
      category: "Past Questions",
      type: "docx",
      week: 6,
      date: "March 30",
      size: "2.2 MB",
      allowDownload: false,
      fileUrl: "",
      fileName: "Introduction to Database.docx",
    },
    {
      id: "mat-5",
      courseId: "csc-112",
      title: "SQL Practice Exercises.zip",
      category: "Past Questions",
      type: "zip",
      week: 2,
      date: "March 3",
      size: "820 KB",
      allowDownload: true,
      fileUrl: "",
      fileName: "SQL Practice Exercises.zip",
    },
  ],

  courseVideos: [
    {
      id: "vid-1",
      courseId: "csc-112",
      title: "Intro to DBMS",
      fullTitle: "Introduction to DBMS - What is a Database?",
      duration: "38:16",
      currentTime: "14:32",
      lecturer: "Dr Folake Adesanya",
      week: 1,
      allowDownload: false,
      fileUrl: "",
      description:
        "This lecture introduces the concept of databases, why they are used over flat file systems, the roles of a DBMS, and overview of major DBMS vendors. By the end you should understand what a database is, what a DBMS does, and name 3 real-world examples.",
    },
    {
      id: "vid-2",
      courseId: "csc-112",
      title: "ER Modelling Deep Dive",
      fullTitle: "ER Modelling Deep Dive",
      duration: "45:10",
      currentTime: "00:00",
      lecturer: "Dr Folake Adesanya",
      week: 3,
      allowDownload: false,
      fileUrl: "",
      description:
        "A deeper look into entities, relationships, cardinality and ER diagram design.",
    },
    {
      id: "vid-3",
      courseId: "csc-112",
      title: "SQL Basics",
      fullTitle: "SQL Basics",
      duration: "52:18",
      currentTime: "00:00",
      lecturer: "Dr Folake Adesanya",
      week: 4,
      allowDownload: false,
      fileUrl: "",
      description:
        "Introduction to SELECT, INSERT, UPDATE, DELETE and simple filtering.",
    },
    {
      id: "vid-4",
      courseId: "csc-112",
      title: "Normalization",
      fullTitle: "Normalization",
      duration: "41:29",
      currentTime: "00:00",
      lecturer: "Dr Folake Adesanya",
      week: 7,
      allowDownload: false,
      fileUrl: "",
      description:
        "Normalization rules from 1NF to 3NF with practical examples.",
    },
    {
      id: "vid-5",
      courseId: "csc-112",
      title: "JOINs and Subqueries",
      fullTitle: "JOINs and Subqueries",
      duration: "15:33",
      currentTime: "00:00",
      lecturer: "Dr Folake Adesanya",
      week: 9,
      allowDownload: false,
      fileUrl: "",
      description:
        "Using joins and subqueries to retrieve related data from multiple tables.",
    },
  ],

  assignments: [
    {
      id: "ass-1",
      courseId: "csc-112",
      courseCode: "CSC 112",
      title: "Number Conversion",
      due: "Mar 10",
      maxScore: 20,
      score: 16,
      status: "Graded",
      type: "individual",
      instructions:
        "Convert the given binary, decimal and hexadecimal numbers. Show all working clearly.",
      fileTypes: "PDF, DOCX",
      maxSize: "10 MB",
      previousSubmissionTitle: "Number Conversion Practice",
      comments: "",
      submittedFileName: "",
      feedback: "Good working. Improve formatting next time.",
    },
    {
      id: "ass-2",
      courseId: "csc-112",
      courseCode: "CSC 112",
      title: "Algorithm Design",
      due: "Mar 27",
      maxScore: 20,
      score: 14,
      status: "Graded",
      type: "individual",
      instructions:
        "Design an algorithm and explain its time complexity using clear pseudocode.",
      fileTypes: "PDF, DOCX",
      maxSize: "10 MB",
      comments: "",
      submittedFileName: "",
      feedback: "Nice attempt. Your complexity explanation needs more clarity.",
    },
    {
      id: "ass-3",
      courseId: "csc-112",
      courseCode: "CSC 112",
      title: "Database Structure",
      due: "Apr 4",
      maxScore: 20,
      score: "",
      status: "Due today",
      type: "group",
      groupMode: "manual",
      studentGroupStatus: "none",
      groupId: "",
      inviteCode: "",
      isLeader: false,
      instructions:
        "Write a 2–3 page report explaining ACID properties in database transaction management. Your report must define each ACID property with a real-world example, explain what happens when each property is violated, and describe how modern DBMS systems enforce ACID compliance.",
      fileTypes: "PDF, DOCX",
      maxSize: "10 MB",
      comments: "",
      submittedFileName: "",
      feedback: "",
    },
  ],

  groups: [
    {
      id: "grp-8",
      assignmentId: "ass-3",
      name: "Group 8",
      inviteCode: "DBX-892",
      maxMembers: 5,
      members: [
        {
          id: "stu-demo-leader",
          name: "Adebayo Oluwaseun",
          matricNo: "CSC/2021/040",
          initials: "AO",
          leader: true,
        },
        {
          id: "stu-002",
          name: "Bola Mogaji",
          matricNo: "CSC/2021/057",
          initials: "BM",
          leader: false,
        },
        {
          id: "stu-003",
          name: "Emeka Bello",
          matricNo: "CSC/2021/019",
          initials: "EB",
          leader: false,
        },
      ],
    },
  ],

  previousSubmissions: [
    {
      id: "prev-1",
      courseId: "csc-112",
      title: "SQL Queries Practice",
      subtitle: "Assignment #1",
    },
    {
      id: "prev-2",
      courseId: "csc-112",
      title: "Normalization Exercise",
      subtitle: "Assignment #2",
    },
    {
      id: "prev-3",
      courseId: "csc-112",
      title: "ER Diagram",
      subtitle: "Assignment #3",
    },
  ],

  grades: [
    {
      id: "grade-1",
      courseId: "csc-112",
      title: "Number Conversion",
      type: "Assignment",
      date: "Mar 10",
      maxScore: 20,
      score: 18,
      status: "Graded",
      feedback: "Excellent work. Clear steps and correct conversion.",
    },
    {
      id: "grade-2",
      courseId: "csc-112",
      title: "Algorithm Design",
      type: "Assignment",
      date: "Mar 24",
      maxScore: 20,
      score: 17,
      status: "Graded",
      feedback: "Good logic. Improve the pseudocode structure.",
    },
    {
      id: "grade-3",
      courseId: "csc-112",
      title: "Mid-term Test",
      type: "Test",
      date: "Apr 3",
      maxScore: 40,
      score: 36,
      status: "Graded",
      feedback: "Strong performance.",
    },
    {
      id: "grade-4",
      courseId: "csc-112",
      title: "Database Structure",
      type: "Assignment",
      date: "Apr 4",
      maxScore: 20,
      score: "",
      status: "Pending",
      feedback: "",
    },
  ],

  discussions: [
    {
      id: "disc-1",
      courseId: "csc-112",
      authorName: "Emeka B.",
      authorRole: "student",
      initials: "EB",
      type: "Question",
      body:
        "What’s the time complexity of QuickSort in the worst case, and when does it happen?",
      timeLabel: "2d",
      likes: 12,
      liked: false,
      replies: [
        {
          id: "rep-1",
          authorName: "Dr. Folake Adesanya",
          authorRole: "lecturer",
          initials: "FA",
          body:
            "Worst case is O(n²) — happens when the pivot is always the min or max. Use randomized pivot selection to avoid this.",
          timeLabel: "1d",
        },
      ],
    },
    {
      id: "disc-2",
      courseId: "csc-112",
      authorName: "Bola Mogaji",
      authorRole: "student",
      initials: "BM",
      type: "Question",
      body:
        "Is it normal for binary addition to feel confusing at first? I got 3 wrong in the tutorial.",
      timeLabel: "50m",
      likes: 2,
      liked: false,
      replies: [],
    },
    {
      id: "disc-3",
      courseId: "csc-112",
      authorName: "Dr. Folake Adesanya",
      authorRole: "lecturer",
      initials: "FA",
      type: "Announcement",
      body:
        "Please review the new lecture notes before our next class. We will discuss complexity analysis and common mistakes.",
      timeLabel: "18m",
      likes: 4,
      liked: false,
      replies: [],
    },
  ],

  courseBoards: [
    {
      id: "board-1",
      code: "CSC 312",
      newPosts: "4 new",
      color: "purple",
    },
    {
      id: "board-2",
      code: "CSC 321",
      newPosts: "4 new",
      color: "blue",
    },
    {
      id: "board-3",
      code: "CSC 322",
      newPosts: "no new",
      color: "yellow",
    },
  ],

  timetable: [
    {
      id: "tt-1",
      day: "Monday",
      date: "07/04",
      time: "10:00 AM",
      courseCode: "CSC 322",
      title: "Database Management",
      venue: "Lecture · Hall 3 · 300L",
      color: "red",
    },
    {
      id: "tt-2",
      day: "Monday",
      date: "07/04",
      time: "2:00 PM",
      courseCode: "CSC 112",
      title: "Intro to Computer Science",
      venue: "Lecture · Main Auditorium · 300L",
      color: "purple",
    },
    {
      id: "tt-3",
      day: "Tuesday",
      date: "08/04",
      time: "2:00 PM",
      courseCode: "CSC 112",
      title: "Intro to Computer Science",
      venue: "Lecture · Main Auditorium · 300L",
      color: "green",
    },
    {
      id: "tt-4",
      day: "Friday",
      date: "11/04",
      time: "10:00 AM",
      courseCode: "CSC 322",
      title: "Database Management",
      venue: "Lecture · Hall 3 · 300L",
      color: "blue",
    },
  ],

  calendarEvents: [
    {
      id: "cal-1",
      title: "CSC 322",
      fullTitle: "Lecture",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      lecturer: "Dr. Folake Adesanya",
      date: "2026-05-01",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      location: "Online",
      note: "Attendance is Compulsory!",
      color: "blue",
      type: "lecture",
    },
    {
      id: "cal-2",
      title: "CSC 312 CA",
      fullTitle: "Mid-Semester CA",
      courseCode: "CSC 312",
      courseTitle: "Software Engineering",
      lecturer: "Dr. Malik Adewale",
      date: "2026-05-01",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      location: "Online",
      note: "Attempt all questions before submission.",
      color: "purple",
      type: "test",
    },
  ],

  academicBands: [
    {
      id: "band-1",
      title: "May 1 - 5 Mid-Semester Tests (CA)",
      start: "2026-05-01",
      end: "2026-05-05",
      color: "yellow",
    },
    {
      id: "band-2",
      title: "May 14 - 18 SUG Week / Revision",
      start: "2026-05-14",
      end: "2026-05-18",
      color: "purple",
    },
    {
      id: "band-3",
      title: "May 29 Public Holiday",
      start: "2026-05-29",
      end: "2026-05-29",
      color: "green",
    },
  ],

  tests: [
    {
      id: "test-1",
      courseCode: "CSC 322",
      title: "Mid-Semester Test",
      date: "28 MAY",
      time: "10:00 AM",
      mode: "Online (LMS)",
    },
    {
      id: "test-2",
      courseCode: "CSC 112",
      title: "Quiz 2",
      date: "3 JUN",
      time: "12:00 PM",
      mode: "Online (LMS)",
    },
  ],

  deadlines: [
    {
      id: "deadline-1",
      day: "28",
      month: "MAY",
      courseCode: "CSC 322",
      title: "Mid-Semester Test",
      meta: "10:00 AM · Online (LMS)",
      active: true,
    },
    {
      id: "deadline-2",
      day: "2",
      month: "JUN",
      courseCode: "CSC 312",
      title: "Assignment",
      meta: "9:00 AM",
      active: false,
    },
    {
      id: "deadline-3",
      day: "2",
      month: "JUN",
      courseCode: "CSC 324",
      title: "Lecture",
      meta: "2:00 PM · LT 5, CST Block",
      active: false,
    },
  ],

  notifications: [
    {
      id: "not-1",
      type: "assignment",
      category: "Assignments & Tests",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      title:
        "Dr. Folake Adesanya posted a new assignment: SQL Schema Design — Group Project.",
      shortTitle:
        "Dr. Folake Adesanya posted a new assignment: SQL Schema Design in CSC 322.",
      meta: "2 hours ago · Due: 30 Mar 2026 ago",
      popupMeta: "2 hrs ago · CSC 322",
      actionLabel: "View Assignment",
      unread: true,
      accent: "red",
    },
    {
      id: "not-2",
      type: "grade",
      category: "Grades",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      title: "Grades for Assignment #4 have been published.",
      shortTitle: "Grades for Lab Report #4 have been published in CSC 312.",
      meta: "5 hours ago · Score: 16/20",
      popupMeta: "5 hrs ago · CSC 322",
      actionLabel: "View Feedback",
      unread: true,
      accent: "red",
    },
    {
      id: "not-3",
      type: "discussion",
      category: "Announcement",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      title:
        'Dr. Folake Adesanya replied to your post in the discussion board: "Difference between BCNF and 3NF".',
      shortTitle:
        "System Alert: LMS Maintenance scheduled for Saturday at 2:00 AM WAT. Expect 30 mins downtime.",
      meta: "2 days ago",
      popupMeta: "Yesterday",
      actionLabel: "Read Reply",
      unread: false,
      accent: "none",
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function sanitizeLongText(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 2000);
}

function makeInviteCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const prefix = Array.from(
    { length: 3 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");

  const suffix = Math.floor(100 + Math.random() * 900);

  return `${prefix}-${suffix}`;
}

function getFileTypeFromMaterial(item) {
  if (item.type) return item.type;

  const ext = String(item.fileName || item.title || "")
    .split(".")
    .pop()
    ?.toLowerCase();

  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx"].includes(ext)) return "pptx";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (ext === "mp4") return "mp4";
  if (ext === "zip") return "zip";

  return "file";
}

function loadJsonFromLocalStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeLecturerMaterial(item) {
  return {
    id: item.id,
    courseId: item.courseId,
    title: item.title,
    category: item.category,
    type: getFileTypeFromMaterial(item),
    week: Number(item.week) || 1,
    date: item.date || "Today",
    size: item.size || "0 KB",
    allowDownload: Boolean(item.allowDownload),
    fileUrl: item.fileUrl || "",
    fileName: item.fileName || item.title,
    duration: item.duration || "00:00",
    lecturer: "Dr Folake Adesanya",
    fullTitle: item.title,
    description: item.description || "",
  };
}

function mapLecturerAssignmentToStudent(item) {
  return {
    id: item.id,
    courseId: item.courseId,
    courseCode: item.courseCode || item.courseId?.toUpperCase() || "COURSE",
    title: item.title,
    due: item.dueDate || "Not set",
    maxScore: Number(item.totalMarks) || 20,
    score: "",
    status: "Due today",
    type: item.type === "grouped" ? "group" : "individual",
    groupMode: item.groupMethod || "manual",
    studentGroupStatus: "none",
    groupId: "",
    inviteCode: "",
    isLeader: false,
    instructions: item.description || "No assignment instruction provided.",
    fileTypes: "PDF, DOCX",
    maxSize: "10 MB",
    comments: "",
    submittedFileName: "",
    feedback: "",
  };
}

function loadState() {
  const saved = loadJsonFromLocalStorage(STORAGE_KEY, null);
  const base = saved ? { ...clone(defaultState), ...saved } : clone(defaultState);

  const lecturerMaterialsState = loadJsonFromLocalStorage(LECTURER_MATERIALS_KEY, {
    materials: [],
  });

  const lecturerWorkspaceState = loadJsonFromLocalStorage(LECTURER_WORKSPACE_KEY, {
    assignments: [],
    discussions: [],
    gradeBook: [],
  });

  const lecturerUploads = Array.isArray(lecturerMaterialsState.materials)
    ? lecturerMaterialsState.materials.map(normalizeLecturerMaterial)
    : [];

  const lecturerMaterials = lecturerUploads.filter(
    (item) => item.category !== "Video Lectures" && item.type !== "mp4"
  );

  const lecturerVideos = lecturerUploads.filter(
    (item) => item.category === "Video Lectures" || item.type === "mp4"
  );

  const lecturerAssignments = Array.isArray(lecturerWorkspaceState.assignments)
    ? lecturerWorkspaceState.assignments.map(mapLecturerAssignmentToStudent)
    : [];

  const lecturerDiscussions = Array.isArray(lecturerWorkspaceState.discussions)
    ? lecturerWorkspaceState.discussions
    : [];

  const savedMaterialIds = new Set((base.courseMaterials || []).map((item) => item.id));
  const savedVideoIds = new Set((base.courseVideos || []).map((item) => item.id));
  const savedAssignmentIds = new Set((base.assignments || []).map((item) => item.id));
  const savedDiscussionIds = new Set((base.discussions || []).map((item) => item.id));

  return {
    ...base,
    currentStudent: {
      ...clone(defaultState.currentStudent),
      ...(base.currentStudent || {}),
    },
    courses: Array.isArray(base.courses) ? base.courses : clone(defaultState.courses),
    courseMaterials: [
      ...(Array.isArray(base.courseMaterials)
        ? base.courseMaterials
        : clone(defaultState.courseMaterials)),
      ...lecturerMaterials.filter((item) => !savedMaterialIds.has(item.id)),
    ],
    courseVideos: [
      ...(Array.isArray(base.courseVideos)
        ? base.courseVideos
        : clone(defaultState.courseVideos)),
      ...lecturerVideos.filter((item) => !savedVideoIds.has(item.id)),
    ],
    assignments: [
      ...(Array.isArray(base.assignments)
        ? base.assignments
        : clone(defaultState.assignments)),
      ...lecturerAssignments.filter((item) => !savedAssignmentIds.has(item.id)),
    ],
    groups: Array.isArray(base.groups) ? base.groups : clone(defaultState.groups),
    previousSubmissions: Array.isArray(base.previousSubmissions)
      ? base.previousSubmissions
      : clone(defaultState.previousSubmissions),
    grades: Array.isArray(base.grades) ? base.grades : clone(defaultState.grades),
    discussions: [
      ...(Array.isArray(base.discussions)
        ? base.discussions
        : clone(defaultState.discussions)),
      ...lecturerDiscussions.filter((item) => !savedDiscussionIds.has(item.id)),
    ],
    courseBoards: Array.isArray(base.courseBoards)
      ? base.courseBoards
      : clone(defaultState.courseBoards),
    timetable: Array.isArray(base.timetable)
      ? base.timetable
      : clone(defaultState.timetable),
    calendarEvents: Array.isArray(base.calendarEvents)
      ? base.calendarEvents
      : clone(defaultState.calendarEvents),
    academicBands: Array.isArray(base.academicBands)
      ? base.academicBands
      : clone(defaultState.academicBands),
    tests: Array.isArray(base.tests) ? base.tests : clone(defaultState.tests),
    deadlines: Array.isArray(base.deadlines)
      ? base.deadlines
      : clone(defaultState.deadlines),
    notifications: Array.isArray(base.notifications)
      ? base.notifications
      : clone(defaultState.notifications),
  };
}

export const useStudentStore = defineStore("student", {
  state: () => loadState(),

  getters: {
    enrolledCoursesCount(state) {
      return state.courses.length;
    },

    pendingAssignmentsCount(state) {
      return state.assignments.filter((item) => item.status !== "Graded").length;
    },

    upcomingTestsCount(state) {
      return state.tests.length;
    },

    unreadNotificationsCount(state) {
      return state.notifications.filter((item) => item.unread).length;
    },

    popupNotifications(state) {
      return state.notifications.slice(0, 4);
    },

    groupedTimetable(state) {
      return state.timetable.reduce((groups, item) => {
        const key = `${item.day}-${item.date}`;

        if (!groups[key]) {
          groups[key] = {
            day: item.day,
            date: item.date,
            classes: [],
          };
        }

        groups[key].classes.push(item);
        return groups;
      }, {});
    },

    getCourseById: (state) => (courseId) => {
      return state.courses.find((course) => course.id === courseId);
    },

    getMaterialsByCourse: (state) => (courseId) => {
      return state.courseMaterials.filter((item) => item.courseId === courseId);
    },

    getVideosByCourse: (state) => (courseId) => {
      return state.courseVideos.filter((item) => item.courseId === courseId);
    },

    getAssignmentsByCourse: (state) => (courseId) => {
      return state.assignments.filter((item) => item.courseId === courseId);
    },

    getAssignmentById: (state) => (assignmentId) => {
      return state.assignments.find((item) => item.id === assignmentId);
    },

    getDiscussionsByCourse: (state) => (courseId) => {
      return state.discussions.filter((item) => item.courseId === courseId);
    },

    getGradesByCourse: (state) => (courseId) => {
      return state.grades.filter((item) => item.courseId === courseId);
    },

    getGroupForAssignment: (state) => (assignmentId) => {
      const assignment = state.assignments.find((item) => item.id === assignmentId);

      if (!assignment?.groupId) return null;

      return state.groups.find((group) => group.id === assignment.groupId) || null;
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStudent: this.currentStudent,
          courses: this.courses,
          courseMaterials: this.courseMaterials,
          courseVideos: this.courseVideos,
          assignments: this.assignments,
          groups: this.groups,
          previousSubmissions: this.previousSubmissions,
          grades: this.grades,
          discussions: this.discussions,
          courseBoards: this.courseBoards,
          timetable: this.timetable,
          calendarEvents: this.calendarEvents,
          academicBands: this.academicBands,
          tests: this.tests,
          deadlines: this.deadlines,
          notifications: this.notifications,
        })
      );
    },

    refreshFromLecturerStores() {
      const fresh = loadState();

      this.courseMaterials = fresh.courseMaterials;
      this.courseVideos = fresh.courseVideos;
      this.assignments = fresh.assignments;
      this.discussions = fresh.discussions;
      this.persist();
    },

    markNotificationRead(notificationId) {
      const notification = this.notifications.find((item) => item.id === notificationId);

      if (notification) {
        notification.unread = false;
        this.persist();
      }
    },

    markAllNotificationsRead() {
      this.notifications = this.notifications.map((item) => ({
        ...item,
        unread: false,
      }));

      this.persist();
    },

    toggleDiscussionLike(postId) {
      const post = this.discussions.find((item) => item.id === postId);

      if (!post) return;

      post.liked = !post.liked;
      post.likes = Math.max(0, Number(post.likes || 0) + (post.liked ? 1 : -1));

      this.persist();
    },

    createDiscussionPost(payload) {
      const body = sanitizeLongText(payload.body);

      if (!body) {
        return { success: false, message: "Post cannot be empty." };
      }

      const post = {
        id: `disc-${Date.now()}`,
        courseId: sanitizeText(payload.courseId),
        authorName: this.currentStudent.name,
        authorRole: "student",
        initials: this.currentStudent.initials,
        type: sanitizeText(payload.type || "Question"),
        body,
        timeLabel: "Now",
        likes: 0,
        liked: false,
        replies: [],
      };

      this.discussions.unshift(post);
      this.persist();

      return { success: true, post };
    },

    createGroup(assignmentId) {
      const assignment = this.assignments.find((item) => item.id === assignmentId);

      if (!assignment || assignment.type !== "group") {
        return { success: false, message: "Assignment not found." };
      }

      if (assignment.groupId) {
        return { success: false, message: "You already belong to a group." };
      }

      const inviteCode = makeInviteCode();

      const group = {
        id: `grp-${Date.now()}`,
        assignmentId,
        name: `Group ${Math.floor(1 + Math.random() * 9)}`,
        inviteCode,
        maxMembers: 5,
        members: [
          {
            id: this.currentStudent.id,
            name: this.currentStudent.name,
            matricNo: this.currentStudent.matricNo,
            initials: this.currentStudent.initials,
            leader: true,
          },
        ],
      };

      this.groups.push(group);

      assignment.studentGroupStatus = "leader";
      assignment.groupId = group.id;
      assignment.inviteCode = inviteCode;
      assignment.isLeader = true;

      this.persist();

      return { success: true, group };
    },

    joinGroup(assignmentId, code) {
      const assignment = this.assignments.find((item) => item.id === assignmentId);
      const safeCode = sanitizeText(code).toUpperCase();

      const group = this.groups.find(
        (item) =>
          item.assignmentId === assignmentId &&
          item.inviteCode.toUpperCase() === safeCode
      );

      if (!assignment || !group) {
        return { success: false, message: "Invalid invite code." };
      }

      const alreadyMember = group.members.some(
        (member) => member.id === this.currentStudent.id
      );

      if (!alreadyMember) {
        if (group.members.length >= group.maxMembers) {
          return { success: false, message: "This group is already full." };
        }

        group.members.push({
          id: this.currentStudent.id,
          name: this.currentStudent.name,
          matricNo: this.currentStudent.matricNo,
          initials: this.currentStudent.initials,
          leader: false,
        });
      }

      assignment.studentGroupStatus = "member";
      assignment.groupId = group.id;
      assignment.inviteCode = group.inviteCode;
      assignment.isLeader = false;

      this.persist();

      return { success: true, group };
    },

    saveSubmissionDraft(assignmentId, payload) {
      const assignment = this.assignments.find((item) => item.id === assignmentId);

      if (!assignment) {
        return { success: false, message: "Assignment not found." };
      }

      assignment.comments = sanitizeLongText(payload.comments);
      assignment.submittedFileName = sanitizeText(payload.fileName);
      assignment.draftSaved = true;

      this.persist();

      return { success: true };
    },

    submitAssignment(assignmentId, payload) {
      const assignment = this.assignments.find((item) => item.id === assignmentId);

      if (!assignment) {
        return { success: false, message: "Assignment not found." };
      }

      if (assignment.type === "group" && assignment.studentGroupStatus === "member") {
        return {
          success: false,
          message: "Only your group leader can submit this group assignment.",
        };
      }

      assignment.comments = sanitizeLongText(payload.comments);
      assignment.submittedFileName = sanitizeText(payload.fileName);
      assignment.status = "Submitted";
      assignment.submittedAt = new Date().toISOString();

      const gradeRecord = this.grades.find(
        (item) => item.id === `grade-${assignment.id}`
      );

      if (!gradeRecord) {
        this.grades.push({
          id: `grade-${assignment.id}`,
          courseId: assignment.courseId,
          title: assignment.title,
          type: "Assignment",
          date: assignment.due,
          maxScore: assignment.maxScore || 20,
          score: "",
          status: "Pending",
          feedback: "",
        });
      }

      this.persist();

      return { success: true };
    },
  },
});