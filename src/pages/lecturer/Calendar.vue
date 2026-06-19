<template>
  <section class="calendar-page">
    <div class="calendar-header">
      <div>
        <h1 class="page-title">Academic Calendar</h1>
        <p class="page-subtitle">
          {{ formattedToday }} · Week {{ currentWeek }} of {{ totalWeeks }}
        </p>
      </div>

      <button type="button" class="add-event-btn" @click="openAddModal">
        + Add Event
      </button>
    </div>

    <div class="calendar-top-row">
      <h2>{{ monthLabel }}</h2>

      <div class="view-tabs">
        <button
          type="button"
          :class="{ active: activeView === 'week' }"
          @click="activeView = 'week'"
        >
          Week
        </button>

        <button
          type="button"
          :class="{ active: activeView === 'month' }"
          @click="activeView = 'month'"
        >
          Month
        </button>
      </div>

      <div class="calendar-nav">
        <button type="button" aria-label="Previous" @click="goPrevious">‹</button>
        <button type="button" aria-label="Next" @click="goNext">›</button>
      </div>
    </div>

    <div v-if="activeView === 'week'" class="semester-banner">
      {{ weekBanner }}
    </div>

    <div v-if="activeView === 'week'" class="week-calendar">
      <div class="time-column">
        <div class="corner-cell"></div>

        <div v-for="slot in timeSlots" :key="slot.hour" class="time-cell">
          {{ slot.label }}
        </div>
      </div>

      <div class="days-grid">
        <div v-for="day in visibleWeekDays" :key="day.dateKey" class="day-column">
          <div class="day-heading">
            <span>{{ day.shortLabel }}</span>
          </div>

          <div class="day-body" @dblclick="openAddModalForDate(day.dateKey)">
            <button
              v-for="event in eventsForDate(day.dateKey)"
              :key="event.id"
              type="button"
              class="event-chip"
              :class="event.type"
              :style="eventStyle(event)"
              @click.stop="openViewModal(event)"
            >
              {{ event.title }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="month-calendar">
      <div v-for="day in monthWeekdays" :key="day" class="month-weekday">
        {{ day }}
      </div>

      <button
        v-for="day in visibleMonthDays"
        :key="day.id"
        type="button"
        class="month-day"
        :class="{ muted: !day.isCurrentMonth }"
        @dblclick="openAddModalForDate(day.dateKey)"
      >
        <strong>{{ day.dayNumber }}</strong>

        <span
          v-for="event in eventsForDate(day.dateKey).slice(0, 3)"
          :key="event.id"
          class="month-event"
          :class="event.type"
          @click.stop="openViewModal(event)"
        >
          {{ event.title }}
        </span>
      </button>
    </div>

    <AppModal v-model="isEventFormOpen">
      <div class="event-modal">
        <h2>{{ modalMode === "add" ? "Add Event" : "Edit Event" }}</h2>
        <p>Set a new event for your students</p>

        <form @submit.prevent="saveEvent">
          <div class="form-grid">
            <label class="form-label">
              Course
              <select v-model="eventForm.courseId" class="form-select">
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.code }} - {{ course.title }}
                </option>
              </select>
            </label>

            <label class="form-label">
              Frequency
              <select v-model="eventForm.frequency" class="form-select">
                <option value="once">Once</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>

            <label class="form-label">
              Title
              <input
                v-model.trim="eventForm.title"
                class="form-input"
                placeholder="e.g. Lecture"
                maxlength="80"
              />
            </label>

            <label class="form-label">
              Location
              <select v-model="eventForm.location" class="form-select">
                <option>Online</option>
                <option>Main Auditorium</option>
                <option>Hall 3</option>
                <option>LT 5, CST Block</option>
              </select>
            </label>
          </div>

          <label class="form-label full-field">
            Instructions
            <textarea
              v-model.trim="eventForm.instructions"
              class="form-textarea"
              placeholder="Describe the event instructions..."
              maxlength="240"
            ></textarea>
          </label>

          <div class="time-grid">
            <label class="form-label">
              Date
              <input v-model="eventForm.date" class="form-input" type="date" />
            </label>

            <label class="form-label">
              From
              <input v-model="eventForm.startTime" class="form-input" type="time" />
            </label>

            <label class="form-label">
              To
              <input v-model="eventForm.endTime" class="form-input" type="time" />
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button type="button" class="outline-btn" @click="closeEventForm">
              Cancel
            </button>

            <button type="submit" class="submit-btn">
              {{ modalMode === "add" ? "Submit" : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </AppModal>

    <AppModal v-model="isViewModalOpen">
      <div class="view-modal">
        <button type="button" class="close-view" @click="isViewModalOpen = false">
          ×
        </button>

        <h2>{{ selectedEvent.title }}</h2>

        <div class="detail-list">
          <div>
            <CalendarDays :size="18" />
            <span>{{ formatLongDate(selectedEvent.date) }}</span>
          </div>

          <div>
            <Clock :size="18" />
            <span>{{ formatTimeRange(selectedEvent.startTime, selectedEvent.endTime) }}</span>
          </div>

          <div>
            <MapPin :size="18" />
            <span>{{ selectedEvent.location }}</span>
          </div>
        </div>

        <p class="event-note">
          {{ selectedEvent.instructions }}
        </p>

        <div class="view-actions">
          <button type="button" class="outline-btn" @click="deleteSelectedEvent">
            Delete
          </button>

          <button type="button" class="submit-btn" @click="openEditFromView">
            Edit
          </button>
        </div>
      </div>
    </AppModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { CalendarDays, Clock, MapPin } from "lucide-vue-next";

import AppModal from "../../components/common/AppModal.vue";

const totalWeeks = 15;
const currentWeek = 9;

const activeView = ref("week");
const currentDate = ref(createLocalDate("2026-05-04"));
const isEventFormOpen = ref(false);
const isViewModalOpen = ref(false);
const modalMode = ref("add");
const editingEventId = ref(null);
const formError = ref("");
const selectedEvent = ref({});

const courses = [
  {
    id: "csc-112",
    code: "CSC 112",
    title: "Introduction to Computer Science",
  },
  {
    id: "csc-312",
    code: "CSC 312",
    title: "Data Structures",
  },
  {
    id: "csc-322",
    code: "CSC 322",
    title: "Database Management",
  },
];

const events = ref([
  {
    id: 1,
    courseId: "csc-322",
    title: "CSC 322",
    type: "lecture",
    date: "2026-05-04",
    startTime: "10:00",
    endTime: "10:45",
    location: "Online",
    frequency: "once",
    instructions: "Attendance is compulsory.",
  },
  {
    id: 2,
    courseId: "csc-312",
    title: "CSC 312 TEST",
    type: "test",
    date: "2026-05-04",
    startTime: "11:00",
    endTime: "11:45",
    location: "Online",
    frequency: "once",
    instructions: "Mid-semester test. Attendance is compulsory.",
  },
  {
    id: 3,
    courseId: "csc-112",
    title: "ASSIGNMENT DUE",
    type: "assignment",
    date: "2026-05-06",
    startTime: "13:00",
    endTime: "13:45",
    location: "Online",
    frequency: "once",
    instructions: "Submit before the deadline.",
  },
]);

const eventForm = reactive({
  courseId: "csc-112",
  title: "",
  date: "2026-05-04",
  startTime: "12:00",
  endTime: "14:00",
  location: "Online",
  frequency: "once",
  instructions: "",
});

const timeSlots = [
  { hour: 9, label: "9AM" },
  { hour: 10, label: "10AM" },
  { hour: 11, label: "11AM" },
  { hour: 12, label: "NOON" },
  { hour: 13, label: "1PM" },
  { hour: 14, label: "2PM" },
  { hour: 15, label: "3PM" },
  { hour: 16, label: "4PM" },
  { hour: 17, label: "5PM" },
];

const monthWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formattedToday = computed(() => formatLongDate("2026-03-29"));

const monthLabel = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const visibleWeekDays = computed(() => {
  const start = startOfWeek(currentDate.value);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);

    return {
      date,
      dateKey: toDateKey(date),
      shortLabel: `${date.toLocaleDateString("en-US", {
        weekday: "short",
      })} ${date.getDate()}`,
    };
  });
});

