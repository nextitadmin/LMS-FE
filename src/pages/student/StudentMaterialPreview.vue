<template>
  <section class="material-preview-page">
    <div class="preview-top">
      <button type="button" class="back-btn" @click="goBack">
        ← Back to Materials
      </button>

      <h1>{{ material?.title || "Material Preview" }}</h1>
    </div>

    <section class="viewer-shell">
      <div class="viewer-toolbar">
        <span class="dark-box">1</span>
        <strong>/ 1</strong>

        <i></i>

        <button type="button">−</button>
        <span class="dark-box">100%</span>
        <button type="button">+</button>

        <i></i>

        <button
          type="button"
          :disabled="!material?.allowDownload"
          @click="downloadMaterial"
        >
          <Download :size="18" />
        </button>
      </div>

      <div class="viewer-body">
        <article class="document-paper">
          <h2>{{ material?.title }}</h2>

          <p>
            This preview represents the uploaded course material. When the API
            is connected, the actual uploaded document URL will be rendered here.
          </p>

          <p>
            Course materials can be previewed by students before downloading.
            Download is only enabled when the lecturer permits it.
          </p>

          <div class="paper-line"></div>
          <div class="paper-line short"></div>
          <div class="paper-line"></div>
          <div class="paper-line medium"></div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Download } from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();

const courseId = computed(() => String(route.params.courseId || ""));
const materialId = computed(() => String(route.params.materialId || ""));

const material = computed(() =>
  studentStore
    .getMaterialsByCourse(courseId.value)
    .find((item) => item.id === materialId.value)
);

function goBack() {
  router.push(`/student/my-courses/${courseId.value}/materials`);
}

function downloadMaterial() {
  if (!material.value?.allowDownload) return;

  const blob = new Blob(
    [`${material.value.title}\n\nThis is a UI demo download placeholder.`],
    { type: "text/plain;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = material.value.title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.material-preview-page {
  padding-top: 0;
}

.preview-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.back-btn {
  height: 32px;
  padding: 0 15px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 13px;
  font-weight: 900;
}

.preview-top h1 {
  margin: 0;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.viewer-shell {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  border: 1px solid #d5deeb;
  background: white;
}

.viewer-toolbar {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: #3c3c3c;
  color: white;
}

.viewer-toolbar button {
  border: 0;
  background: transparent;
  color: white;
}

.viewer-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.viewer-toolbar i {
  width: 1px;
  height: 28px;
  background: #777;
}

.dark-box {
  padding: 4px 10px;
  background: #111827;
  font-weight: 900;
}

.viewer-body {
  min-height: 760px;
  display: grid;
  place-items: start center;
  padding: 60px 24px;
  background: #f8fafc;
}

.document-paper {
  width: min(720px, 100%);
  min-height: 560px;
  padding: 60px 70px;
  background: white;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.document-paper h2 {
  margin: 0 0 24px;
  color: #111827;
  font-size: 22px;
}

.document-paper p {
  color: #334155;
  font-size: 14px;
  line-height: 1.8;
}

.paper-line {
  height: 12px;
  margin-top: 24px;
  border-radius: 999px;
  background: #e2e8f0;
}

.paper-line.short {
  width: 55%;
}

.paper-line.medium {
  width: 75%;
}
</style>