import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_student_tests_v1";

const defaultState = {
  activeTests: [
    {
      id: "test-001",
      title: "Mid-Semester Online Test",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      date: "Today, 12:00 PM",
      duration: 90,
      totalMarks: 20,
      totalQuestions: 20,
      status: "Available Now",
      tag: "Active",
      submitted: false,
    },
  ],

  upcomingTests: [
    {
      id: "test-002",
      title: "Mid-Semester Online Test",
      courseCode: "CSC 312",
      courseTitle: "Data Structures & Algorithms",
      date: "Apr 15, 12:00 PM",
      duration: 60,
      totalMarks: 20,
      totalQuestions: 20,
      status: "Starts in 18 days",
      tag: "Upcoming",
    },
    {
      id: "test-003",
      title: "2nd Mid-Semester Online Test",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      date: "May 15, 12:00 PM",
      duration: 30,
      totalMarks: 20,
      totalQuestions: 20,
      status: "Starts in 6 days",
      tag: "Upcoming",
    },
  ],

  pastResults: [
    {
      id: "result-001",
      testId: "past-001",
      title: "Mid-Semester Online Test",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      submittedDate: "Mar 15, 2026",
      duration: 60,
      score: 17,
      totalMarks: 20,
      percentage: 85,
      grade: "A",
      status: "Graded",
      testType: "Multiple Choice Questions",
    },
    {
      id: "result-002",
      testId: "past-002",
      title: "Mid-Semester Online Test",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      submittedDate: "Mar 15, 2026",
      duration: 60,
      score: 18,
      totalMarks: 20,
      percentage: 90,
      grade: "A",
      status: "Auto Graded",
      testType: "Multiple Choice Questions",
    },
    {
      id: "result-003",
      testId: "past-003",
      title: "Mid-Semester Online Test",
      courseCode: "CSC 322",
      courseTitle: "Database Management Systems",
      submittedDate: "Mar 15, 2026",
      duration: 60,
      score: "",
      totalMarks: 20,
      percentage: "",
      grade: "",
      status: "Pending Review",
      testType: "Multiple Choice Questions",
    },
  ],

  answers: {},

  submittedResults: {},

  questions: [
    {
      id: "q1",
      question:
        "Which SQL command is used to retrieve data from a database table?",
      options: [
        { id: "A", text: "INSERT" },
        { id: "B", text: "SELECT" },
        { id: "C", text: "UPDATE" },
        { id: "D", text: "DELETE" },
      ],
      correctAnswer: "B",
    },
    {
      id: "q2",
      question: "Which of the following is a DBMS?",
      options: [
        { id: "A", text: "Microsoft Word" },
        { id: "B", text: "Google Chrome" },
        { id: "C", text: "MySQL" },
        { id: "D", text: "Adobe Photoshop" },
      ],
      correctAnswer: "C",
    },
    {
      id: "q3",
      question: "What does ACID stand for in database transactions?",
      options: [
        { id: "A", text: "Atomicity, Consistency, Isolation, Durability" },
        { id: "B", text: "Access, Control, Input, Data" },
        { id: "C", text: "Application, Cache, Index, Database" },
        { id: "D", text: "Atomicity, Control, Index, Durability" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q4",
      question: "Which key uniquely identifies a record in a table?",
      options: [
        { id: "A", text: "Foreign key" },
        { id: "B", text: "Candidate key" },
        { id: "C", text: "Primary key" },
        { id: "D", text: "Composite key" },
      ],
      correctAnswer: "C",
    },
    {
      id: "q5",
      question: "Which SQL clause is used to filter records?",
      options: [
        { id: "A", text: "ORDER BY" },
        { id: "B", text: "WHERE" },
        { id: "C", text: "GROUP BY" },
        { id: "D", text: "JOIN" },
      ],
      correctAnswer: "B",
    },
    {
      id: "q6",
      question: "Which normal form removes repeating groups?",
      options: [
        { id: "A", text: "1NF" },
        { id: "B", text: "2NF" },
        { id: "C", text: "3NF" },
        { id: "D", text: "BCNF" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q7",
      question: "A foreign key is used to:",
      options: [
        { id: "A", text: "Encrypt table records" },
        { id: "B", text: "Create a relationship between tables" },
        { id: "C", text: "Delete duplicate records" },
        { id: "D", text: "Sort table columns" },
      ],
      correctAnswer: "B",
    },
    {
      id: "q8",
      question:
        "Which of the following ACID properties ensures that once a transaction is committed, it remains committed even in the case of a system failure?",
      options: [
        { id: "A", text: "Atomicity — all operations complete or none do" },
        { id: "B", text: "Consistency — database remains in a valid state" },
        {
          id: "C",
          text: "Isolation — concurrent transactions don't interfere",
        },
        {
          id: "D",
          text: "Durability — committed data persists through failures",
        },
      ],
      correctAnswer: "D",
    },
    {
      id: "q9",
      question:
        "Which of the following ACID properties ensures that once a transaction is committed, it remains committed even in the case of a system failure?",
      options: [
        { id: "A", text: "Atomicity — all operations complete or none do" },
        { id: "B", text: "Consistency — database remains in a valid state" },
        {
          id: "C",
          text: "Isolation — concurrent transactions don't interfere",
        },
        {
          id: "D",
          text: "Durability — committed data persists through failures",
        },
      ],
      correctAnswer: "C",
      resultAnswer: "B",
    },
    {
      id: "q10",
      question: "Which SQL keyword is used to remove duplicates?",
      options: [
        { id: "A", text: "UNIQUE" },
        { id: "B", text: "DISTINCT" },
        { id: "C", text: "ONLY" },
        { id: "D", text: "FILTER" },
      ],
      correctAnswer: "B",
    },
    {
      id: "q11",
      question: "Which SQL command modifies existing records?",
      options: [
        { id: "A", text: "UPDATE" },
        { id: "B", text: "CREATE" },
        { id: "C", text: "SELECT" },
        { id: "D", text: "DROP" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q12",
      question: "Which command removes a table structure completely?",
      options: [
        { id: "A", text: "DELETE" },
        { id: "B", text: "REMOVE" },
        { id: "C", text: "DROP" },
        { id: "D", text: "CLEAR" },
      ],
      correctAnswer: "C",
    },
    {
      id: "q13",
      question: "What does SQL mean?",
      options: [
        { id: "A", text: "Structured Query Language" },
        { id: "B", text: "Simple Query Logic" },
        { id: "C", text: "System Query Library" },
        { id: "D", text: "Structured Queue Language" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q14",
      question: "Which database model stores data in tables?",
      options: [
        { id: "A", text: "Hierarchical model" },
        { id: "B", text: "Network model" },
        { id: "C", text: "Relational model" },
        { id: "D", text: "Object model" },
      ],
      correctAnswer: "C",
    },
    {
      id: "q15",
      question: "Which operation combines rows from two or more tables?",
      options: [
        { id: "A", text: "JOIN" },
        { id: "B", text: "SORT" },
        { id: "C", text: "FILTER" },
        { id: "D", text: "INDEX" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q16",
      question: "A candidate key is:",
      options: [
        { id: "A", text: "A key that can uniquely identify records" },
        { id: "B", text: "A duplicate field" },
        { id: "C", text: "A rejected primary key" },
        { id: "D", text: "A password field" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q17",
      question: "Which constraint prevents null values?",
      options: [
        { id: "A", text: "DEFAULT" },
        { id: "B", text: "CHECK" },
        { id: "C", text: "NOT NULL" },
        { id: "D", text: "FOREIGN KEY" },
      ],
      correctAnswer: "C",
    },
    {
      id: "q18",
      question: "Which SQL clause sorts result records?",
      options: [
        { id: "A", text: "ORDER BY" },
        { id: "B", text: "WHERE" },
        { id: "C", text: "HAVING" },
        { id: "D", text: "GROUP BY" },
      ],
      correctAnswer: "A",
    },
    {
      id: "q19",
      question: "Which SQL function counts rows?",
      options: [
        { id: "A", text: "SUM()" },
        { id: "B", text: "COUNT()" },
        { id: "C", text: "TOTAL()" },
        { id: "D", text: "NUMBER()" },
      ],
      correctAnswer: "B",
    },
    {
      id: "q20",
      question: "Which command creates a new table?",
      options: [
        { id: "A", text: "MAKE TABLE" },
        { id: "B", text: "NEW TABLE" },
        { id: "C", text: "CREATE TABLE" },
        { id: "D", text: "ADD TABLE" },
      ],
      correctAnswer: "C",
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...clone(defaultState), ...JSON.parse(saved) } : clone(defaultState);
  } catch {
    return clone(defaultState);
  }
}

export const useStudentTestsStore = defineStore("studentTests", {
  state: () => loadState(),

  getters: {
    getActiveTestById: (state) => (testId) => {
      return state.activeTests.find((test) => test.id === testId);
    },

    getResultByTestId: (state) => (testId) => {
      return (
        state.submittedResults[testId] ||
        state.pastResults.find((result) => result.testId === testId)
      );
    },

    getAnswersByTest: (state) => (testId) => {
      return state.answers[testId] || {};
    },

    answeredCount: (state) => (testId) => {
      return Object.keys(state.answers[testId] || {}).length;
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTests: this.activeTests,
          upcomingTests: this.upcomingTests,
          pastResults: this.pastResults,
          answers: this.answers,
          submittedResults: this.submittedResults,
          questions: this.questions,
        })
      );
    },

    answerQuestion(testId, questionId, optionId) {
      if (!this.answers[testId]) {
        this.answers[testId] = {};
      }

      this.answers[testId][questionId] = optionId;
      this.persist();
    },

    submitTest(testId) {
      const test = this.activeTests.find((item) => item.id === testId);
      const answers = this.answers[testId] || {};

      if (!test) {
        return { success: false, message: "Test not found." };
      }

      const score = this.questions.reduce((total, question) => {
        return answers[question.id] === question.correctAnswer ? total + 1 : total;
      }, 0);

      const percentage = Math.round((score / this.questions.length) * 100);
      const grade = percentage >= 70 ? "A" : percentage >= 60 ? "B" : percentage >= 50 ? "C" : "D";

      const result = {
        id: `result-${Date.now()}`,
        testId,
        title: test.title,
        courseCode: test.courseCode,
        courseTitle: test.courseTitle,
        submittedDate: "Feb 10, 2026",
        duration: 15,
        score,
        totalMarks: test.totalMarks,
        percentage,
        grade,
        status: "Auto Graded",
        testType: "Multiple Choice Questions",
        answers,
      };

      this.submittedResults[testId] = result;
      this.pastResults.unshift(result);
      this.activeTests = this.activeTests.filter((item) => item.id !== testId);

      this.persist();

      return { success: true, result };
    },

    resetDemo() {
      localStorage.removeItem(STORAGE_KEY);
      const fresh = clone(defaultState);
      Object.assign(this, fresh);
      this.persist();
    },
  },
});