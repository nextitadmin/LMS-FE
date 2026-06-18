import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_lecturer_workspace_v1";

const MOCK_STUDENTS_BY_COURSE = {
  "csc-112": [
    "CSC112001",
    "CSC112002",
    "CSC112003",
    "CSC112004",
    "CSC112005",
    "CSC112006",
    "CSC112007",
    "CSC112008",
    "CSC112009",
    "CSC112010",
    "CSC112011",
    "CSC112012",
  ],
  "csc-321": [
    "CSC321001",
    "CSC321002",
    "CSC321003",
    "CSC321004",
    "CSC321005",
    "CSC321006",
    "CSC321007",
    "CSC321008",
    "CSC321009",
  ],
  "csc-322": [
    "CSC322001",
    "CSC322002",
    "CSC322003",
    "CSC322004",
    "CSC322005",
    "CSC322006",
    "CSC322007",
    "CSC322008",
  ],
};

const defaultState = {
  assignments: [],
  discussions: [],
  gradeBook: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : clone(defaultState);

    return {
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
      discussions: Array.isArray(parsed.discussions) ? parsed.discussions : [],
      gradeBook: Array.isArray(parsed.gradeBook) ? parsed.gradeBook : [],
    };
  } catch {
    return clone(defaultState);
  }
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function sanitizeLongText(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 2000);
}

function getInitials(name) {
  return sanitizeText(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function shuffle(items) {
  const list = [...items];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[randomIndex]] = [list[randomIndex], list[index]];
  }

  return list;
}

function buildStudentProfile(matricNo, index = 0, leader = false) {
  const names = [
    "Adebayo Oluwaseun",
    "Okafor Daniel",
    "Bello Mariam",
    "Eze Chinedu",
    "Salami Tolu",
    "Ibrahim Musa",
    "Johnson Grace",
    "Adeyemi Favour",
    "Nwachukwu David",
    "Oladipo Sarah",
    "Usman Halima",
    "Akinola Peter",
  ];

  const name = names[index % names.length];

  return {
    name,
    matric: matricNo,
    initials: getInitials(name),
    leader,
  };
}

function buildRandomGroups(students, groupSize) {
  const safeSize = Math.max(1, Number(groupSize) || 1);
  const shuffled = shuffle(students);
  const groups = [];

  for (let index = 0; index < shuffled.length; index += safeSize) {
    const members = shuffled.slice(index, index + safeSize);

    groups.push({
      id: `group-${groups.length + 1}-${Date.now()}`,
      name: `Group ${groups.length + 1}`,
      members,
    });
  }

  return groups;
}

function buildLastDigitGroups(students) {
  const buckets = {};

  students.forEach((student) => {
    const lastDigit = String(student).slice(-1);
    if (!buckets[lastDigit]) buckets[lastDigit] = [];
    buckets[lastDigit].push(student);
  });

  return Object.entries(buckets).map(([digit, members], index) => ({
    id: `group-digit-${digit}-${Date.now()}-${index}`,
    name: `Last Digit ${digit}`,
    members,
  }));
}

function buildSubmittedWork(assignment) {
  return {
    title:
      assignment.title ||
      "ACID Properties in Database Transaction Management",
    fileName: `${assignment.title || "assignment-submission"}.pdf`,
    fileUrl: "",
    sections: [
      {
        heading: "1. Introduction",
        body:
          "Transaction management is a fundamental aspect of any robust DBMS. ACID properties ensure database integrity even during failures or concurrent access scenarios...",
      },
      {
        heading: "2. Atomicity",
        body:
          "Atomicity ensures all operations in a transaction succeed or none do. For example, a bank transfer debiting Account A must also credit Account B; if either fails, the whole transaction rolls back...",
      },
    ],
  };
}

