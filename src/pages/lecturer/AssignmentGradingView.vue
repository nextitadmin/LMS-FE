<template>
  <section class="grading-page">
    <div class="grading-top">
      <div>
        <p class="grading-crumb">{{ course.code }} — {{ assignment.title }}</p>

        <h1>Grading: {{ submission.studentName }}</h1>

        <p class="grading-meta">
          <span v-if="submission.status === 'Pending'">Pending submission</span>
          <span v-else>Submitted {{ submission.submittedAt }}</span>
          <span>·</span>
          <span v-if="assignment.type === 'grouped'">
            {{ submission.studentName }} submission
          </span>
          <span v-else>Student submission</span>
        </p>
      </div>

      <div class="nav-actions">
        <button type="button" @click="$emit('previous')">←</button>
        <button type="button" @click="$emit('next')">→</button>
      </div>
    </div>

    <div class="grading-layout">
      <main>
        <section class="submitted-work-card">
          <h2>SUBMITTED WORK</h2>

          <h3>{{ submittedWork.title }}</h3>

          <div class="submission-divider"></div>

          <article
            v-for="section in submittedWork.sections"
            :key="section.heading"
            class="submitted-section"
          >
            <h4>{{ section.heading }}</h4>
            <p>{{ section.body }}</p>
          </article>
        </section>

        <div class="submission-file-actions">
          <button type="button" class="view-pdf-btn">View Full PDF</button>
          <button type="button" class="download-submission-btn">Download</button>
        </div>
      </main>

      <aside class="grading-side">
        <section class="score-card">
          <h2>SCORE</h2>

          <div class="score-line">
            <input
              v-model.number="scoreDraft"
              type="number"
              min="0"
              :max="assignment.totalMarks"
              :disabled="submission.status === 'Pending'"
              @input="clampScore"
            />
            <span>/{{ assignment.totalMarks }}</span>
          </div>

          <input
            v-model.number="scoreDraft"
            class="score-slider"
            type="range"
            min="0"
            :max="assignment.totalMarks"
            :disabled="submission.status === 'Pending'"
          />

          <p>{{ percentage }}% - {{ scoreLabel }}</p>
        </section>

        <section v-if="assignment.type === 'grouped'" class="apply-card">
          <h2>Applying Grade to:</h2>

          <article v-for="member in groupMembers" :key="member.matric">
            <span class="member-avatar">{{ member.initials }}</span>

            <div>
              <strong>{{ member.name }}</strong>
              <small>{{ member.matric }}</small>
            </div>

            <em v-if="member.leader">LEADER</em>
          </article>
        </section>

        <section class="feedback-card">
          <h2>Feedback</h2>

          <textarea
            v-model.trim="feedbackDraft"
            :disabled="submission.status === 'Pending'"
            placeholder="Enter feedback for this submission..."
          ></textarea>
        </section>

        <button
          type="button"
          class="save-grade-main-btn"
          :disabled="submission.status === 'Pending'"
          @click="saveGrade"
        >
          Save Grade →
        </button>

        <p v-if="saveMessage" class="save-message">{{ saveMessage }}</p>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  assignment: {
    type: Object,
    required: true,
  },
  submission: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save", "previous", "next"]);

const scoreDraft = ref(Number(props.submission.score) || 0);
const feedbackDraft = ref(props.submission.feedback || "");
const saveMessage = ref("");

const submittedWork = computed(() => {
  return (
    props.submission.submittedWork || {
      title: props.assignment.title,
      sections: [],
    }
  );
});

const groupMembers = computed(() => props.submission.members || []);

const percentage = computed(() => {
  const total = Number(props.assignment.totalMarks) || 1;
  const score = Number(scoreDraft.value) || 0;
  return Math.round((score / total) * 100);
});

const scoreLabel = computed(() => {
  if (props.submission.status === "Pending") return "Not Submitted";
  if (percentage.value >= 80) return "Excellent";
  if (percentage.value >= 70) return "Very Good";
  if (percentage.value >= 60) return "Good";
  if (percentage.value >= 50) return "Fair";
  return "Needs Improvement";
});

