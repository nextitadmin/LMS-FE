<template>
  <section v-if="test" class="take-test-page">
    <section class="test-banner">
      <div>
        <h2>{{ test.courseCode }} — Mid-Semester Test</h2>
        <h1>{{ test.courseTitle }}</h1>
      </div>

      <div class="timer-box">
        <span>Time Remaining</span>
        <strong>{{ formattedTime }}</strong>
      </div>

      <div class="question-count">
        <strong>{{ questions.length }} Questions</strong>
        <span>Answered: {{ answeredCount }} / {{ questions.length }}</span>
      </div>
    </section>

    <div class="test-layout">
      <main class="question-card">
        <p class="question-number">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </p>

        <h2>{{ currentQuestion.question }}</h2>

        <div class="options-list">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            type="button"
            class="option-row"
            :class="{ selected: selectedAnswer === option.id }"
            @click="selectAnswer(option.id)"
          >
            <span>{{ option.id }}</span>
            {{ option.text }}
          </button>
        </div>

        <div class="question-actions">
          <button
            type="button"
            class="prev-btn"
            :disabled="currentIndex === 0"
            @click="previousQuestion"
          >
            ← Previous
          </button>

          <button type="button" class="next-btn" @click="nextQuestion">
            {{ currentIndex === questions.length - 1 ? "Finish" : "Next Question" }}
            →
          </button>
        </div>
      </main>

      <aside class="navigator-card">
        <h2>Question Navigator</h2>

        <div class="navigator-grid">
          <button
            v-for="(question, index) in questions"
            :key="question.id"
            type="button"
            :class="navigatorClass(question, index)"
            @click="currentIndex = index"
          >
            {{ index + 1 }}
          </button>
        </div>

        <div class="legend-row">
          <span><i class="answered"></i> Answered</span>
          <span><i class="current"></i> Current</span>
          <span><i class="unanswered"></i> Unanswered</span>
        </div>

        <button type="button" class="submit-test-btn" @click="submitTest">
          Submit Test
        </button>
      </aside>
    </div>

    <div v-if="confirmOpen" class="modal-backdrop">
      <section class="confirm-modal">
        <h2>Submit Test?</h2>
        <p>
          You have answered {{ answeredCount }} of {{ questions.length }} questions.
          Once submitted, you cannot edit your answers.
        </p>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="confirmOpen = false">
            Cancel
          </button>

          <button type="button" class="submit-btn" @click="confirmSubmit">
            Submit Now
          </button>
        </div>
      </section>
    </div>
  </section>

  <section v-else class="not-found">
    <h1>Test not found</h1>
    <RouterLink to="/student/test">Back to Tests</RouterLink>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { useStudentTestsStore } from "../../stores/studentTests.store";

const route = useRoute();
const router = useRouter();
const testsStore = useStudentTestsStore();

const testId = computed(() => String(route.params.testId || ""));
const test = computed(() => testsStore.getActiveTestById(testId.value));
const questions = computed(() => testsStore.questions);

const currentIndex = ref(7);
const remainingSeconds = ref(8);
const confirmOpen = ref(false);
let timer = null;

const currentQuestion = computed(() => questions.value[currentIndex.value]);

const answers = computed(() => testsStore.getAnswersByTest(testId.value));

const answeredCount = computed(() => testsStore.answeredCount(testId.value));

const selectedAnswer = computed(() => {
  return answers.value[currentQuestion.value?.id] || "";
});

const formattedTime = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600);
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60);
  const seconds = remainingSeconds.value % 60;

  return [hours, minutes, seconds]
    .map((item) => String(item).padStart(2, "0"))
    .join(":");
});

