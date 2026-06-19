<template>
  <section class="student-grades-page">
    <div class="grades-layout">
      <main>
        <section class="summary-card">
          <div class="summary-item">
            <span>Current Average</span>
            <strong>{{ currentAverage }}%</strong>
          </div>

          <div class="summary-item">
            <span>Assignments Graded</span>
            <strong>{{ gradedAssignments }}</strong>
          </div>

          <div class="summary-item">
            <span>Highest Score</span>
            <strong>{{ highestScore }}%</strong>
          </div>

          <div class="summary-item">
            <span>Pending</span>
            <strong>{{ pendingAssignments }}</strong>
          </div>
        </section>

        <section class="grades-card">
          <div class="card-header">
            <h2>Grade Book</h2>

            <select v-model="filterStatus" class="filter-select">
              <option value="all">All</option>
              <option value="graded">Graded</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <table class="grades-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Type</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in filteredGrades"
                :key="item.id"
              >
                <td>{{ item.title }}</td>

                <td>{{ item.type }}</td>

                <td>
                  <template v-if="item.status === 'Graded'">
                    {{ item.score }}/{{ item.maxScore }}
                  </template>

                  <template v-else>
                    -
                  </template>
                </td>

                <td>
                  <template v-if="item.status === 'Graded'">
                    {{ calculatePercentage(item) }}%
                  </template>

                  <template v-else>
                    -
                  </template>
                </td>

                <td>
                  <span
                    class="status-pill"
                    :class="item.status.toLowerCase()"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredGrades.length === 0">
                <td colspan="5">
                  <div class="empty-row">
                    No grade records found
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <aside class="analytics-column">
        <section class="analytics-card">
          <h2>Performance Trend</h2>

          <div class="chart-area">
            <div
              v-for="item in chartData"
              :key="item.id"
              class="bar-wrapper"
            >
              <div
                class="bar"
                :style="{ height: `${item.percent}%` }"
              ></div>

              <span>{{ item.shortTitle }}</span>
            </div>
          </div>
        </section>

        <section class="analytics-card">
          <h2>Recent Feedback</h2>

          <article
            v-for="feedback in recentFeedback"
            :key="feedback.id"
            class="feedback-card"
          >
            <strong>{{ feedback.title }}</strong>

            <p>{{ feedback.feedback }}</p>

            <span>
              {{ feedback.score }}/{{ feedback.maxScore }}
            </span>
          </article>

          <div
            v-if="recentFeedback.length === 0"
            class="feedback-empty"
          >
            No feedback available yet.
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const studentStore = useStudentStore();

const filterStatus = ref("all");

const courseId = computed(() => String(route.params.courseId || ""));

const grades = computed(() =>
  studentStore.getGradesByCourse(courseId.value)
);

const filteredGrades = computed(() => {
  if (filterStatus.value === "all") {
    return grades.value;
  }

  if (filterStatus.value === "graded") {
    return grades.value.filter(
      (item) => item.status === "Graded"
    );
  }

  return grades.value.filter(
    (item) => item.status !== "Graded"
  );
});

const gradedRecords = computed(() =>
  grades.value.filter((item) => item.status === "Graded")
);

const gradedAssignments = computed(() => gradedRecords.value.length);

const pendingAssignments = computed(() =>
  grades.value.filter((item) => item.status !== "Graded").length
);

const currentAverage = computed(() => {
  if (!gradedRecords.value.length) return 0;

  const total = gradedRecords.value.reduce((sum, item) => {
    return sum + calculatePercentage(item);
  }, 0);

  return Math.round(total / gradedRecords.value.length);
});

const highestScore = computed(() => {
  if (!gradedRecords.value.length) return 0;

  return Math.max(
    ...gradedRecords.value.map((item) =>
      calculatePercentage(item)
    )
  );
});

const chartData = computed(() =>
  gradedRecords.value.slice(0, 8).map((item) => ({
    ...item,
    percent: calculatePercentage(item),
    shortTitle: item.title.slice(0, 5),
  }))
);

const recentFeedback = computed(() =>
  gradedRecords.value
    .filter((item) => item.feedback)
    .slice(0, 4)
);

function calculatePercentage(item) {
  if (!item.maxScore) return 0;

  return Math.round(
    (Number(item.score) / Number(item.maxScore)) * 100
  );
}
</script>

<style scoped>
.student-grades-page {
  color: #0f172a;
}

.grades-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.summary-card,
.grades-card,
.analytics-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.summary-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  padding: 20px;
  margin-bottom: 20px;
}

.summary-item {
  display: grid;
  gap: 8px;
}

.summary-item span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.summary-item strong {
  color: #111827;
  font-size: 28px;
  font-weight: 900;
}

.grades-card {
  overflow: hidden;
}

.card-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #edf2f7;
}

.card-header h2,
.analytics-card h2 {
  margin: 0;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.filter-select {
  width: 130px;
  height: 34px;
  border: 1px solid #cbd8ea;
  border-radius: 6px;
  padding: 0 10px;
  background: white;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
}

.grades-table th {
  height: 52px;
  padding: 0 24px;
  border-bottom: 1px solid #edf2f7;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-align: left;
}

.grades-table td {
  height: 62px;
  padding: 0 24px;
  border-bottom: 1px solid #edf2f7;
  color: #334155;
  font-size: 13px;
}

.status-pill {
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}

.status-pill.graded {
  color: #16a34a;
  background: #dcfce7;
}

.status-pill.pending {
  color: #ef4444;
  background: #fee2e2;
}

.analytics-column {
  display: grid;
  gap: 20px;
}

.analytics-card {
  padding: 20px;
}

.chart-area {
  height: 220px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 100%;
  min-height: 10px;
  border-radius: 6px 6px 0 0;
  background: #16a34a;
}

.bar-wrapper span {
  margin-top: 8px;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.feedback-card {
  padding: 14px;
  margin-top: 14px;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  background: #f8fafc;
}

.feedback-card strong {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.feedback-card p {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.feedback-card span {
  color: #16a34a;
  font-size: 11px;
  font-weight: 900;
}

.feedback-empty,
.empty-row {
  padding: 24px;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 1120px) {
  .grades-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .summary-card {
    grid-template-columns: repeat(2, 1fr);
  }

  .grades-table {
    display: block;
    overflow-x: auto;
  }
}
</style>