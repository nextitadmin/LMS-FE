<template>
  <section class="tests-page">
    <div class="page-heading">
      <h1>Tests</h1>
      <p>Manage your upcoming assessments and view past results</p>
    </div>

    <div class="tabs">
      <button
        type="button"
        :class="{ active: activeTab === 'active' }"
        @click="activeTab = 'active'"
      >
        Active & Upcoming
      </button>

      <button
        type="button"
        :class="{ active: activeTab === 'past' }"
        @click="activeTab = 'past'"
      >
        Past Results
      </button>
    </div>

    <template v-if="activeTab === 'active'">
      <section class="tests-card">
        <h2>Active</h2>

        <article
          v-for="test in testsStore.activeTests"
          :key="test.id"
          class="test-row"
        >
          <div>
            <h3>{{ test.title }}</h3>
            <p>{{ test.courseCode }} — {{ test.courseTitle }}</p>

            <div class="meta-row">
              <span><CalendarDays :size="16" /> {{ test.date }}</span>
              <span><Clock3 :size="16" /> {{ test.duration }} mins</span>
              <span><Target :size="16" /> {{ test.totalMarks }} marks</span>
            </div>
          </div>

          <div class="test-actions">
            <span class="available-pill">{{ test.status }}</span>

            <button type="button" class="take-btn" @click="takeTest(test.id)">
              Take Test
              <ArrowRight :size="16" />
            </button>
          </div>
        </article>

        <div v-if="testsStore.activeTests.length === 0" class="empty-state">
          No active tests available.
        </div>
      </section>

      <section class="tests-card">
        <h2>Upcoming</h2>

        <article
          v-for="test in testsStore.upcomingTests"
          :key="test.id"
          class="test-row"
        >
          <div>
            <h3>{{ test.title }}</h3>
            <p>{{ test.courseCode }} — {{ test.courseTitle }}</p>

            <div class="meta-row">
              <span><CalendarDays :size="16" /> {{ test.date }}</span>
              <span><Clock3 :size="16" /> {{ test.duration }} mins</span>
              <span><Target :size="16" /> {{ test.totalMarks }} marks</span>
            </div>
          </div>

          <div class="test-actions">
            <span class="starts-pill">{{ test.status }}</span>

            <button type="button" class="disabled-btn" disabled>
              Not Available
            </button>
          </div>
        </article>
      </section>
    </template>

    <section v-else class="tests-card">
      <h2>Past Test</h2>

      <article
        v-for="result in testsStore.pastResults"
        :key="result.id"
        class="past-row"
      >
        <div>
          <h3>{{ result.title }}</h3>
          <p>{{ result.courseCode }} — {{ result.courseTitle }}</p>

          <div class="meta-row">
            <span><CalendarDays :size="16" /> {{ result.submittedDate }}</span>
            <span><Clock3 :size="16" /> {{ result.duration }} mins</span>
          </div>

          <div class="tag-row">
            <span
              class="status-tag"
              :class="{ pending: result.status === 'Pending Review' }"
            >
              {{ result.status }}
            </span>

            <span class="type-tag">{{ result.testType }}</span>
          </div>
        </div>

        <div class="result-actions">
          <strong v-if="result.score !== ''">
            {{ result.score }}
            <small>/{{ result.totalMarks }}</small>
          </strong>

          <strong v-else class="empty-score">
            —
            <small>/{{ result.totalMarks }}</small>
          </strong>

          <span v-if="result.percentage !== ''" class="grade-pill">
            {{ result.percentage }}% — {{ result.grade }}
          </span>

          <button
            v-if="result.score !== ''"
            type="button"
            class="view-script"
            @click="viewResult(result.testId)"
          >
            View Script
          </button>

          <button v-else type="button" class="awaiting-btn" disabled>
            Awaiting Grade
          </button>
        </div>
      </article>

      <div v-if="testsStore.pastResults.length === 0" class="empty-state">
        No past results yet.
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Target,
} from "lucide-vue-next";

import { useStudentTestsStore } from "../../stores/studentTests.store";

const router = useRouter();
const testsStore = useStudentTestsStore();

const activeTab = ref("active");

function takeTest(testId) {
  router.push(`/student/test/${testId}/take`);
}

function viewResult(testId) {
  router.push(`/student/test/${testId}/result`);
}
</script>

<style scoped>
.tests-page {
  color: #0f172a;
}

.page-heading {
  margin-bottom: 24px;
}

.page-heading h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 900;
}

.page-heading p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.tabs button {
  min-width: 126px;
  height: 34px;
  border: 1px solid #0875f5;
  border-radius: 999px;
  background: white;
  color: #0875f5;
  font-size: 13px;
  font-weight: 900;
}

.tabs button.active {
  background: #0875f5;
  color: white;
}

.tests-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
  padding: 26px 24px;
  margin-bottom: 20px;
}

.tests-card h2 {
  margin: 0 0 26px;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.test-row,
.past-row {
  min-height: 112px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 0 0 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid #dbe4f0;
}

.test-row:last-of-type,
.past-row:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.test-row h3,
.past-row h3 {
  margin: 0 0 5px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.test-row p,
.past-row p {
  margin: 0 0 14px;
  color: #64748b;
  font-size: 12px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.test-actions,
.result-actions {
  min-width: 130px;
  display: grid;
  justify-items: end;
  align-content: center;
  gap: 8px;
}

.available-pill,
.starts-pill,
.grade-pill,
.status-tag,
.type-tag {
  height: 24px;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 800;
}

.available-pill,
.grade-pill,
.status-tag {
  border: 1px solid #22c55e;
  background: #dcfce7;
  color: #16a34a;
}

.starts-pill,
.status-tag.pending {
  border: 1px solid #f59e0b;
  background: #fef3c7;
  color: #d97706;
}

.type-tag {
  border: 1px solid #64748b;
  background: white;
  color: #334155;
}

.take-btn,
.disabled-btn,
.view-script,
.awaiting-btn {
  height: 32px;
  min-width: 106px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.take-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.disabled-btn {
  border: 1px solid #cbd8ea;
  background: #f8fafc;
  color: #94a3b8;
}

.view-script,
.awaiting-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.result-actions strong {
  color: #0875f5;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 900;
}

.result-actions strong small {
  color: #64748b;
  font-family: inherit;
  font-size: 14px;
}

.empty-score {
  color: #64748b !important;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-state {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 760px) {
  .test-row,
  .past-row {
    flex-direction: column;
  }

  .test-actions,
  .result-actions {
    justify-items: start;
  }
}
</style>