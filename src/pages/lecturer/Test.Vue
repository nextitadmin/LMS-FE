<template>
  <section class="test-page">
    <div class="page-heading">
      <div>
        <h1>Create Online Test</h1>
        <p>Set timed questions for your class · {{ selectedCourseCode }}</p>
      </div>
    </div>

    <div class="test-layout">
      <main>
        <section class="settings-card">
          <h2>Test Settings</h2>

          <div class="form-two">
            <label class="form-label">
              Course
              <select v-model="testForm.courseId" class="form-select">
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.code }} - {{ course.title }}
                </option>
              </select>
            </label>

            <label class="form-label">
              Test Type
              <select v-model="testForm.testType" class="form-select">
                <option>Multiple Choice questions</option>
                <option>Theory questions</option>
                <option>Mixed questions</option>
              </select>
            </label>
          </div>

          <label class="form-label">
            Test Title
            <input v-model.trim="testForm.title" class="form-input" />
          </label>

          <div class="form-three">
            <label class="form-label">
              Due Date
              <input v-model="testForm.dueDate" class="form-input" type="date" />
            </label>

            <label class="form-label">
              Due Time
              <input v-model="testForm.dueTime" class="form-input" type="time" />
            </label>

            <label class="form-label">
              Duration (mins)
              <input
                v-model.number="testForm.duration"
                class="form-input"
                type="number"
                min="1"
              />
            </label>
          </div>

          <div class="form-two">
            <label class="form-label">
              Total Questions
              <input
                v-model.number="testForm.totalQuestions"
                class="form-input"
                type="number"
                min="1"
              />
            </label>

            <label class="form-label">
              Marks per Question
              <input
                v-model.number="testForm.marksPerQuestion"
                class="form-input"
                type="number"
                min="1"
              />
            </label>
          </div>

          <label class="form-label">
            Instructions
            <textarea
              v-model.trim="testForm.instructions"
              class="form-textarea"
              placeholder="e.g. This is a closed-book test. No collaboration allowed..."
            ></textarea>
          </label>
        </section>

        <section class="questions-card">
          <div class="questions-header">
            <h2>Questions ({{ questions.length }} added)</h2>

            <div>
              <button type="button" class="import-btn" @click="openImportModal">
                ⇩ Import Questions
              </button>
              <button type="button" class="add-btn" @click="openAddModal">
                + Add Question
              </button>
            </div>
          </div>

          <article
            v-for="(question, index) in questions"
            :key="question.id"
            class="question-row"
          >
            <span class="question-number">{{ index + 1 }}</span>

            <div class="question-content">
              <strong>{{ question.text }}</strong>
              <small>{{ question.type }} · {{ question.mark }} marks</small>
            </div>

            <button type="button" class="edit-btn" @click="openEditModal(question)">
              Edit
            </button>

            <button type="button" class="delete-btn" @click="deleteQuestion(question.id)">
              ×
            </button>
          </article>

          <div v-if="questions.length === 0" class="empty-questions">
            <h3>No questions added yet</h3>
            <p>Add questions manually or import them from CSV.</p>
          </div>

          <div class="questions-footer">
            <button type="button" class="preview-btn" @click="openPreviewModal">
              Preview Test
            </button>
            <button type="button" class="schedule-btn" @click="scheduleTest">
              Schedule Test
            </button>
          </div>

          <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
        </section>
      </main>

      <aside class="summary-card">
        <h2>Test Summary</h2>

        <div class="summary-row">
          <strong>Questions</strong>
          <span>{{ questions.length }}</span>
        </div>

        <div class="summary-row">
          <strong>Total Marks</strong>
          <span>{{ totalMarks }}</span>
        </div>

        <div class="summary-row">
          <strong>Duration</strong>
          <span>{{ testForm.duration }} mins</span>
        </div>

        <div class="summary-row">
          <strong>Date</strong>
          <span>{{ readableDate }}</span>
        </div>
      </aside>
    </div>

    <div v-if="questionModalOpen" class="modal-backdrop">
      <div class="question-modal">
        <h2>{{ editingQuestionId ? "Edit Question" : "Add Question" }}</h2>

        <form @submit.prevent="saveQuestion">
          <div class="form-two">
            <label class="form-label">
              Question Type
              <select v-model="questionForm.type" class="form-select">
                <option>Multiple Choice Question</option>
                <option>Theory Question</option>
              </select>
            </label>

            <label class="form-label">
              Mark
              <input
                v-model.number="questionForm.mark"
                class="form-input"
                type="number"
                min="1"
              />
            </label>
          </div>

          <label class="form-label">
            Question Text
            <textarea
              v-model.trim="questionForm.text"
              class="form-textarea question-textarea"
              placeholder="Type your question here..."
            ></textarea>
          </label>

          <section
            v-if="questionForm.type === 'Multiple Choice Question'"
            class="options-card"
          >
            <h3>Answer Options & Correct Key</h3>

            <label
              v-for="option in questionForm.options"
              :key="option.key"
              class="option-row"
            >
              <input
                v-model="questionForm.correctOption"
                type="radio"
                :value="option.key"
              />

              <span>{{ option.key }}</span>

              <input
                v-model.trim="option.text"
                class="option-input"
                :placeholder="`Option ${option.key} text...`"
              />
            </label>
          </section>

          <p v-if="questionError" class="form-error">{{ questionError }}</p>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeQuestionModal">
              Cancel
            </button>
            <button type="submit" class="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="importModalOpen" class="modal-backdrop">
      <div class="import-modal">
        <div class="import-header">
          <div>
            <h2>Upload Questions</h2>
            <p>Select ingestion method to load target evaluations</p>
          </div>

          <button type="button" class="close-import" @click="closeImportModal">
            × Close
          </button>
        </div>

        <div class="import-tab">
          Upload Data Template Document (CSV / Excel)
        </div>

        <button
          type="button"
          class="drop-area"
          :class="{ active: importFileName }"
          @click="csvInput?.click()"
          @dragover.prevent
          @drop.prevent="handleCsvDrop"
        >
          <span class="folder-icon">▱</span>
          <strong>{{ importFileName || "Drag file here or click to browse" }}</strong>
          <small>Supported Formats: standard formatted spreadsheet template files (.csv)</small>
        </button>

        <input
          ref="csvInput"
          type="file"
          hidden
          accept=".csv,text/csv"
          @change="handleCsvSelect"
        />

        <div class="template-warning">
          <span>
            Need the uniform platform structure mapping columns format index configuration schema grid map layout?
          </span>

          <button type="button" @click="downloadTemplate">
            Download Template Sheet
          </button>
        </div>

        <div v-if="importPreview.length" class="import-preview">
          <h3>{{ importPreview.length }} validated records found</h3>

          <ul>
            <li v-for="item in importPreview.slice(0, 4)" :key="item.id">
              {{ item.text }}
            </li>
          </ul>
        </div>

        <p v-if="importError" class="form-error">{{ importError }}</p>

        <div class="import-actions">
          <button type="button" class="cancel-btn" @click="closeImportModal">
            Cancel
          </button>

          <button
            type="button"
            class="append-btn"
            :disabled="importPreview.length === 0"
            @click="appendImportedQuestions"
          >
            Append Validated Records to Test Deck
          </button>
        </div>
      </div>
    </div>

    <div v-if="previewModalOpen" class="modal-backdrop">
      <div class="preview-modal">
        <div class="preview-header">
          <div>
            <h2>{{ testForm.title }}</h2>
            <p>{{ selectedCourseCode }} · {{ questions.length }} questions · {{ totalMarks }} marks</p>
          </div>

          <button type="button" class="modal-close" @click="previewModalOpen = false">
            ×
          </button>
        </div>

        <article
          v-for="(question, index) in questions"
          :key="question.id"
          class="preview-question"
        >
          <strong>{{ index + 1 }}. {{ question.text }}</strong>

          <ul v-if="question.type === 'Multiple Choice Question'">
            <li v-for="option in question.options" :key="option.key">
              {{ option.key }}. {{ option.text }}
              <span v-if="option.key === question.correctOption">Correct</span>
            </li>
          </ul>

          <p v-else>Theory response question</p>
        </article>

        <div v-if="questions.length === 0" class="empty-questions">
          No questions available to preview.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const STORAGE_KEY = "uniosun_lms_lecturer_test_builder_v1";

