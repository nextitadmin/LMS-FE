<template>
  <div v-if="course" class="student-course-workspace">
    <div class="course-header">
      <div class="course-avatar"></div>

      <div class="course-meta">
        <h2>{{ course.title }}</h2>
        <span>{{ course.code }}</span>
      </div>

      <nav class="course-tabs">
        <RouterLink :to="materialsRoute" class="course-tab" active-class="active">
          Materials
        </RouterLink>

        <RouterLink :to="videosRoute" class="course-tab" active-class="active">
          Videos
        </RouterLink>

        <RouterLink :to="assignmentsRoute" class="course-tab" active-class="active">
          Assignments
          <span v-if="course.assignmentsCount" class="tab-count danger">
            {{ course.assignmentsCount }}
          </span>
        </RouterLink>

        <RouterLink :to="discussionRoute" class="course-tab" active-class="active">
          Discussion
          <span v-if="course.discussionsCount" class="tab-count success">
            {{ course.discussionsCount }}
          </span>
        </RouterLink>

        <RouterLink :to="gradesRoute" class="course-tab" active-class="active">
          Grades
        </RouterLink>
      </nav>
    </div>

    <router-view />
  </div>

  <section v-else class="course-not-found">
    <h1>Course not found</h1>
    <p>The course you are trying to open is not available.</p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const studentStore = useStudentStore();

const courseId = computed(() => String(route.params.courseId || ""));

const course = computed(() => studentStore.getCourseById(courseId.value));

const materialsRoute = computed(
  () => `/student/my-courses/${courseId.value}/materials`
);

const videosRoute = computed(
  () => `/student/my-courses/${courseId.value}/videos`
);

const assignmentsRoute = computed(
  () => `/student/my-courses/${courseId.value}/assignments`
);

const discussionRoute = computed(
  () => `/student/my-courses/${courseId.value}/discussion`
);

const gradesRoute = computed(
  () => `/student/my-courses/${courseId.value}/grades`
);
</script>

<style scoped>
.student-course-workspace {
  width: 100%;
}

.course-header {
  height: 54px;
  display: flex;
  align-items: stretch;
  gap: 16px;
  margin: calc(var(--page-padding-y) * -1) calc(var(--page-padding-x) * -1) 32px;
  padding: 0 var(--page-padding-x);
  border-bottom: 1px solid #edf2f7;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.course-avatar {
  width: 31px;
  height: 31px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: #dbeafe;
}

.course-meta {
  width: 330px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.course-meta h2 {
  margin: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 900;
}

.course-meta span {
  color: #334155;
  font-size: 12px;
  font-weight: 700;
}

.course-tabs {
  display: flex;
  align-items: stretch;
  gap: 34px;
  overflow-x: auto;
}

.course-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.course-tab.active {
  color: #0875f5;
}

.course-tab.active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #0875f5;
}

.tab-count {
  min-width: 14px;
  height: 14px;
  display: inline-grid;
  place-items: center;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 9px;
}

.tab-count.danger {
  color: #ef4444;
  background: #fee2e2;
}

.tab-count.success {
  color: #16a34a;
  background: #dcfce7;
}

.course-not-found {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  color: #64748b;
}

.course-not-found h1 {
  margin: 0;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
}

.course-not-found p {
  margin: 0;
}

@media (max-width: 900px) {
  .course-header {
    height: auto;
    flex-wrap: wrap;
    padding-top: 12px;
  }

  .course-meta {
    width: auto;
  }

  .course-tabs {
    width: 100%;
    padding-bottom: 8px;
  }
}
</style>