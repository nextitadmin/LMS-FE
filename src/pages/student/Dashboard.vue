<template>
  <section class="student-dashboard">
    <transition name="notification-fade">
      <aside
        v-if="showNotificationPopup"
        class="notification-popup"
        @mouseenter="pauseNotificationTimer"
        @mouseleave="resumeNotificationTimer"
      >
        <div class="notification-popup-header">
          <h2>Notifications</h2>
          <button type="button" @click="markAllRead">Mark all read</button>
        </div>

        <article
          v-for="notification in popupNotifications"
          :key="notification.id"
          class="popup-notification-row"
          :class="{ unread: notification.unread }"
          @click="openNotifications"
        >
          <div class="popup-icon" :class="notification.type">
            <FileText v-if="notification.type === 'assignment' || notification.type === 'material'" :size="17" />
            <BarChart3 v-else-if="notification.type === 'grade'" :size="17" />
            <Megaphone v-else-if="notification.type === 'discussion'" :size="17" />
            <ClipboardCheck v-else :size="17" />
          </div>

          <div>
            <strong>{{ notification.shortTitle }}</strong>
            <p>{{ notification.popupMeta }}</p>
          </div>
        </article>

        <button type="button" class="view-all-btn" @click="openNotifications">
          View all notifications →
        </button>
      </aside>
    </transition>

    <div class="welcome-row">
      <div>
        <h1>Good Morning {{ student.firstName }}</h1>
        <p>Sunday, 29 March 2026</p>
      </div>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon blue">
          <BookOpen :size="30" />
        </div>

        <div>
          <span>ENROLLED COURSES</span>
          <strong>{{ studentStore.enrolledCoursesCount }}</strong>
          <p>1st Semester Courses</p>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon purple">
          <BookMarked :size="30" />
        </div>

        <div>
          <span>ASSIGNMENT DUE</span>
          <strong class="purple-text">{{ studentStore.pendingAssignmentsCount }}</strong>
          <p>Next due in 2 days</p>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">
          <ClipboardList :size="30" />
        </div>

        <div>
          <span>TEST UPCOMING</span>
          <strong class="green-text">{{ studentStore.upcomingTestsCount }}</strong>
          <p>in 5 days</p>
        </div>
      </article>
    </div>

    <div class="dashboard-main">
      <main>
        <div class="section-title-row">
          <h2>Time Table</h2>

          <div class="view-toggle">
            <button
              type="button"
              :class="{ active: timetableView === 'day' }"
              @click="timetableView = 'day'"
            >
              Day
            </button>
            <button
              type="button"
              :class="{ active: timetableView === 'week' }"
              @click="timetableView = 'week'"
            >
              Week
            </button>
          </div>
        </div>

        <section class="timetable-list">
          <article
            v-for="group in visibleTimetableGroups"
            :key="`${group.day}-${group.date}`"
            class="timetable-row"
          >
            <div class="day-cell">
              <strong>{{ group.day }}</strong>
              <span>{{ group.date }}</span>
            </div>

            <div class="class-grid">
              <article
                v-for="item in group.classes"
                :key="item.id"
                class="class-card"
                :class="item.color"
              >
                <span>{{ item.time }}</span>
                <strong>{{ item.courseCode }}: {{ item.title }}</strong>
                <p>{{ item.venue }}</p>
              </article>
            </div>
          </article>
        </section>
      </main>

      <aside class="deadline-card">
        <h2>Upcoming Deadline</h2>

        <article
          v-for="deadline in studentStore.deadlines"
          :key="deadline.id"
          class="deadline-row"
        >
          <div class="deadline-date" :class="{ active: deadline.active }">
            <strong>{{ deadline.day }}</strong>
            <span>{{ deadline.month }}</span>
          </div>

          <div>
            <strong>{{ deadline.courseCode }} — {{ deadline.title }}</strong>
            <p>{{ deadline.meta }}</p>
          </div>
        </article>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Megaphone,
} from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const router = useRouter();
const studentStore = useStudentStore();

const timetableView = ref("week");
const showNotificationPopup = ref(false);
const popupTimer = ref(null);
const popupPaused = ref(false);

const student = computed(() => studentStore.currentStudent);
const popupNotifications = computed(() => studentStore.popupNotifications);

const timetableGroups = computed(() => Object.values(studentStore.groupedTimetable));

const visibleTimetableGroups = computed(() => {
  if (timetableView.value === "day") {
    return timetableGroups.value.slice(0, 1);
  }

  return timetableGroups.value;
});

onMounted(() => {
  showNotificationPopup.value = true;
  startPopupTimer();
});

onBeforeUnmount(() => {
  clearPopupTimer();
});

function startPopupTimer() {
  clearPopupTimer();

  popupTimer.value = window.setTimeout(() => {
    if (!popupPaused.value) {
      showNotificationPopup.value = false;
    }
  }, 5000);
}