const courses = [
  {
    id: "csc-112",
    code: "CSC 112",
    title: "Introduction to Computer Science",
  },
  {
    id: "csc-321",
    code: "CSC 321",
    title: "Data Structures & Algorithms",
  },
  {
    id: "csc-322",
    code: "CSC 322",
    title: "Database Management Systems",
  },
];

const defaultQuestions = [
  {
    id: "q-1",
    type: "Multiple Choice Question",
    mark: 5,
    text: "What does ACID stand for in DBMS?",
    options: [
      { key: "A", text: "Atomicity, Consistency, Isolation, Durability" },
      { key: "B", text: "Accuracy, Control, Integration, Design" },
      { key: "C", text: "Access, Consistency, Indexing, Data" },
      { key: "D", text: "Atomicity, Control, Integrity, Dependency" },
    ],
    correctOption: "A",
  },
  {
    id: "q-2",
    type: "Multiple Choice Question",
    mark: 5,
    text:
      "Which normal form requires all attributes to be fully functionally dependent on the primary key?",
    options: [
      { key: "A", text: "First Normal Form (1NF)" },
      { key: "B", text: "Third Normal Form (3NF)" },
      { key: "C", text: "Second Normal Form (2NF)" },
      { key: "D", text: "Boyce-Codd Normal Form (BCNF)" },
    ],
    correctOption: "C",
  },
  {
    id: "q-3",
    type: "Theory Question",
    mark: 5,
    text: "Explain the difference between a superkey and a candidate key.",
    options: [
      { key: "A", text: "" },
      { key: "B", text: "" },
      { key: "C", text: "" },
      { key: "D", text: "" },
    ],
    correctOption: "",
  },
];

