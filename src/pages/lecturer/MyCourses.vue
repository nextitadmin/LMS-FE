<template>
  <section class="my-courses-page">
    <div class="page-header courses-header">
      <div>
        <h1 class="page-title">Courses Management</h1>
        <p class="page-subtitle">
          {{ assignedCourses.length }} courses · 2024/2025 Session Semester 2 · Click any course to enter
        </p>
      </div>

      <button type="button" class="assign-btn" @click="openAssignModal">
        Register Course
      </button>
    </div>

    <div v-if="assignedCourses.length" class="courses-grid">
      <article
        v-for="course in assignedCourses"
        :key="course.id"
        tabindex="0"
        role="button"
        class="course-card"
        :class="course.theme"
        @click="openCourse(course)"
        @keydown.enter.prevent="openCourse(course)"
        @keydown.space.prevent="openCourse(course)"
      >
        <div class="course-icon"></div>

        <h2>{{ course.title }}</h2>
        <p>{{ course.code }} · {{ course.units }} Units</p>
        <strong>Students: {{ course.students }}</strong>

        <div class="course-tags">
          <span class="grade-tag">{{ coursePendingCount(course.id) }} to grade</span>
          <span class="post-tag">{{ courseDiscussionCount(course.id) }} new posts</span>
        </div>

        <button
          type="button"
          class="remove-btn"
          @click.stop="removeCourse(course.id)"
        >
          Remove
        </button>
      </article>
    </div>

    <div v-else class="empty-state">
      <h2>No registered courses yet</h2>
      <p>Register courses assigned to you for this semester.</p>
      <button type="button" class="assign-btn" @click="openAssignModal">
        Register Course
      </button>
    </div>

    <AppModal v-model="isAssignModalOpen">
      <div class="assign-modal">
        <h2>Register Course</h2>
        <p>Select a course assigned to this lecturer.</p>

        <form @submit.prevent="handleAssignCourse">
          <label class="form-label">
            Course
            <select v-model="selectedCourseId" class="form-select">
              <option value="">Select course</option>
              <option
                v-for="course in unassignedCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.code }} - {{ course.title }}
              </option>
            </select>
          </label>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button type="button" class="outline-btn" @click="closeAssignModal">
              Cancel
            </button>

            <button type="submit" class="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import AppModal from "../../components/common/AppModal.vue";
import { useLecturerCoursesStore } from "../../stores/lecturerCourses.store";
import { useLecturerWorkspaceStore } from "../../stores/lecturerWorkspace.store";

const router = useRouter();
const lecturerCoursesStore = useLecturerCoursesStore();
const workspaceStore = useLecturerWorkspaceStore();

const isAssignModalOpen = ref(false);
const selectedCourseId = ref("");
const formError = ref("");

const assignedCourses = computed(() => lecturerCoursesStore.lecturerCourses);
const unassignedCourses = computed(() => lecturerCoursesStore.getUnassignedCourses());

function coursePendingCount(courseId) {
  return workspaceStore
    .getGradeBookByCourse(courseId)
    .filter((item) => item.status === "pending").length;
}

function courseDiscussionCount(courseId) {
  return workspaceStore.getDiscussionsByCourse(courseId).length;
}

function openCourse(course) {
  router.push(`/lecturer/courses/${course.id}/materials`);
}

function openAssignModal() {
  selectedCourseId.value = "";
  formError.value = "";
  isAssignModalOpen.value = true;
}

function closeAssignModal() {
  selectedCourseId.value = "";
  formError.value = "";
  isAssignModalOpen.value = false;
}

function handleAssignCourse() {
  const result = lecturerCoursesStore.assignCourse(selectedCourseId.value);

  if (!result.success) {
    formError.value = result.message;
    return;
  }

  closeAssignModal();
}

function removeCourse(courseId) {
  lecturerCoursesStore.removeCourse(courseId);
}
</script>

<style scoped>
.my-courses-page {
  width: 100%;
}

.courses-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.assign-btn {
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  transition: 0.2s ease;
}

.assign-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(290px, 366px));
  gap: 18px;
  align-items: stretch;
}

.course-card {
  position: relative;
  min-height: 230px;
  border: 1px solid #d5deeb;
  border-top-width: 5px;
  border-radius: 16px;
  background: #ffffff;
  padding: 20px 24px;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.course-card:focus-visible {
  outline: 3px solid rgba(8, 117, 245, 0.25);
  outline-offset: 2px;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
}

.course-card.purple {
  border-color: #a78bfa;
  border-top-color: #8b5cf6;
}

.course-card.orange {
  border-color: #f59e0b;
  border-top-color: #f59e0b;
}

.course-card.blue {
  border-color: #60a5fa;
  border-top-color: #0875f5;
}

.course-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 18px;
  border-radius: 8px;
  background: #d4d4d8;
}

.course-card h2 {
  margin: 0 0 8px;
  color: #26344d;
  font-size: 15px;
  font-weight: 900;
}

.course-card p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}

.course-card strong {
  display: block;
  margin-bottom: 16px;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-tags span {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
}

.grade-tag {
  border: 1px solid #fca5a5;
  background: #fff1f2;
  color: #dc2626;
}

.post-tag {
  border: 1px solid #f59e0b;
  background: #fff7ed;
  color: #b45309;
}

.remove-btn {
  position: absolute;
  right: 18px;
  bottom: 18px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid #ef4444;
  border-radius: 4px;
  background: #ffffff;
  color: #ef4444;
  font-size: 12px;
  font-weight: 800;
}

.empty-state {
  display: grid;
  place-items: center;
  min-height: 260px;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
}

.empty-state h2 {
  margin: 0;
  color: #26344d;
}

.empty-state p {
  margin: 8px 0 18px;
  color: #64748b;
}

.assign-modal h2 {
  margin: 0 0 8px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 900;
}

.assign-modal p {
  margin: 0 0 22px;
  color: #64748b;
  font-weight: 600;
}

.form-error {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 800;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.outline-btn,
.submit-btn {
  height: 38px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 900;
}

.outline-btn {
  border: 1px solid #16a34a;
  background: #ffffff;
  color: #16a34a;
}

.submit-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: #ffffff;
}

@media (max-width: 900px) {
  .courses-header {
    flex-direction: column;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>