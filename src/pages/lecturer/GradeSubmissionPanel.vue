<template>
  <section class="grade-submission-page">
    <div class="grade-heading">
      <div>
        <p class="crumb">{{ course.code }} — {{ assignment.title }}</p>
        <h1>
          Grading:
          {{ submission.studentName }}
        </h1>
        <p class="meta">
          {{ submission.status === "Pending" ? "Pending submission" : "Submitted 2 hrs ago" }}
          ·
          {{ assignment.type === "grouped" ? "Group submission" : "Individual submission" }}
        </p>
      </div>

      <button type="button" class="back-btn" @click="$emit('back')">← Back</button>
    </div>

    <div class="grade-layout">
      <main>
        <section class="submitted-card">
          <h2>SUBMITTED WORK</h2>

          <h3>ACID Properties in Database Transaction Management</h3>

          <hr />

          <p>
            <strong>1. Introduction</strong><br />
            Transaction management is a fundamental aspect of any robust DBMS.
            ACID properties ensure database integrity even during failures or
            concurrent access scenarios...
          </p>

          <p>
            <strong>2. Atomicity</strong><br />
            Atomicity ensures all operations in a transaction succeed or none do.
            For example, a bank transfer debiting Account A must also credit
            Account B; if either fails, the whole transaction rolls back...
          </p>
        </section>

        <div class="file-actions">
          <button type="button" class="view-pdf">View Full PDF</button>
          <button type="button" class="download-file">Download</button>
        </div>
      </main>

      <aside>
        <section class="score-card">
          <h2>SCORE</h2>

          <div class="score-input-row">
            <input
              v-model.number="localScore"
              type="number"
              min="0"
              :max="assignment.totalMarks"
            />
            <span>/{{ assignment.totalMarks }}</span>
          </div>

          <input
            v-model.number="localScore"
            class="score-range"
            type="range"
            min="0"
            :max="assignment.totalMarks"
          />

          <p>{{ percentage }}% - {{ gradeLabel }}</p>
        </section>

        <section v-if="assignment.type === 'grouped'" class="group-card">
          <h2>Applying Grade to:</h2>

          <article v-for="member in groupMembers" :key="member.matric">
            <span class="avatar">{{ member.initials }}</span>

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
            v-model.trim="localFeedback"
            placeholder="Enter feedback for this submission..."
          ></textarea>
        </section>

        <button type="button" class="save-grade" @click="saveGrade">
          Save Grade →
        </button>
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

const emit = defineEmits(["save", "back"]);

const localScore = ref(Number(props.submission.score) || 0);
const localFeedback = ref(props.submission.feedback || "");

watch(
  () => props.submission.id,
  () => {
    localScore.value = Number(props.submission.score) || 0;
    localFeedback.value = props.submission.feedback || "";
  }
);

const percentage = computed(() => {
  const total = Number(props.assignment.totalMarks) || 1;
  return Math.round((Number(localScore.value || 0) / total) * 100);
});

const gradeLabel = computed(() => {
  if (percentage.value >= 80) return "Excellent";
  if (percentage.value >= 70) return "Very Good";
  if (percentage.value >= 60) return "Good";
  if (percentage.value >= 50) return "Fair";
  return "Needs Improvement";
});

const groupMembers = computed(() => {
  const members = props.submission.members || [];

  if (!members.length) {
    return [
      {
        name: "Adebayo Oluwaseun",
        matric: "CSC/2021/042",
        initials: "AO",
        leader: true,
      },
      {
        name: "Adebayo Oluwaseun",
        matric: "CSC/2021/043",
        initials: "AO",
        leader: false,
      },
      {
        name: "Adebayo Oluwaseun",
        matric: "CSC/2021/044",
        initials: "AO",
        leader: false,
      },
    ];
  }

  return members.map((member, index) => ({
    name: member.name || `Student ${index + 1}`,
    matric: member.matric || member,
    initials: member.initials || "AO",
    leader: index === 0,
  }));
});

function saveGrade() {
  emit("save", {
    submissionId: props.submission.id,
    score: localScore.value,
    feedback: localFeedback.value,
  });
}
</script>

<style scoped>
.grade-submission-page {
  color: #0f172a;
}

.grade-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.crumb {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.grade-heading h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 900;
}

.meta {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.back-btn {
  height: 34px;
  padding: 0 16px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-weight: 900;
}

.grade-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 335px;
  gap: 20px;
}

.submitted-card,
.score-card,
.group-card,
.feedback-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #f8fbff;
}

.submitted-card {
  min-height: 302px;
  padding: 26px 24px;
}

.submitted-card h2 {
  margin: 0 0 24px;
  font-size: 12px;
  font-weight: 900;
}

.submitted-card h3 {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 900;
}

.submitted-card hr {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.submitted-card p {
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
}

.file-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.view-pdf,
.download-file {
  height: 28px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.view-pdf {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.download-file {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

aside {
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

.score-input-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.score-input-row input {
  width: 72px;
  border: 0;
  border-bottom: 1px solid #86efac;
  background: transparent;
  color: #0875f5;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  outline: 0;
}

.score-input-row span {
  color: #64748b;
  font-size: 13px;
}

.score-range {
  width: 100%;
  accent-color: #16a34a;
}

.score-card p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 11px;
}

.group-card,
.feedback-card {
  padding: 20px;
}

.group-card h2,
.feedback-card h2 {
  margin: 0 0 16px;
  color: #334155;
  font-size: 15px;
  font-weight: 900;
}

.group-card article {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.avatar {
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

.group-card strong {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.group-card small {
  color: #94a3b8;
  font-size: 11px;
}

.group-card em {
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

.save-grade {
  height: 42px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

@media (max-width: 1000px) {
  .grade-layout {
    grid-template-columns: 1fr;
  }
}
</style>