const csvInput = ref(null);
const questionModalOpen = ref(false);
const importModalOpen = ref(false);
const previewModalOpen = ref(false);
const editingQuestionId = ref("");
const questionError = ref("");
const importError = ref("");
const importFileName = ref("");
const importPreview = ref([]);
const statusMessage = ref("");

const testForm = reactive({
  courseId: "csc-112",
  testType: "Multiple Choice questions",
  title: "CSC 112 Mid-Semester Test — April 2026",
  dueDate: "2026-04-02",
  dueTime: "10:00",
  duration: 90,
  totalQuestions: 20,
  marksPerQuestion: 2,
  instructions: "",
});

const questionForm = reactive({
  type: "Multiple Choice Question",
  mark: 1,
  text: "",
  options: [
    { key: "A", text: "" },
    { key: "B", text: "" },
    { key: "C", text: "" },
    { key: "D", text: "" },
  ],
  correctOption: "A",
});

const questions = ref(loadState());

const selectedCourse = computed(() =>
  courses.find((course) => course.id === testForm.courseId)
);

const selectedCourseCode = computed(() => selectedCourse.value?.code || "CSC 112");

const totalMarks = computed(() =>
  questions.value.reduce((total, question) => total + Number(question.mark || 0), 0)
);

const readableDate = computed(() => {
  if (!testForm.dueDate) return "Not set";

  const date = new Date(`${testForm.dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return testForm.dueDate;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
});

watch(
  questions,
  () => {
    persistState();
  },
  { deep: true }
);

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : clone(defaultQuestions);
  } catch {
    return clone(defaultQuestions);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions.value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function openAddModal() {
  editingQuestionId.value = "";
  resetQuestionForm();
  questionModalOpen.value = true;
}

function openEditModal(question) {
  editingQuestionId.value = question.id;

  Object.assign(questionForm, {
    type: question.type,
    mark: Number(question.mark) || 1,
    text: question.text,
    options: clone(question.options),
    correctOption: question.correctOption || "A",
  });

  questionError.value = "";
  questionModalOpen.value = true;
}

function closeQuestionModal() {
  questionModalOpen.value = false;
  editingQuestionId.value = "";
  resetQuestionForm();
}

function resetQuestionForm() {
  Object.assign(questionForm, {
    type: "Multiple Choice Question",
    mark: 1,
    text: "",
    options: [
      { key: "A", text: "" },
      { key: "B", text: "" },
      { key: "C", text: "" },
      { key: "D", text: "" },
    ],
    correctOption: "A",
  });

  questionError.value = "";
}

function validateQuestion() {
  if (!sanitizeText(questionForm.text)) return "Question text is required.";
  if (!Number(questionForm.mark)) return "Question mark is required.";

  if (questionForm.type === "Multiple Choice Question") {
    const filledOptions = questionForm.options.filter((option) =>
      sanitizeText(option.text)
    );

    if (filledOptions.length < 2) {
      return "At least two answer options are required.";
    }

    const correctOption = questionForm.options.find(
      (option) => option.key === questionForm.correctOption
    );

    if (!correctOption || !sanitizeText(correctOption.text)) {
      return "Select a valid correct answer.";
    }
  }

  return "";
}

function saveQuestion() {
  const error = validateQuestion();

  if (error) {
    questionError.value = error;
    return;
  }

  const payload = {
    id: editingQuestionId.value || `q-${Date.now()}`,
    type: questionForm.type,
    mark: Number(questionForm.mark),
    text: sanitizeText(questionForm.text),
    options:
      questionForm.type === "Multiple Choice Question"
        ? questionForm.options.map((option) => ({
            key: option.key,
            text: sanitizeText(option.text),
          }))
        : [
            { key: "A", text: "" },
            { key: "B", text: "" },
            { key: "C", text: "" },
            { key: "D", text: "" },
          ],
    correctOption:
      questionForm.type === "Multiple Choice Question"
        ? questionForm.correctOption
        : "",
  };

  if (editingQuestionId.value) {
    const index = questions.value.findIndex(
      (question) => question.id === editingQuestionId.value
    );

    if (index !== -1) {
      questions.value.splice(index, 1, payload);
    }
  } else {
    questions.value.push(payload);
  }

  statusMessage.value = editingQuestionId.value
    ? "Question updated successfully."
    : "Question added successfully.";

  closeQuestionModal();
}

function deleteQuestion(questionId) {
  questions.value = questions.value.filter((question) => question.id !== questionId);
  statusMessage.value = "Question deleted successfully.";
}

function openImportModal() {
  importModalOpen.value = true;
  importFileName.value = "";
  importPreview.value = [];
  importError.value = "";
}

function closeImportModal() {
  importModalOpen.value = false;
  importFileName.value = "";
  importPreview.value = [];
  importError.value = "";
}

function handleCsvSelect(event) {
  const file = event.target.files?.[0];
  parseCsvFile(file);
  event.target.value = "";
}

function handleCsvDrop(event) {
  const file = event.dataTransfer.files?.[0];
  parseCsvFile(file);
}

function parseCsvFile(file) {
  if (!file) return;

  const fileName = file.name.toLowerCase();

  if (!fileName.endsWith(".csv")) {
    importError.value = "Only CSV files are supported for now.";
    return;
  }

  importFileName.value = file.name;
  importError.value = "";

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const csvText = String(reader.result || "");
      const parsed = parseCsv(csvText);
      const mapped = mapCsvRowsToQuestions(parsed);

      if (mapped.length === 0) {
        importError.value =
          "No valid questions found. Required columns: question, answer. Optional: option_a, option_b, option_c, option_d, mark, type.";
        importPreview.value = [];
        return;
      }

      importPreview.value = mapped;
      importError.value = "";
    } catch {
      importError.value = "Could not parse this CSV file.";
      importPreview.value = [];
    }
  };

  reader.onerror = () => {
    importError.value = "Could not read this CSV file.";
    importPreview.value = [];
  };

  reader.readAsText(file);
}

function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;

      currentRow.push(currentCell);

      if (currentRow.some((cell) => sanitizeText(cell))) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);

  if (currentRow.some((cell) => sanitizeText(cell))) {
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) =>
    sanitizeText(header).toLowerCase().replace(/\s+/g, "_")
  );

  return rows.slice(1).map((row) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = sanitizeText(row[index]);
    });

    return record;
  });
}

function mapCsvRowsToQuestions(rows) {
  return rows
    .map((row) => {
      const questionText =
        row.question ||
        row.question_text ||
        row.text ||
        row.questiontext ||
        "";

      const answer =
        row.answer ||
        row.correct_answer ||
        row.correct ||
        row.correct_option ||
        "";

      if (!questionText || !answer) return null;

      const optionA = row.option_a || row.a || "";
      const optionB = row.option_b || row.b || "";
      const optionC = row.option_c || row.c || "";
      const optionD = row.option_d || row.d || "";

      const hasOptions = optionA || optionB || optionC || optionD;

      const type =
        row.type?.toLowerCase().includes("theory") || !hasOptions
          ? "Theory Question"
          : "Multiple Choice Question";

      const options = [
        { key: "A", text: optionA },
        { key: "B", text: optionB },
        { key: "C", text: optionC },
        { key: "D", text: optionD },
      ];

      let correctOption = "";

      if (type === "Multiple Choice Question") {
        const normalizedAnswer = answer.toUpperCase();

        if (["A", "B", "C", "D"].includes(normalizedAnswer)) {
          correctOption = normalizedAnswer;
        } else {
          const matched = options.find(
            (option) =>
              option.text.toLowerCase() === answer.toLowerCase()
          );

          correctOption = matched?.key || "A";
        }
      }

      return {
        id: `import-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        mark: Number(row.mark || row.marks || testForm.marksPerQuestion || 1),
        text: questionText,
        options,
        correctOption,
      };
    })
    .filter(Boolean);
}

