<template>
  <div class="lecturer-dashboard">
    <div class="page-header">
      <h1 class="page-title">Good Morning Dr. Adesanya</h1>
      <p class="page-subtitle">Sunday, 29 March 2026 · Week 9 of 15</p>
    </div>

    <div class="stats-grid">
      <section class="stat-card">
        <div class="stat-icon blue"><BookOpen :size="30" /></div>
        <div>
          <h3>Courses</h3>
          <strong class="blue-text">3</strong>
          <p>This Semester</p>
        </div>
      </section>

      <section class="stat-card">
        <div class="stat-icon purple"><Users :size="30" /></div>
        <div>
          <h3>Total Students</h3>
          <strong class="purple-text">250</strong>
          <p>Enrolled across courses</p>
        </div>
      </section>

      <section class="stat-card">
        <div class="stat-icon green"><Files :size="30" /></div>
        <div>
          <h3>To Grade</h3>
          <strong class="green-text">11</strong>
          <p>Pending Submissions</p>
        </div>
      </section>
    </div>

    <div class="dashboard-grid">
      <section>
        <div class="section-header">
          <h2>Time Table</h2>

          <div class="view-toggle">
            <button class="active">Day</button>
            <button>Week</button>
          </div>
        </div>

        <div class="timetable">
          <div class="date-cell">
            <strong>Tuesday</strong>
            <span>08/04</span>
          </div>

          <article class="lecture-card purple-border">
            <strong>2:00 PM</strong>
            <h3>CSC 112: Intro to Computer Science</h3>
            <p>Lecture · Main Auditorium · 300L</p>
          </article>

          <article class="lecture-card green-border">
            <strong>2:00 PM</strong>
            <h3>CSC 112: Intro to Computer Science</h3>
            <p>Lecture · Main Auditorium · 300L</p>
          </article>
        </div>
      </section>

      <aside class="deadline-card">
        <h2>Upcoming Deadline</h2>

        <div
          v-for="deadline in deadlines"
          :key="deadline.title"
          class="deadline-row"
        >
          <div class="deadline-date">
            <strong>{{ deadline.day }}</strong>
            <span>{{ deadline.month }}</span>
          </div>

          <div>
            <h3>{{ deadline.title }}</h3>
            <p>{{ deadline.time }}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, Files, Users } from "lucide-vue-next";

const deadlines = [
  {
    day: "28",
    month: "MAY",
    title: "CSC 322 — Mid-Semester Test",
    time: "10:00 AM · Online (LMS)",
  },
  {
    day: "2",
    month: "JUN",
    title: "CSC 312 — Assignment",
    time: "9:00 AM",
  },
  {
    day: "2",
    month: "JUN",
    title: "CSC 324 — Lecture",
    time: "2:00 PM · LT 5, CST Block",
  },
];
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 44px;
}

.stat-card {
  min-height: 120px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #d5deeb;
  border-radius: 10px;
  background: #fff;
  padding: 26px;
  transition: 0.22s ease;
}

.stat-card:hover,
.deadline-card:hover,
.lecture-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.stat-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: white;
}

.blue { background: #0875f5; }
.purple { background: #8b5cf6; }
.green { background: #16a34a; }

.stat-card h3 {
  margin: 0 0 6px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.stat-card strong {
  display: block;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}

.blue-text { color: #0875f5; }
.purple-text { color: #8b5cf6; }
.green-text { color: #16a34a; }

.stat-card p {
  margin: 6px 0 0;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.section-header h2,
.deadline-card h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 900;
}

.view-toggle {
  display: inline-flex;
  border: 1px solid #d5deeb;
  border-radius: 8px;
  overflow: hidden;
}

.view-toggle button {
  width: 70px;
  height: 34px;
  border: 0;
  background: #fff;
  color: #64748b;
  font-weight: 800;
}

.view-toggle .active {
  color: #0875f5;
  background: #eff6ff;
}

.timetable {
  display: grid;
  grid-template-columns: 74px repeat(2, minmax(0, 230px));
  align-items: stretch;
}

.date-cell {
  display: grid;
  align-content: center;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.date-cell span {
  display: block;
}

.lecture-card {
  min-height: 156px;
  border: 1px solid #d5deeb;
  background: #fff;
  padding: 24px;
  transition: 0.22s ease;
}

.purple-border {
  border-left: 3px solid #8b5cf6;
}

.green-border {
  border-left: 3px solid #22c55e;
}

.lecture-card strong {
  color: #334155;
}

.lecture-card h3 {
  margin: 22px 0 6px;
  color: #26344d;
  font-size: 16px;
  font-weight: 900;
}

.lecture-card p {
  margin: 0;
  color: #475569;
  font-size: 13px;
}

.deadline-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #fff;
  padding: 22px 20px;
  transition: 0.22s ease;
}

.deadline-row {
  display: flex;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid #edf2f7;
}

.deadline-row:last-child {
  border-bottom: 0;
}

.deadline-date {
  width: 46px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: #dbeafe;
  color: #0875f5;
  flex: 0 0 46px;
}

.deadline-date:first-child {
  background: #0875f5;
  color: white;
}

.deadline-date strong {
  font-size: 17px;
  line-height: 1;
}

.deadline-date span {
  font-size: 10px;
  font-weight: 800;
}

.deadline-row h3 {
  margin: 0 0 4px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.deadline-row p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .stats-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .timetable {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>