onMounted(() => {
  seedDemoAnswers();

  timer = window.setInterval(() => {
    if (remainingSeconds.value <= 0) {
      clearInterval(timer);
      confirmSubmit();
      return;
    }

    remainingSeconds.value -= 1;
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function seedDemoAnswers() {
  const demoAnswers = {
    q1: "B",
    q2: "C",
    q3: "A",
    q4: "C",
    q5: "B",
    q6: "A",
    q7: "B",
  };

  Object.entries(demoAnswers).forEach(([questionId, optionId]) => {
    if (!answers.value[questionId]) {
      testsStore.answerQuestion(testId.value, questionId, optionId);
    }
  });
}

function selectAnswer(optionId) {
  testsStore.answerQuestion(testId.value, currentQuestion.value.id, optionId);
}

function nextQuestion() {
  if (currentIndex.value === questions.value.length - 1) {
    confirmOpen.value = true;
    return;
  }

  currentIndex.value += 1;
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
}

function navigatorClass(question, index) {
  return {
    answered: Boolean(answers.value[question.id]),
    current: index === currentIndex.value,
    unanswered: !answers.value[question.id] && index !== currentIndex.value,
  };
}

function submitTest() {
  confirmOpen.value = true;
}

function confirmSubmit() {
  const result = testsStore.submitTest(testId.value);

  if (result.success) {
    router.push(`/student/test/${testId.value}/result`);
  }
}
</script>

<style scoped>
.take-test-page {
  color: #0f172a;
}

.test-banner {
  min-height: 118px;
  display: grid;
  grid-template-columns: 1fr 260px 180px;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  border-radius: 8px;
  background: #0875f5;
  color: white;
  margin-bottom: 32px;
}

.test-banner h2 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 800;
}

.test-banner h1 {
  margin: 0;
  font-size: 21px;
  font-weight: 900;
}

.timer-box {
  text-align: center;
}

.timer-box span,
.question-count span {
  display: block;
  font-size: 14px;
  font-weight: 800;
}

.timer-box strong {
  display: block;
  margin-top: 10px;
  font-size: 34px;
  font-weight: 900;
}

.question-count {
  text-align: right;
}

.question-count strong {
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
}

.test-layout {
  display: grid;
  grid-template-columns: minmax(0, 808px) 302px;
  gap: 20px;
}

.question-card,
.navigator-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.question-card {
  padding: 24px;
}

.question-number {
  margin: 0 0 14px;
  color: #16a34a;
  font-size: 13px;
  font-weight: 800;
}

.question-card h2 {
  margin: 0 0 24px;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 700;
}

.options-list {
  display: grid;
  gap: 14px;
}

.option-row {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  background: white;
  padding: 0 16px;
  color: #0f172a;
  font-size: 14px;
  text-align: left;
}

.option-row span {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border: 1px solid #dbe4f0;
  border-radius: 999px;
  color: #16a34a;
  background: white;
  font-size: 13px;
}

.option-row.selected {
  border-color: #22c55e;
  background: #dcfce7;
}

.option-row.selected span {
  border-color: #16a34a;
  background: #16a34a;
  color: white;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.prev-btn,
.next-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.prev-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.prev-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.next-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.navigator-card {
  padding: 22px 20px;
}

.navigator-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 15px;
  font-weight: 900;
}

.navigator-grid {
  display: grid;
  grid-template-columns: repeat(6, 37px);
  gap: 10px;
}

.navigator-grid button {
  width: 37px;
  height: 37px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 800;
}

.navigator-grid button.answered {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.navigator-grid button.current {
  border: 1px solid #0875f5;
  background: #0875f5;
  color: white;
}

.navigator-grid button.unanswered {
  border: 1px solid #22c55e;
  background: #dcfce7;
  color: #16a34a;
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0;
}

.legend-row span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #334155;
  font-size: 10px;
}

.legend-row i {
  width: 10px;
  height: 10px;
  display: inline-block;
}

.legend-row i.answered {
  background: #16a34a;
}

.legend-row i.current {
  background: #1e3a8a;
}

.legend-row i.unanswered {
  background: #dcfce7;
}

.submit-test-btn {
  width: 100%;
  height: 36px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: #fee2e2;
  color: #ef4444;
  font-size: 13px;
  font-weight: 900;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.4);
}

.confirm-modal {
  width: min(430px, 100%);
  padding: 28px;
  border-radius: 12px;
  background: white;
}

.confirm-modal h2 {
  margin: 0 0 10px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
}

.confirm-modal p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 4px;
  font-weight: 900;
}

.cancel-btn {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.submit-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.not-found {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
}

@media (max-width: 980px) {
  .test-banner,
  .test-layout {
    grid-template-columns: 1fr;
  }

  .question-count {
    text-align: left;
  }
}
</style>