function appendImportedQuestions() {
  if (importPreview.value.length === 0) return;

  questions.value.push(...clone(importPreview.value));
  statusMessage.value = `${importPreview.value.length} imported questions added successfully.`;
  closeImportModal();
}

function downloadTemplate() {
  const csv = [
    "question,type,mark,option_a,option_b,option_c,option_d,answer",
    '"What does DBMS stand for?","Multiple Choice Question",2,"Database Management System","Data Backup Machine Service","Digital Base Mapping System","Database Manual Setup","A"',
    '"Explain the difference between primary key and foreign key.","Theory Question",5,"","","","","Expected explanation"',
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "uniosun-test-question-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function openPreviewModal() {
  previewModalOpen.value = true;
}

function scheduleTest() {
  if (!testForm.title || questions.value.length === 0) {
    statusMessage.value = "Add a test title and at least one question before scheduling.";
    return;
  }

  statusMessage.value = "Test scheduled successfully.";
}
</script>

<style scoped>
.test-page {
  color: #0f172a;
}

.page-heading {
  margin-bottom: 24px;
}

.page-heading h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 900;
}

.page-heading p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.test-layout {
  display: grid;
  grid-template-columns: minmax(0, 760px) 330px;
  gap: 20px;
  align-items: start;
}

.settings-card,
.questions-card,
.summary-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.settings-card,
.questions-card {
  padding: 24px;
}

