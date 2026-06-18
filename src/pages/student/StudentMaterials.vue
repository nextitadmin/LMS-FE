<template>
  <section class="student-materials-page">
    <div class="materials-layout">
      <main class="materials-list">
        <article
          v-for="material in filteredMaterials"
          :key="material.id"
          class="material-row"
        >
          <div class="file-icon" :class="material.type">
            <FileText :size="22" />
          </div>

          <div class="material-info">
            <h3>{{ material.title }}</h3>
            <p>
              Week {{ material.week }}
              <span>·</span>
              {{ material.date }}
              <span>·</span>
              {{ material.size }}
            </p>
          </div>

          <div class="material-actions">
            <button type="button" class="preview-btn" @click="previewMaterial(material)">
              Preview
            </button>

            <button
              type="button"
              class="download-btn"
              :disabled="!material.allowDownload"
              @click="downloadMaterial(material)"
            >
              <Download :size="14" />
              Download
            </button>
          </div>
        </article>

        <div v-if="filteredMaterials.length === 0" class="empty-card">
          <h2>No materials found</h2>
          <p>There are no materials matching your current filters.</p>
        </div>
      </main>

      <aside class="filter-column">
        <section class="filter-card">
          <h2>Filter by Week</h2>

          <div class="week-buttons">
            <button
              v-for="week in weekOptions"
              :key="week.value"
              type="button"
              :class="{ active: selectedWeek === week.value }"
              @click="selectedWeek = week.value"
            >
              {{ week.label }}
            </button>
          </div>
        </section>

        <section class="filter-card">
          <h2>Type</h2>

          <label
            v-for="type in materialTypes"
            :key="type"
            class="check-row"
          >
            <input v-model="selectedTypes" type="checkbox" :value="type" />
            <span>{{ type }}</span>
          </label>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Download, FileText } from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();

const materialTypes = [
  "Lecture Notes (PDF)",
  "Slides (PPT)",
  "Past Questions",
];

const selectedWeek = ref("all");
const selectedTypes = ref([...materialTypes]);

const courseId = computed(() => String(route.params.courseId || ""));

const materials = computed(() =>
  studentStore.getMaterialsByCourse(courseId.value)
);

const weekOptions = computed(() => {
  const weeks = [...new Set(materials.value.map((item) => item.week))].sort(
    (a, b) => Number(a) - Number(b)
  );

  return [
    { label: "All", value: "all" },
    ...weeks.map((week) => ({
      label: `Week ${week}`,
      value: week,
    })),
  ];
});

const filteredMaterials = computed(() => {
  return materials.value.filter((material) => {
    const byWeek =
      selectedWeek.value === "all" ||
      Number(material.week) === Number(selectedWeek.value);

    const byType = selectedTypes.value.includes(material.category);

    return byWeek && byType;
  });
});

function previewMaterial(material) {
  router.push(`/student/my-courses/${courseId.value}/materials/${material.id}`);
}

function downloadMaterial(material) {
  if (!material.allowDownload) return;

  const blob = new Blob(
    [`${material.title}\n\nThis is a UI demo download placeholder.`],
    { type: "text/plain;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = material.title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.student-materials-page {
  padding-top: 0;
}

.materials-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.materials-list,
.filter-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #ffffff;
}

.materials-list {
  min-height: 410px;
  overflow: hidden;
}

.material-row {
  min-height: 80px;
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #edf2f7;
}

.material-row:last-child {
  border-bottom: 0;
}

.file-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
}

.file-icon.pdf {
  color: #dc2626;
  background: #fee2e2;
}

.file-icon.pptx {
  color: #0875f5;
  background: #dbeafe;
}

.file-icon.docx {
  color: #d97706;
  background: #fef3c7;
}

.file-icon.zip {
  color: #16a34a;
  background: #dcfce7;
}

.material-info h3 {
  margin: 0 0 5px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.material-info p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.material-info span {
  margin: 0 8px;
}

.material-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-btn,
.download-btn {
  height: 30px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.preview-btn {
  width: 78px;
  border: 1px solid #0875f5;
  background: white;
  color: #0875f5;
}

.download-btn {
  width: 106px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.download-btn:disabled {
  border-color: #b7e4c7;
  background: #b7e4c7;
  cursor: not-allowed;
}

.filter-column {
  display: grid;
  gap: 20px;
}

.filter-card {
  padding: 20px;
}

.filter-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.week-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.week-buttons button {
  height: 26px;
  padding: 0 11px;
  border: 1px solid #d7e4f3;
  border-radius: 4px;
  background: #eef4fb;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.week-buttons button.active {
  border-color: #1e3a8a;
  background: #1e3a8a;
  color: white;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
}

.check-row input {
  accent-color: #1e3a8a;
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
  .materials-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .material-row {
    grid-template-columns: 52px 1fr;
  }

  .material-actions {
    grid-column: 1 / -1;
    margin-top: 12px;
    flex-wrap: wrap;
  }
}
</style>