function buildMockSubmissions(assignment) {
  const students = MOCK_STUDENTS_BY_COURSE[assignment.courseId] || [];

  if (assignment.type === "grouped") {
    return assignment.groups.map((group, index) => {
      const members = group.members.map((member, memberIndex) =>
        buildStudentProfile(member, memberIndex, memberIndex === 0)
      );

      return {
        id: `sub-${assignment.id}-${group.id}`,
        assignmentId: assignment.id,
        courseId: assignment.courseId,
        groupId: group.id,
        studentName: group.name,
        matricNo: `${group.members.length} members`,
        members,
        submittedBy: members[0]?.name || "Group Leader",
        submittedAt: index % 2 === 0 ? "2 hrs ago" : "Pending",
        status: index % 2 === 0 ? "Submitted" : "Pending",
        score: "",
        feedback: "",
        submittedWork: buildSubmittedWork(assignment),
      };
    });
  }

  return students.slice(0, 8).map((student, index) => {
    const profile = buildStudentProfile(student, index, false);

    return {
      id: `sub-${assignment.id}-${student}`,
      assignmentId: assignment.id,
      courseId: assignment.courseId,
      studentName: profile.name,
      matricNo: profile.matric,
      members: [],
      submittedBy: profile.name,
      submittedAt: index < 6 ? "2 hrs ago" : "Pending",
      status: index < 6 ? "Submitted" : "Pending",
      score: "",
      feedback: "",
      submittedWork: buildSubmittedWork(assignment),
    };
  });
}

function buildDefaultDiscussions(courseId) {
  return [
    {
      id: `disc-${courseId}-1`,
      courseId,
      authorId: "student-001",
      authorName: "Emeka B.",
      authorRole: "student",
      initials: "EB",
      type: "Question",
      targetType: "course",
      targetLabel: "Entire Course",
      body:
        "What’s the time complexity of QuickSort in the worst case, and when does it happen?",
      likes: 12,
      likedByCurrentLecturer: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      timeLabel: "2d",
      replies: [
        {
          id: `reply-${courseId}-1`,
          authorId: "lec-001",
          authorName: "Dr. Folake Adesanya",
          authorRole: "lecturer",
          initials: "FA",
          body:
            "Worst case is O(n²) — happens when the pivot is always the min or max, such as sorted input with last element as pivot. Use randomized pivot selection to avoid this.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          timeLabel: "1d",
        },
      ],
    },
    {
      id: `disc-${courseId}-2`,
      courseId,
      authorId: "student-002",
      authorName: "Bola Mogaji",
      authorRole: "student",
      initials: "BM",
      type: "Question",
      targetType: "course",
      targetLabel: "Entire Course",
      body:
        "Is it normal for binary addition to feel confusing at first? I got 3 wrong in the tutorial.",
      likes: 2,
      likedByCurrentLecturer: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      timeLabel: "50m",
      replies: [],
    },
    {
      id: `disc-${courseId}-3`,
      courseId,
      authorId: "lec-001",
      authorName: "Dr. Folake Adesanya",
      authorRole: "lecturer",
      initials: "FA",
      type: "Announcement",
      targetType: "course",
      targetLabel: "Entire Course",
      body:
        "Please review the new lecture notes before our next class. We will discuss complexity analysis and common mistakes.",
      likes: 4,
      likedByCurrentLecturer: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      timeLabel: "18m",
      replies: [],
    },
  ];
}

