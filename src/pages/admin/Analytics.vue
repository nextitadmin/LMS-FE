<template>
  <div class="analytics-page">
    <div class="page-header analytics-header">
      <div>
        <h1 class="page-title">System Analytics</h1>
        <p class="page-subtitle">
          LMS usage, traffic, and engagement metrics over the last 30 days
        </p>
      </div>

      <button type="button" class="refresh-btn" @click="refreshAnalytics">
        Refresh Metrics
      </button>
    </div>

    <div class="analytics-metrics">
      <section
        v-for="metric in metrics"
        :key="metric.title"
        class="metric-card"
      >
        <div>
          <h3>{{ metric.title }}</h3>
          <strong>{{ metric.value }}</strong>
          <p :class="metric.trendType">{{ metric.trend }}</p>
        </div>

        <div
          v-if="metric.type === 'bars'"
          class="mini-chart"
          :class="metric.chartClass"
        >
          <span
            v-for="(bar, index) in metric.bars"
            :key="index"
            :style="{ height: `${bar}%` }"
          ></span>
        </div>

        <div v-else class="storage-visual">
          <div class="storage-bar">
            <span
              v-for="part in storageParts"
              :key="part.name"
              :class="part.className"
              :style="{ width: `${part.value}%` }"
            ></span>
          </div>

          <div class="legend">
            <span v-for="part in storageParts.slice(0, 3)" :key="part.name">
              <i :class="part.className"></i>
              {{ part.name }}
            </span>
          </div>
        </div>
      </section>
    </div>

    <div class="analytics-lower">
      <section class="panel modules-panel">
        <div class="panel-header">
          <h2>Top Active Modules</h2>
          <span>Live ranking</span>
        </div>

        <div class="module-list">
          <article
            v-for="module in modules"
            :key="module.name"
            class="module-row"
          >
            <div>
              <strong>{{ module.name }}</strong>

              <div class="module-progress">
                <span :style="{ width: `${module.progress}%` }"></span>
              </div>
            </div>

            <b>{{ module.count }}</b>
          </article>
        </div>
      </section>

      <section class="panel server-panel">
        <div class="panel-header">
          <h2>Server Health Log</h2>
          <span class="pulse-status">Monitoring</span>
        </div>

        <pre>{{ serverLog }}</pre>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const metrics = reactive([
  {
    title: "DAILY ACTIVE USERS",
    value: "2,145",
    trend: "↑ 14% vs previous 30 days",
    trendType: "positive",
    type: "bars",
    chartClass: "blue-chart",
    bars: [18, 42, 30, 48, 76, 62, 100],
  },
  {
    title: "BANDWIDTH CONSUMED",
    value: "1.4 TB",
    trend: "↑ 22% vs previous 30 days",
    trendType: "negative",
    type: "bars",
    chartClass: "red-chart",
    bars: [42, 34, 55, 28, 61, 50, 100],
  },
  {
    title: "STORAGE CAPACITY",
    value: "78%",
    trend: "3.9 TB used of 5 TB limit",
    trendType: "neutral",
    type: "storage",
  },
]);

const storageParts = [
  {
    name: "Videos",
    value: 54,
    className: "videos",
  },
  {
    name: "Docs",
    value: 15,
    className: "docs",
  },
  {
    name: "Others",
    value: 9,
    className: "others",
  },
  {
    name: "Free",
    value: 22,
    className: "free",
  },
];

const modules = reactive([
  {
    name: "Assignments (Submissions)",
    count: "4,291",
    progress: 96,
  },
  {
    name: "Video Player",
    count: "3,920",
    progress: 88,
  },
  {
    name: "Discussion Boards",
    count: "1,842",
    progress: 55,
  },
  {
    name: "Online Test (CBT)",
    count: "940",
    progress: 32,
  },
]);

const serverLog = ref(`[09:41] INFO: SSO Token refreshed
[09:45] WARN: High CPU load on Node 3
[09:50] INFO: Backup completed successfully
[10:02] INFO: New course batch synchronized
[10:15] INFO: Email digest dispatched
[10:30] WARN: DB query latency > 500ms`);

