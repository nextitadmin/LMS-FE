<template>
  <section v-if="result" class="test-result-page">
    <button type="button" class="back-btn" @click="goBack">
      ←
    </button>

    <section class="result-banner">
      <div>
        <h2>{{ result.courseCode }} — Past Result</h2>
        <h1>{{ result.courseTitle }}</h1>
        <p>Submitted: {{ result.submittedDate }} · Duration: {{ result.duration }} mins</p>
      </div>

      <div class="score-box">
        <strong>{{ result.score }}</strong>
        <span>/{{ result.totalMarks }}</span>
        <em>{{ result.percentage }}% — {{ result.grade }}</em>
      </div>
    </section>

    <div class="result-layout">
      <main class="review-card">
        <p class="question-number">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </p>

        <h2>{{ currentQuestion.question }}</h2>

        <div class="options-list">
          <div
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="option-row"
            :class="resultOptionClass(option.id)"
          >
            <span>{{ option.id }}</span>
            {{ option.text }}
          </div>
        </div>

        <div class="review-actions">
          <button
            type="button"
            class="prev-btn"
            :disabled="currentIndex === 0"
            @click="previousQuestion"
          >
            ← Previous
          </button>

          <button
            type="button"
            class="next-btn"
            :disabled="currentIndex === questions.length - 1"
            @click="nextQuestion"
          >
            Next →
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
            :class="{ current: index === currentIndex }"
            @click="currentIndex = index"
          >
            {{ index + 1 }}
          </button>
        </div>

        <div class="legend-row">
          <span><i></i> Current</span>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="not-found">
    <h1>Result not found</h1>
    <RouterLink to="/student/test">Back to Tests</RouterLink>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { useStudentTestsStore } from "../../stores/studentTests.store";

const route = useRoute();
const router = useRouter();
const testsStore = useStudentTestsStore();

const testId = computed(() => String(route.params.testId || ""));

const result = computed(() => testsStore.getResultByTestId(testId.value));

const questions = computed(() => testsStore.questions);

const currentIndex = ref(8);

const currentQuestion = computed(() => questions.value[currentIndex.value]);

const resultAnswers = computed(() => {
  if (result.value?.answers) return result.value.answers;

  return questions.value.reduce((answers, question) => {
    answers[question.id] = question.resultAnswer || question.correctAnswer;
    return answers;
  }, {});
});

function resultOptionClass(optionId) {
  const answer = resultAnswers.value[currentQuestion.value.id];
  const correct = currentQuestion.value.correctAnswer;

  if (optionId === correct) return "correct";
  if (optionId === answer && optionId !== correct) return "wrong";

  return "";
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value += 1;
  }
}

function goBack() {
  router.push("/student/test");
}
</script>

<style scoped>
.test-result-page {
  color: #0f172a;
}

.back-btn {
  width: 42px;
  height: 28px;
  margin-bottom: 22px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 17px;
  font-weight: 900;
}

.result-banner {
  min-height: 128px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  border-radius: 8px;
  background: #0875f5;
  color: white;
  margin-bottom: 24px;
}

.result-banner h2 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 800;
}

.result-banner h1 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 900;
}

.result-banner p {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.score-box {
  text-align: right;
}

.score-box strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
  font-weight: 900;
}

.score-box span {
  margin-left: 4px;
  font-size: 14px;
}

.score-box em {
  width: max-content;
  height: 22px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: auto;
  padding: 0 10px;
  border-radius: 4px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}

.result-layout {
  display: grid;
  grid-template-columns: minmax(0, 808px) 302px;
  gap: 20px;
}

.review-card,
.navigator-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.review-card {
  padding: 24px;
}

.question-number {
  margin: 0 0 14px;
  color: #16a34a;
  font-size: 13px;
  font-weight: 800;
}

.review-card h2 {
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

.option-row.correct {
  border-color: #22c55e;
  background: #dcfce7;
}

.option-row.correct span {
  border-color: #22c55e;
  background: #dcfce7;
  color: #16a34a;
}

.option-row.wrong {
  border-color: #ef4444;
  background: #fee2e2;
}

.option-row.wrong span {
  border-color: #ef4444;
  background: #fee2e2;
  color: #ef4444;
}

.review-actions {
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

.next-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.prev-btn:disabled,
.next-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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
  border: 1px solid #22c55e;
  border-radius: 7px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 14px;
  font-weight: 800;
}

.navigator-grid button.current {
  border-color: #0875f5;
  background: #0875f5;
  color: white;
}

.legend-row {
  margin-top: 16px;
}

.legend-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-size: 10px;
}

.legend-row i {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #0875f5;
}

.not-found {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
}

@media (max-width: 980px) {
  .result-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .score-box {
    text-align: left;
  }

  .score-box em {
    margin-left: 0;
  }

  .result-layout {
    grid-template-columns: 1fr;
  }
}
</style>