function clearPopupTimer() {
  if (popupTimer.value) {
    window.clearTimeout(popupTimer.value);
    popupTimer.value = null;
  }
}

function pauseNotificationTimer() {
  popupPaused.value = true;
  clearPopupTimer();
}

function resumeNotificationTimer() {
  popupPaused.value = false;
  startPopupTimer();
}

function openNotifications() {
  clearPopupTimer();
  showNotificationPopup.value = false;
  router.push("/student/notifications");
}

function markAllRead() {
  studentStore.markAllNotificationsRead();
}
</script>

<style scoped>
.student-dashboard {
  position: relative;
  color: #0f172a;
}

.notification-popup {
  position: fixed;
  top: 64px;
  right: 48px;
  z-index: 100;
  width: 420px;
  overflow: hidden;
  border-radius: 0 16px 16px 16px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.notification-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 24px 18px;
}

.notification-popup-header h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.notification-popup-header button {
  border: 0;
  background: transparent;
  color: #111827;
  font-size: 11px;
  font-weight: 700;
}

.popup-notification-row {
  position: relative;
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #edf2f7;
  cursor: pointer;
}

.popup-notification-row.unread::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: #ef4444;
}

.popup-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.popup-icon.assignment,
.popup-icon.material {
  background: #eff6ff;
  color: #0875f5;
}

.popup-icon.grade {
  background: #fef3c7;
  color: #f59e0b;
}

.popup-icon.discussion {
  background: #fee2e2;
  color: #ef4444;
}

.popup-notification-row strong {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}

.popup-notification-row p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 11px;
}

.view-all-btn {
  width: 100%;
  height: 58px;
  border: 0;
  border-top: 1px solid #edf2f7;
  background: #f8fafc;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.welcome-row {
  margin-bottom: 30px;
}

.welcome-row h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 900;
}

.welcome-row p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  height: 118px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 26px 24px;
  border: 1px solid #cbd8ea;
  border-radius: 8px;
  background: #ffffff;
}

.stat-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: #ffffff;
}

.stat-icon.blue {
  background: #0875f5;
}

.stat-icon.purple {
  background: #8b5cf6;
}

.stat-icon.green {
  background: #16a34a;
}

.stat-card span {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.stat-card strong {
  display: block;
  color: #0875f5;
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
}

.stat-card strong.purple-text {
  color: #8b5cf6;
}

.stat-card strong.green-text {
  color: #16a34a;
}

.stat-card p {
  margin: 8px 0 0;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.dashboard-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
  align-items: start;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-title-row h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.view-toggle {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #d7e4f3;
  border-radius: 7px;
}

.view-toggle button {
  width: 68px;
  height: 32px;
  border: 0;
  background: #ffffff;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.view-toggle button.active {
  background: #f8fafc;
  color: #0875f5;
}

.timetable-list {
  display: grid;
  gap: 0;
}

.timetable-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  align-items: stretch;
}

.day-cell {
  display: grid;
  align-content: center;
  padding-right: 24px;
}

.day-cell strong,
.day-cell span {
  display: block;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 192px));
}

.class-card {
  min-height: 154px;
  padding: 24px 22px;
  border: 1px solid #d7e4f3;
  border-left-width: 3px;
  background: #ffffff;
}

.class-card.red {
  border-left-color: #ef4444;
}

.class-card.purple {
  border-left-color: #8b5cf6;
}

.class-card.green {
  border-left-color: #16a34a;
}

.class-card.blue {
  border-left-color: #0875f5;
}

.class-card span {
  display: block;
  margin-bottom: 22px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.class-card strong {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
}

.class-card p {
  margin: 0;
  color: #334155;
  font-size: 13px;
  line-height: 1.35;
}

.deadline-card {
  margin-top: 40px;
  padding: 24px 20px;
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #ffffff;
}

.deadline-card h2 {
  margin: 0 0 20px;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.deadline-row {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 58px;
  border-bottom: 1px solid #edf2f7;
}

.deadline-row:last-child {
  border-bottom: 0;
}

.deadline-date {
  width: 46px;
  height: 42px;
  display: grid;
  place-items: center;
  align-content: center;
  border-radius: 5px;
  background: #dbeafe;
  color: #0875f5;
}

.deadline-date.active {
  background: #0875f5;
  color: #ffffff;
}

.deadline-date strong {
  display: block;
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
}

.deadline-date span {
  font-size: 9px;
  font-weight: 800;
}

.deadline-row div:last-child strong {
  display: block;
  margin-bottom: 4px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.deadline-row div:last-child p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 1150px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-main {
    grid-template-columns: 1fr;
  }

  .deadline-card {
    margin-top: 0;
  }

  .notification-popup {
    right: 20px;
    width: min(420px, calc(100vw - 40px));
  }
}

@media (max-width: 850px) {
  .timetable-row {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .class-grid {
    grid-template-columns: 1fr;
  }

  .class-card {
    min-height: auto;
  }

  .section-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>