.settings-card {
  margin-bottom: 20px;
}

.settings-card h2,
.questions-header h2,
.summary-card h2 {
  margin: 0 0 18px;
  color: #111827;
  font-size: 15px;
  font-weight: 900;
}

.form-two,
.form-three {
  display: grid;
  gap: 16px;
}

.form-two {
  grid-template-columns: repeat(2, 1fr);
}

.form-three {
  grid-template-columns: repeat(3, 1fr);
}

.form-label {
  display: block;
  margin-bottom: 18px;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 5px;
  background: white;
  color: #334155;
  outline: 0;
  font-size: 13px;
}

.form-input,
.form-select {
  height: 34px;
  padding: 0 12px;
}

.form-textarea {
  min-height: 78px;
  padding: 12px;
  resize: vertical;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.questions-header div {
  display: flex;
  gap: 10px;
}

.import-btn,
.add-btn,
.preview-btn,
.schedule-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.import-btn,
.preview-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.add-btn,
.schedule-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.question-row {
  display: grid;
  grid-template-columns: 36px 1fr 54px 34px;
  gap: 16px;
  align-items: center;
  min-height: 72px;
  border-bottom: 1px solid #edf2f7;
}

.question-row:last-of-type {
  border-bottom: 0;
}

.question-number {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #e2e8f0;
  color: #334155;
  font-weight: 900;
}

.question-content strong {
  display: block;
  margin-bottom: 5px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.question-content small {
  color: #64748b;
  font-size: 11px;
}

.edit-btn {
  height: 28px;
  border: 1px solid #0875f5;
  border-radius: 4px;
  background: white;
  color: #0875f5;
  font-weight: 900;
}

.delete-btn {
  width: 30px;
  height: 28px;
  border: 1px solid #ef4444;
  border-radius: 4px;
  background: white;
  color: #ef4444;
  font-size: 18px;
}

.questions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.summary-card {
  padding: 24px 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
  color: #64748b;
  font-size: 13px;
}

.summary-row strong {
  color: #1e3a8a;
}

.empty-questions {
  min-height: 110px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  color: #64748b;
  text-align: center;
}

.empty-questions h3,
.empty-questions p {
  margin: 0;
}

.status-message {
  margin: 14px 0 0;
  color: #16a34a;
  font-size: 13px;
  font-weight: 900;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
}

.question-modal,
.import-modal,
.preview-modal {
  max-height: 92vh;
  overflow: auto;
  background: white;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.question-modal {
  width: min(630px, 100%);
  padding: 32px;
  border-radius: 8px;
}

.question-modal h2,
.import-modal h2,
.preview-modal h2 {
  margin: 0 0 22px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 900;
}

.question-textarea {
  min-height: 86px;
}

.options-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
  background: #f8fafc;
}

.options-card h3 {
  margin: 0 0 16px;
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.option-row {
  display: grid;
  grid-template-columns: 18px 26px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.option-row input[type="radio"] {
  accent-color: #111827;
}

.option-row span {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: white;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
}

.option-row:has(input[type="radio"]:checked) span {
  background: #16a34a;
  color: white;
}

.option-input {
  height: 34px;
  border: 1px solid #cbd8ea;
  border-radius: 4px;
  padding: 0 10px;
  outline: 0;
}

.modal-actions,
.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.cancel-btn,
.save-btn,
.append-btn {
  height: 32px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.cancel-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.save-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.form-error {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 900;
}

.import-modal {
  width: min(860px, 100%);
  border-radius: 8px;
}

.import-header {
  display: flex;
  justify-content: space-between;
  padding: 32px 32px 20px;
}

.import-header h2 {
  margin-bottom: 8px;
}

.import-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.close-import {
  border: 0;
  background: transparent;
  color: #ef4444;
  font-size: 13px;
  font-weight: 900;
}

.import-tab {
  padding: 0 32px 16px;
  border-bottom: 2px solid #16a34a;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.drop-area {
  width: calc(100% - 64px);
  min-height: 150px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  margin: 32px;
  border: 1px dashed #cbd8ea;
  border-radius: 4px;
  background: white;
  color: #334155;
  text-align: center;
}

.drop-area.active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.folder-icon {
  color: #64748b;
  font-size: 34px;
}

.drop-area strong {
  font-size: 13px;
  font-weight: 900;
}

.drop-area small {
  color: #64748b;
  font-size: 12px;
}

.template-warning {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 0 32px 32px;
  padding: 16px;
  border: 1px solid #f59e0b;
  border-radius: 3px;
  background: #fef3c7;
  color: #c47d18;
  font-size: 12px;
}

.template-warning button {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #16a34a;
  border-radius: 3px;
  background: white;
  color: #16a34a;
  font-weight: 900;
  white-space: nowrap;
}

.import-preview {
  margin: 0 32px 24px;
  padding: 14px 16px;
  border: 1px solid #cbd8ea;
  border-radius: 6px;
  background: #f8fafc;
}

.import-preview h3 {
  margin: 0 0 10px;
  color: #334155;
  font-size: 13px;
}

.import-preview ul {
  margin: 0;
  padding-left: 18px;
  color: #64748b;
  font-size: 12px;
}

.import-actions {
  padding: 24px 32px 32px;
  background: #f8fafc;
}

.append-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.append-btn:disabled {
  border-color: #e5f3dc;
  background: #e5f3dc;
  cursor: not-allowed;
}

.preview-modal {
  width: min(760px, 100%);
  padding: 28px;
  border-radius: 8px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.preview-header h2 {
  margin: 0 0 8px;
}

.preview-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: 1px solid #cbd8ea;
  border-radius: 999px;
  background: white;
  color: #334155;
  font-size: 22px;
}

.preview-question {
  padding: 16px 0;
  border-bottom: 1px solid #edf2f7;
}

.preview-question strong {
  color: #334155;
}

.preview-question ul {
  margin: 12px 0 0;
  padding-left: 22px;
  color: #64748b;
}

.preview-question li {
  margin-bottom: 6px;
}

.preview-question span {
  margin-left: 8px;
  color: #16a34a;
  font-size: 11px;
  font-weight: 900;
}

@media (max-width: 1050px) {
  .test-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .form-two,
  .form-three {
    grid-template-columns: 1fr;
  }

  .questions-header,
  .template-warning,
  .import-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .question-row {
    grid-template-columns: 36px 1fr;
  }

  .edit-btn,
  .delete-btn {
    grid-column: 2;
    width: max-content;
  }
}
</style>