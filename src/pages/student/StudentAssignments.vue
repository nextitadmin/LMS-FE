<template>
  <section class="student-assignments-page">
    <div class="assignments-layout">
      <main class="assignments-list">
        <article
          v-for="assignment in assignments"
          :key="assignment.id"
          class="assignment-row"
        >
          <div class="assignment-icon">
            <ClipboardList :size="22" />
          </div>

          <div class="assignment-info">
            <h3>{{ assignment.title }}</h3>
            <p>
              Due: {{ assignment.due }}
              <span>·</span>
              {{ assignment.maxScore }} points
            </p>
          </div>

          <span class="status-pill" :class="statusClass(assignment)">
            {{ assignment.status }}
          </span>

          <button
            type="button"
            class="view-btn"
            @click="openAssignment(assignment)"
          >
            View
          </button>
        </article>

        <div v-if="assignments.length === 0" class="empty-card">
          <h2>No assignments yet</h2>
          <p>Your lecturer has not posted any assignments for this course.</p>
        </div>
      </main>

      <aside class="previous-card">
        <h2>Previous Submission</h2>

        <article
          v-for="submission in previousSubmissions"
          :key="submission.id"
          class="previous-row"
        >
          <div class="previous-icon">
            <FileCheck2 :size="18" />
          </div>

          <div>
            <strong>{{ submission.title }}</strong>
            <span>{{ submission.subtitle }}</span>
          </div>
        </article>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ClipboardList, FileCheck2 } from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();

const courseId = computed(() => String(route.params.courseId || ""));

const assignments = computed(() =>
  studentStore.getAssignmentsByCourse(courseId.value)
);

const previousSubmissions = computed(() =>
  studentStore.previousSubmissions.filter(
    (item) => item.courseId === courseId.value
  )
);

function openAssignment(assignment) {
  router.push(
    `/student/my-courses/${courseId.value}/assignments/${assignment.id}`
  );
}

function statusClass(assignment) {
  if (assignment.status === "Graded") return "graded";
  if (assignment.status === "Submitted") return "submitted";
  return "due";
}
</script>

<style scoped>
.assignments-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.assignments-list,
.previous-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #ffffff;
}

.assignments-list {
  min-height: 410px;
  overflow: hidden;
}

.assignment-row {
  min-height: 86px;
  display: grid;
  grid-template-columns: 52px 1fr 110px 78px;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid #edf2f7;
}

.assignment-row:last-child {
  border-bottom: 0;
}

.assignment-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #dbeafe;
  color: #0875f5;
}

.assignment-info h3 {
  margin: 0 0 5px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.assignment-info p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.assignment-info span {
  margin: 0 8px;
}

.status-pill {
  width: max-content;
  min-width: 82px;
  height: 27px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 900;
}

.status-pill.graded {
  color: #16a34a;
  background: #dcfce7;
}

.status-pill.submitted {
  color: #0875f5;
  background: #dbeafe;
}

.status-pill.due {
  color: #ef4444;
  background: #fee2e2;
}

.view-btn {
  height: 30px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 12px;
  font-weight: 900;
}

.previous-card {
  padding: 20px;
}

.previous-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.previous-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 58px;
  border-bottom: 1px solid #edf2f7;
}

.previous-row:last-child {
  border-bottom: 0;
}

.previous-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: #dcfce7;
  color: #16a34a;
}

.previous-row strong {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.previous-row span {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-size: 10px;
}

.empty-card {
  min-height: 330px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  padding: 30px;
  text-align: center;
}

.empty-card h2 {
  margin: 0;
  color: #334155;
}

.empty-card p {
  margin: 0;
  color: #64748b;
}

@media (max-width: 1120px) {
  .assignments-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .assignment-row {
    grid-template-columns: 52px 1fr;
  }

  .status-pill,
  .view-btn {
    grid-column: 2;
  }
}
</style>