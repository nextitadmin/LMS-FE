<template>
  <section class="notifications-page">
    <div class="page-heading">
      <h1>Notifications</h1>
      <p>Stay updated on your coursework, grades and announcements.</p>
    </div>

    <div class="filter-row">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        :class="{ active: activeFilter === filter }"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <section class="notifications-card">
      <article
        v-for="notification in visibleNotifications"
        :key="notification.id"
        class="notification-row"
        :class="{ unread: notification.unread, red: notification.accent === 'red' }"
      >
        <div class="notification-icon" :class="notification.type">
          <FileText
            v-if="notification.type === 'assignment' || notification.type === 'material'"
            :size="17"
          />
          <BarChart3 v-else-if="notification.type === 'grade'" :size="17" />
          <MessageSquare v-else-if="notification.type === 'discussion'" :size="17" />
          <Megaphone v-else :size="17" />
        </div>

        <div class="notification-content">
          <span>{{ notification.courseCode }} — {{ notification.courseTitle }}</span>
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.meta }}</p>

          <button
            v-if="notification.actionLabel"
            type="button"
            @click="markRead(notification.id)"
          >
            {{ notification.actionLabel }}
          </button>
        </div>
      </article>

      <div v-if="visibleNotifications.length === 0" class="empty-state">
        No notifications in this category.
      </div>
    </section>

    <div class="load-more-row">
      <button type="button" @click="loadMore">
        Load More Notifications
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  BarChart3,
  FileText,
  Megaphone,
  MessageSquare,
} from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const studentStore = useStudentStore();

const filters = ["All", "Unread", "Assignments & Tests", "Grades", "Announcement"];
const activeFilter = ref("All");
const visibleLimit = ref(4);

const filteredNotifications = computed(() => {
  if (activeFilter.value === "All") {
    return studentStore.notifications;
  }

  if (activeFilter.value === "Unread") {
    return studentStore.notifications.filter((item) => item.unread);
  }

  return studentStore.notifications.filter(
    (item) => item.category === activeFilter.value
  );
});

const visibleNotifications = computed(() =>
  filteredNotifications.value.slice(0, visibleLimit.value)
);

function markRead(notificationId) {
  studentStore.markNotificationRead(notificationId);
}

function loadMore() {
  visibleLimit.value += 4;
}
</script>

<style scoped>
.notifications-page {
  color: #0f172a;
}

.page-heading {
  margin-bottom: 26px;
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

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.filter-row button {
  height: 34px;
  padding: 0 20px;
  border: 1px solid #0875f5;
  border-radius: 999px;
  background: white;
  color: #0875f5;
  font-size: 13px;
  font-weight: 900;
}

.filter-row button.active {
  background: #0875f5;
  color: white;
}

.notifications-card {
  overflow: hidden;
  border: 1px solid #d7e4f3;
  border-radius: 16px;
  background: white;
}

.notification-row {
  position: relative;
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 16px;
  min-height: 142px;
  padding: 26px 24px;
  border-bottom: 1px solid #edf2f7;
}

.notification-row:last-child {
  border-bottom: 0;
}

.notification-row.red::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: #ef4444;
}

.notification-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.notification-icon.assignment,
.notification-icon.material {
  color: #16a34a;
  background: #dcfce7;
}

.notification-icon.grade {
  color: #f59e0b;
  background: #fef3c7;
}

.notification-icon.discussion {
  color: #8b5cf6;
  background: #ede9fe;
}

.notification-content span {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 11px;
}

.notification-content strong {
  display: block;
  color: #334155;
  font-size: 13.5px;
  font-weight: 900;
  line-height: 1.4;
}

.notification-content p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 12px;
}

.notification-content button {
  height: 34px;
  margin-top: 12px;
  padding: 0 18px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 13px;
  font-weight: 900;
}

.notification-row:first-child .notification-content button {
  background: #16a34a;
  color: white;
}

.empty-state {
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #64748b;
  font-size: 14px;
}

.load-more-row {
  display: flex;
  justify-content: center;
  margin-top: 34px;
}

.load-more-row button {
  height: 38px;
  padding: 0 28px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 13px;
  font-weight: 900;
}

@media (max-width: 700px) {
  .notification-row {
    grid-template-columns: 1fr;
  }
}
</style>