watch(
  () => props.submission.id,
  () => {
    scoreDraft.value = Number(props.submission.score) || 0;
    feedbackDraft.value = props.submission.feedback || "";
    saveMessage.value = "";
  }
);

function clampScore() {
  const max = Number(props.assignment.totalMarks) || 0;

  if (Number(scoreDraft.value) < 0) scoreDraft.value = 0;
  if (Number(scoreDraft.value) > max) scoreDraft.value = max;
}

function saveGrade() {
  clampScore();

  emit("save", {
    submissionId: props.submission.id,
    score: scoreDraft.value,
    feedback: feedbackDraft.value,
  });

  saveMessage.value =
    props.assignment.type === "grouped"
      ? "Group grade saved. All group members received the same score."
      : "Grade saved successfully.";
}
</script>

<style scoped>
.grading-page {
  color: #0f172a;
}

.grading-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.grading-crumb {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.grading-top h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 900;
}

.grading-meta {
  display: flex;
  gap: 10px;
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.nav-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.nav-actions button {
  width: 42px;
  height: 34px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 16px;
  font-weight: 900;
}

.nav-actions button:last-child {
  background: #16a34a;
  color: white;
}

.grading-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 335px;
  gap: 20px;
}

.submitted-work-card,
.score-card,
.apply-card,
.feedback-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #f8fbff;
}

.submitted-work-card {
  min-height: 302px;
  padding: 26px 24px;
}

.submitted-work-card h2 {
  margin: 0 0 24px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 900;
}

.submitted-work-card h3 {
  margin: 0 0 16px;
  color: #111827;
  font-size: 15px;
  font-weight: 900;
}

.submission-divider {
  height: 1px;
  margin-bottom: 24px;
  background: #e2e8f0;
}

.submitted-section {
  margin-bottom: 26px;
}

.submitted-section h4 {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.submitted-section p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
}

.submission-file-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.view-pdf-btn,
.download-submission-btn {
  height: 28px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.view-pdf-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.download-submission-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.grading-side {
  display: grid;
  gap: 20px;
  align-content: start;
}

.score-card {
  padding: 22px 20px;
  text-align: center;
}

.score-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
}

.score-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.score-line input {
  width: 74px;
  border: 0;
  border-bottom: 1px solid #86efac;
  background: transparent;
  color: #0875f5;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  outline: 0;
}

.score-line span {
  color: #64748b;
  font-size: 13px;
}

.score-slider {
  width: 100%;
  accent-color: #16a34a;
}

.score-card p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 11px;
}

.apply-card,
.feedback-card {
  padding: 20px;
}

.apply-card h2,
.feedback-card h2 {
  margin: 0 0 16px;
  color: #334155;
  font-size: 15px;
  font-weight: 900;
}

.apply-card article {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #16a34a;
  color: white;
  font-size: 11px;
  font-weight: 900;
}

.apply-card article:nth-of-type(1) .member-avatar {
  background: #8b5cf6;
}

.apply-card article:nth-of-type(3) .member-avatar {
  background: #f59e0b;
}

.apply-card strong {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.apply-card small {
  color: #94a3b8;
  font-size: 11px;
}

.apply-card em {
  padding: 5px 8px;
  border: 1px solid #fdba74;
  border-radius: 4px;
  color: #f59e0b;
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
}

.feedback-card textarea {
  width: 100%;
  min-height: 118px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  color: #64748b;
  resize: vertical;
  outline: 0;
}

.save-grade-main-btn {
  height: 42px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

.save-grade-main-btn:disabled,
.score-line input:disabled,
.score-slider:disabled,
.feedback-card textarea:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.save-message {
  margin: -8px 0 0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 1000px) {
  .grading-layout {
    grid-template-columns: 1fr;
  }

  .grading-top {
    flex-direction: column;
  }
}
</style>