export const useLecturerWorkspaceStore = defineStore("lecturerWorkspace", {
  state: () => loadState(),

  getters: {
    getAssignmentsByCourse: (state) => (courseId) => {
      return state.assignments.filter((item) => item.courseId === courseId);
    },

    getAssignmentById: (state) => (assignmentId) => {
      return state.assignments.find((item) => item.id === assignmentId);
    },

    getDiscussionsByCourse: (state) => (courseId) => {
      const courseDiscussions = state.discussions.filter(
        (item) => item.courseId === courseId
      );

      if (courseDiscussions.length) return courseDiscussions;

      return buildDefaultDiscussions(courseId);
    },

    getGradeBookByCourse: (state) => (courseId) => {
      return state.gradeBook.filter((item) => item.courseId === courseId);
    },

    getSubmissionById: (state) => (submissionId) => {
      return state.gradeBook.find((item) => item.id === submissionId);
    },

    getSubmissionsByAssignment: (state) => (assignmentId) => {
      return state.gradeBook.filter((item) => item.assignmentId === assignmentId);
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          assignments: this.assignments,
          discussions: this.discussions,
          gradeBook: this.gradeBook,
        })
      );
    },

    ensureDefaultDiscussions(courseId) {
      const exists = this.discussions.some((item) => item.courseId === courseId);

      if (!exists) {
        this.discussions.unshift(...buildDefaultDiscussions(courseId));
        this.persist();
      }
    },

    createAssignment(payload) {
      const courseId = sanitizeText(payload.courseId);
      const type = payload.type === "grouped" ? "grouped" : "individual";
      const groupMethod = sanitizeText(payload.groupMethod || "student_choose");
      const groupSize = Math.max(1, Number(payload.groupSize) || 1);
      const students = MOCK_STUDENTS_BY_COURSE[courseId] || [];

      let groups = [];

      if (type === "grouped" && groupMethod === "system_auto") {
        groups = buildRandomGroups(students, groupSize);
      }

      if (type === "grouped" && groupMethod === "matric_last_digit") {
        groups = buildLastDigitGroups(students);
      }

      if (type === "grouped" && groupMethod === "student_choose") {
        groups = [
          {
            id: `group-open-${Date.now()}`,
            name: "Students will choose groups",
            members: students.slice(0, groupSize),
          },
        ];
      }

      const assignment = {
        id: `ass-${Date.now()}`,
        courseId,
        title: sanitizeText(payload.title),
        description: sanitizeText(payload.description),
        type,
        submissionType: sanitizeText(payload.submissionType || "File Upload"),
        totalMarks: Number(payload.totalMarks) || 20,
        dueDate: sanitizeText(payload.dueDate),
        dueTime: sanitizeText(payload.dueTime),
        groupMethod,
        groupSize,
        groups,
        status: sanitizeText(payload.status || "Published"),
        createdAt: new Date().toISOString(),
      };

      this.assignments.unshift(assignment);
      this.gradeBook.unshift(...buildMockSubmissions(assignment));
      this.persist();

      return assignment;
    },

    updateAssignment(assignmentId, payload) {
      const index = this.assignments.findIndex((item) => item.id === assignmentId);

      if (index === -1) {
        return { success: false, message: "Assignment not found." };
      }

      const existing = this.assignments[index];
      const type = payload.type === "grouped" ? "grouped" : "individual";
      const groupMethod = sanitizeText(payload.groupMethod || existing.groupMethod);
      const groupSize = Math.max(1, Number(payload.groupSize) || 1);
      const students = MOCK_STUDENTS_BY_COURSE[existing.courseId] || [];

      let groups = existing.groups || [];

      if (type === "individual") {
        groups = [];
      }

      if (type === "grouped" && groupMethod === "system_auto") {
        groups = buildRandomGroups(students, groupSize);
      }

      if (type === "grouped" && groupMethod === "matric_last_digit") {
        groups = buildLastDigitGroups(students);
      }

      if (type === "grouped" && groupMethod === "student_choose") {
        groups = [
          {
            id: `group-open-${Date.now()}`,
            name: "Students will choose groups",
            members: students.slice(0, groupSize),
          },
        ];
      }

      const updated = {
        ...existing,
        title: sanitizeText(payload.title),
        description: sanitizeText(payload.description),
        type,
        submissionType: sanitizeText(payload.submissionType),
        totalMarks: Number(payload.totalMarks) || 20,
        dueDate: sanitizeText(payload.dueDate),
        dueTime: sanitizeText(payload.dueTime),
        groupMethod,
        groupSize,
        groups,
        updatedAt: new Date().toISOString(),
      };

      this.assignments.splice(index, 1, updated);

      this.gradeBook = this.gradeBook.filter(
        (item) => item.assignmentId !== assignmentId
      );
      this.gradeBook.unshift(...buildMockSubmissions(updated));

      this.persist();

      return { success: true, assignment: updated };
    },

    deleteAssignment(assignmentId) {
      this.assignments = this.assignments.filter((item) => item.id !== assignmentId);
      this.gradeBook = this.gradeBook.filter(
        (item) => item.assignmentId !== assignmentId
      );
      this.persist();
    },

    gradeSubmission(submissionId, payload) {
      const target = this.gradeBook.find((item) => item.id === submissionId);

      if (!target) {
        return { success: false, message: "Submission not found." };
      }

      const assignment = this.assignments.find(
        (item) => item.id === target.assignmentId
      );

      const score = Number(payload.score);
      const safeScore = Number.isFinite(score) ? score : "";
      const feedback = sanitizeText(payload.feedback);

      if (assignment?.type === "grouped") {
        this.gradeBook = this.gradeBook.map((item) => {
          if (item.assignmentId !== target.assignmentId) return item;
          if (item.groupId !== target.groupId) return item;

          return {
            ...item,
            score: safeScore,
            feedback,
            status: "Graded",
            gradedAt: new Date().toISOString(),
          };
        });
      } else {
        const index = this.gradeBook.findIndex((item) => item.id === submissionId);

        this.gradeBook.splice(index, 1, {
          ...this.gradeBook[index],
          score: safeScore,
          feedback,
          status: "Graded",
          gradedAt: new Date().toISOString(),
        });
      }

      this.persist();

      return { success: true };
    },

    createDiscussionPost(payload) {
      const body = sanitizeLongText(payload.body);

      if (!body) {
        return { success: false, message: "Post cannot be empty." };
      }

      const post = {
        id: `disc-${Date.now()}`,
        courseId: sanitizeText(payload.courseId),
        authorId: sanitizeText(payload.authorId || "lec-001"),
        authorName: sanitizeText(payload.authorName || "Lecturer"),
        authorRole: sanitizeText(payload.authorRole || "lecturer"),
        initials: getInitials(payload.authorName || "Lecturer"),
        type: sanitizeText(payload.type || "Question"),
        targetType: sanitizeText(payload.targetType || "course"),
        targetLabel: sanitizeText(payload.targetLabel || "Entire Course"),
        body,
        likes: 0,
        likedByCurrentLecturer: false,
        createdAt: new Date().toISOString(),
        timeLabel: "Now",
        replies: [],
      };

      this.discussions.unshift(post);
      this.persist();

      return { success: true, post };
    },

    createDiscussionReply(postId, payload) {
      const post = this.discussions.find((item) => item.id === postId);
      const body = sanitizeLongText(payload.body);

      if (!post) {
        return { success: false, message: "Post not found." };
      }

      if (!body) {
        return { success: false, message: "Reply cannot be empty." };
      }

      post.replies.push({
        id: `reply-${Date.now()}`,
        authorId: sanitizeText(payload.authorId || "lec-001"),
        authorName: sanitizeText(payload.authorName || "Lecturer"),
        authorRole: sanitizeText(payload.authorRole || "lecturer"),
        initials: getInitials(payload.authorName || "Lecturer"),
        body,
        createdAt: new Date().toISOString(),
        timeLabel: "Now",
      });

      this.persist();

      return { success: true };
    },

    createQuickReply(payload) {
      return this.createDiscussionPost({
        ...payload,
        type: "Question",
        targetType: "course",
        targetLabel: "Entire Course",
      });
    },

    toggleDiscussionLike(postId) {
      const post = this.discussions.find((item) => item.id === postId);

      if (!post) {
        return { success: false, message: "Post not found." };
      }

      post.likedByCurrentLecturer = !post.likedByCurrentLecturer;
      post.likes = Math.max(
        0,
        Number(post.likes || 0) + (post.likedByCurrentLecturer ? 1 : -1)
      );

      this.persist();

      return { success: true };
    },

    deleteDiscussionPost(postId) {
      this.discussions = this.discussions.filter((item) => item.id !== postId);
      this.persist();
    },
  },
});