const visibleMonthDays = computed(() => {
  const firstDay = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    1
  );

  const gridStart = startOfWeek(firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      id: toDateKey(date),
      dateKey: toDateKey(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
    };
  });
});

const weekBanner = computed(() => {
  const weekDays = visibleWeekDays.value;
  const firstDay = weekDays[0]?.date;
  const lastDay = weekDays[6]?.date;

  if (!firstDay || !lastDay) return "";

  const startLabel = firstDay.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endLabel = lastDay.toLocaleDateString("en-US", {
    day: "numeric",
  });

  return `${startLabel} - ${endLabel} Mid-Semester Tests (CA)`;
});

function createLocalDate(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function startOfWeek(date) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function eventsForDate(dateKey) {
  return events.value
    .filter((event) => event.date === dateKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function timeToMinutes(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  return hour * 60 + minute;
}

function eventStyle(event) {
  const rowHeight = 82;
  const eventWidth = 138;
  const startMinutes = timeToMinutes(event.startTime);
  const startHour = Math.floor(startMinutes / 60);
  const rowIndex = Math.max(0, startHour - 9);

  const top = rowIndex * rowHeight + (rowHeight - 38) / 2;

  return {
    top: `${top}px`,
    height: "38px",
    left: `calc(50% - ${eventWidth / 2}px)`,
    right: "auto",
    width: `${eventWidth}px`,
  };
}

function getTypeFromTitle(title) {
  const lowered = title.toLowerCase();

  if (lowered.includes("test")) return "test";
  if (lowered.includes("assignment") || lowered.includes("due")) return "assignment";

  return "lecture";
}

function resetForm() {
  Object.assign(eventForm, {
    courseId: "csc-112",
    title: "",
    date: toDateKey(currentDate.value),
    startTime: "12:00",
    endTime: "14:00",
    location: "Online",
    frequency: "once",
    instructions: "",
  });

  editingEventId.value = null;
  formError.value = "";
}

function openAddModal() {
  modalMode.value = "add";
  resetForm();
  isEventFormOpen.value = true;
}

function openAddModalForDate(dateKey) {
  openAddModal();
  eventForm.date = dateKey;
}

function closeEventForm() {
  isEventFormOpen.value = false;
  resetForm();
}

function openViewModal(event) {
  selectedEvent.value = { ...event };
  isViewModalOpen.value = true;
}

function openEditFromView() {
  modalMode.value = "edit";
  editingEventId.value = selectedEvent.value.id;

  Object.assign(eventForm, {
    courseId: selectedEvent.value.courseId,
    title: selectedEvent.value.title,
    date: selectedEvent.value.date,
    startTime: selectedEvent.value.startTime,
    endTime: selectedEvent.value.endTime,
    location: selectedEvent.value.location,
    frequency: selectedEvent.value.frequency,
    instructions: selectedEvent.value.instructions,
  });

  isViewModalOpen.value = false;
  isEventFormOpen.value = true;
}

function validateForm() {
  const title = sanitizeText(eventForm.title);

  if (!title) return "Event title is required.";
  if (!eventForm.date) return "Event date is required.";
  if (!eventForm.startTime || !eventForm.endTime) return "Start and end time are required.";

  if (timeToMinutes(eventForm.endTime) <= timeToMinutes(eventForm.startTime)) {
    return "End time must be later than start time.";
  }

  if (timeToMinutes(eventForm.startTime) < 9 * 60 || timeToMinutes(eventForm.startTime) > 17 * 60) {
    return "Event start time must be between 9:00 AM and 5:00 PM.";
  }

  return "";
}

function buildPayload() {
  const title = sanitizeText(eventForm.title);

  return {
    courseId: sanitizeText(eventForm.courseId),
    title,
    type: getTypeFromTitle(title),
    date: eventForm.date,
    startTime: eventForm.startTime,
    endTime: eventForm.endTime,
    location: sanitizeText(eventForm.location),
    frequency: sanitizeText(eventForm.frequency),
    instructions: sanitizeText(eventForm.instructions) || "Attendance is compulsory.",
  };
}

function saveEvent() {
  const error = validateForm();

  if (error) {
    formError.value = error;
    return;
  }

  const payload = buildPayload();

  if (modalMode.value === "edit") {
    events.value = events.value.map((event) =>
      event.id === editingEventId.value ? { ...event, ...payload } : event
    );
  } else {
    events.value = [
      ...events.value,
      {
        id: Date.now(),
        ...payload,
      },
    ];
  }

  currentDate.value = createLocalDate(payload.date);
  activeView.value = "week";
  closeEventForm();
}

function deleteSelectedEvent() {
  events.value = events.value.filter((event) => event.id !== selectedEvent.value.id);
  isViewModalOpen.value = false;
}

function goPrevious() {
  currentDate.value = addDays(currentDate.value, activeView.value === "week" ? -7 : -30);
}

function goNext() {
  currentDate.value = addDays(currentDate.value, activeView.value === "week" ? 7 : 30);
}

function formatLongDate(dateKey) {
  if (!dateKey) return "";

  return createLocalDate(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

function formatTime(value) {
  if (!value) return "";

  const [rawHour, minute] = value.split(":");
  let hour = Number(rawHour);
  const period = hour >= 12 ? "PM" : "AM";

  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  return `${hour}:${minute} ${period}`;
}
</script>

<style scoped>
.calendar-page {
  width: 100%;
}

.calendar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 34px;
}

.add-event-btn {
  height: 38px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 14px;
  font-weight: 900;
  transition: 0.2s ease;
}

.add-event-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.calendar-top-row {
  display: grid;
  grid-template-columns: 180px 1fr 90px;
  align-items: center;
  margin-bottom: 8px;
}

.calendar-top-row h2 {
  margin: 0;
  color: #334155;
  font-size: 20px;
  font-weight: 900;
}

.view-tabs {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-tabs button {
  width: 62px;
  height: 34px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.view-tabs button.active {
  border: 1px solid #0875f5;
  background: #eff6ff;
  color: #0875f5;
}

.calendar-nav {
  justify-self: end;
  display: flex;
  gap: 12px;
}

.calendar-nav button {
  border: 0;
  background: transparent;
  color: #334155;
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
}

.semester-banner {
  width: calc((100% - 43px) * 5 / 7);
  margin-left: calc(43px + ((100% - 43px) / 7));
  height: 34px;
  display: grid;
  place-items: center;
  background: #fff3c4;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.week-calendar {
  display: grid;
  grid-template-columns: 43px 1fr;
  margin-top: 10px;
}

.time-column {
  display: grid;
  grid-template-rows: 24px repeat(9, 82px);
}

.corner-cell {
  height: 24px;
}

.time-cell {
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  transform: translateY(24px);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
}

.day-heading {
  height: 24px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

.day-body {
  position: relative;
  height: 738px;
  border-left: 1px solid #cbd8ea;
  border-right: 1px solid #cbd8ea;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 81px,
      #cbd8ea 82px
    );
}

.event-chip {
  position: absolute;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  transition: 0.2s ease;
  animation: popIn 0.2s ease both;
}

.event-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.event-chip.lecture {
  background: #f8fafc;
  color: #0875f5;
}

.event-chip.test {
  background: #dcfce7;
  color: #16a34a;
}

.event-chip.assignment {
  background: #fee2e2;
  color: #ef4444;
}

.month-calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
  border: 1px solid #d5deeb;
  background: #ffffff;
}

.month-weekday {
  height: 42px;
  display: grid;
  place-items: center;
  border-bottom: 1px solid #d5deeb;
  color: #64748b;
  font-weight: 900;
}

.month-day {
  min-height: 116px;
  border: 0;
  border-right: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  background: white;
  padding: 10px;
  text-align: left;
}

.month-day:hover {
  background: #f8fafc;
}

.month-day.muted {
  background: #fbfdff;
  color: #94a3b8;
}

.month-day strong {
  display: block;
  margin-bottom: 8px;
}

.month-event {
  display: block;
  margin-top: 5px;
  padding: 5px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 900;
}

.month-event.lecture {
  background: #eff6ff;
  color: #0875f5;
}

.month-event.test {
  background: #dcfce7;
  color: #16a34a;
}

.month-event.assignment {
  background: #fee2e2;
  color: #ef4444;
}

.event-modal h2,
.view-modal h2 {
  margin: 0 0 10px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 900;
}

.event-modal p {
  margin: 0 0 22px;
  color: #71829b;
  font-size: 13px;
  font-weight: 600;
}

.form-grid,
.time-grid {
  display: grid;
  gap: 16px;
}

.form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.time-grid {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 18px;
}

.full-field {
  margin-top: 16px;
}

.form-error {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 800;
}

.modal-actions,
.view-actions {
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

.view-modal {
  position: relative;
}

.close-view {
  position: absolute;
  top: -4px;
  right: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 26px;
}

.detail-list {
  display: grid;
  gap: 20px;
  margin-top: 26px;
}

.detail-list div {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.event-note {
  margin: 26px 0 0;
  padding-bottom: 26px;
  border-bottom: 1px solid #d5deeb;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 1100px) {
  .calendar-page {
    overflow-x: auto;
  }

  .week-calendar,
  .calendar-top-row,
  .semester-banner,
  .month-calendar {
    min-width: 1000px;
  }
}

@media (max-width: 800px) {
  .calendar-header {
    flex-direction: column;
  }

  .form-grid,
  .time-grid {
    grid-template-columns: 1fr;
  }
}
</style>