function refreshAnalytics() {
  metrics[0].value = "2,168";
  metrics[1].value = "1.42 TB";
  modules[0].count = "4,305";

  serverLog.value = `[${new Date().toLocaleTimeString()}] INFO: Metrics refreshed locally
[09:41] INFO: SSO Token refreshed
[09:45] WARN: High CPU load on Node 3
[09:50] INFO: Backup completed successfully
[10:02] INFO: New course batch synchronized
[10:15] INFO: Email digest dispatched`;
}
</script>

<style scoped>
.analytics-page {
  width: 100%;
}

.analytics-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.refresh-btn {
  height: 38px;
  border: 1px solid #0875f5;
  border-radius: 4px;
  background: #ffffff;
  color: #0875f5;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 800;
  transition: 0.2s ease;
}

.refresh-btn:hover {
  background: #eff6ff;
  transform: translateY(-1px);
}

.analytics-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.metric-card,
.panel {
  border: 1px solid #d5deeb;
  border-radius: 10px;
  background: #ffffff;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.metric-card:hover,
.panel:hover {
  transform: translateY(-2px);
  border-color: #b8c7da;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.metric-card {
  min-height: 184px;
  padding: 21px 24px 18px;
}

.metric-card h3 {
  margin: 0 0 14px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.metric-card strong {
  display: block;
  margin-bottom: 10px;
  color: #0f172a;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}

.metric-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
}

.metric-card p.positive {
  color: #0875f5;
}

.metric-card p.negative {
  color: #ef4444;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 58px;
  margin-top: 12px;
}

.mini-chart span {
  flex: 1;
  min-width: 28px;
  border-radius: 2px 2px 0 0;
  animation: growBar 0.75s ease both;
  transform-origin: bottom;
}

.blue-chart span {
  background: #dceafe;
}

.blue-chart span:last-child {
  background: #0875f5;
}

.red-chart span {
  background: #fde0e0;
}

.red-chart span:last-child {
  background: #ef4444;
}

.storage-visual {
  margin-top: 24px;
}

.storage-bar {
  display: flex;
  width: 100%;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #dcfce7;
}

.storage-bar span {
  animation: revealWidth 0.8s ease both;
}

.videos {
  background: #f59e0b;
}

.docs {
  background: #1d4ed8;
}

.others {
  background: #16a34a;
}

.free {
  background: #dcfce7;
}

.legend {
  display: flex;
  gap: 22px;
  margin-top: 20px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.legend i {
  width: 11px;
  height: 11px;
  display: inline-block;
  border-radius: 2px;
}

.analytics-lower {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 366px;
  gap: 24px;
}

.panel {
  padding: 25px 28px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.panel-header h2 {
  margin: 0;
  color: #334155;
  font-size: 20px;
  font-weight: 900;
}

.panel-header span {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
}

.module-list {
  display: grid;
}

.module-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  min-height: 64px;
  border-bottom: 1px solid #e2e8f0;
}

.module-row:last-child {
  border-bottom: 0;
}

.module-row strong,
.module-row b {
  color: #64748b;
  font-size: 15px;
  font-weight: 900;
}

.module-progress {
  width: 100%;
  height: 5px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
}

.module-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #0875f5;
  animation: revealWidth 0.85s ease both;
}

.pulse-status {
  position: relative;
  color: #16a34a !important;
}

.pulse-status::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  border-radius: 999px;
  background: #16a34a;
  animation: pulse 1.4s infinite;
}

.server-panel pre {
  margin: 0;
  padding: 18px 14px;
  border-radius: 8px;
  background: #dcfce7;
  color: #3a7b18;
  font-family: "Courier New", monospace;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.75;
  white-space: pre-wrap;
}

@keyframes growBar {
  from {
    transform: scaleY(0);
    opacity: 0.25;
  }

  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes revealWidth {
  from {
    max-width: 0;
    opacity: 0.4;
  }

  to {
    max-width: 100%;
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.35);
  }

  70% {
    box-shadow: 0 0 0 7px rgba(22, 163, 74, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
  }
}

@media (max-width: 1100px) {
  .analytics-metrics,
  .analytics-lower {
    grid-template-columns: 1fr;
  }

  .analytics-header {
    flex-direction: column;
  }
}
</style>