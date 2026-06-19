<template>
  <section v-if="assignment" class="assignment-view-page">
    <button type="button" class="back-btn" @click="goBack">
      ← Back to Assignments
    </button>

    <div class="assignment-layout">
      <main class="assignment-main">
        <section class="assignment-card">
          <div class="assignment-top">
            <div>
              <h1>{{ assignment.title }}</h1>
              <p>{{ assignment.courseCode }} · Due {{ assignment.due }}</p>
            </div>

            <span class="status-pill" :class="statusClass">
              {{ assignment.status }}
            </span>
          </div>

          <div class="instruction-box">
            <h2>Instructions</h2>
            <p>{{ assignment.instructions }}</p>
          </div>

          <section v-if="assignment.type === 'group'" class="group-section">
            <template v-if="!group">
              <h2>Group Assignment</h2>
              <p class="muted-text">
                Create a group and invite classmates, or join an existing group
                using an invite code.
              </p>

              <div class="group-actions">
                <button type="button" class="create-group-btn" @click="createGroup">
                  Create Group Manually
                </button>

                <button type="button" class="join-group-btn" @click="joinModalOpen = true">
                  Join Group
                </button>
              </div>
            </template>

            <template v-else>
              <div class="group-header">
                <div>
                  <h2>{{ group.name }}</h2>
                  <p>
                    {{ group.members.length }}/{{ group.maxMembers }} members
                    <span>·</span>
                    {{ assignment.isLeader ? "Leader View" : "Member View" }}
                  </p>
                </div>

                <button
                  v-if="assignment.isLeader"
                  type="button"
                  class="copy-code-btn"
                  @click="copyInviteCode"
                >
                  Copy Code: {{ group.inviteCode }}
                </button>
              </div>

              <div class="members-list">
                <article v-for="member in group.members" :key="member.id" class="member-row">
                  <span class="member-avatar">{{ member.initials }}</span>

                  <div>
                    <strong>{{ member.name }}</strong>
                    <small>{{ member.matricNo }}</small>
                  </div>

                  <em v-if="member.leader">LEADER</em>
                </article>
              </div>

              <p v-if="!assignment.isLeader" class="member-warning">
                Only your group leader can upload and submit the final group work.
              </p>
            </template>
          </section>

          <section
            v-if="assignment.type === 'individual' || assignment.isLeader"
            class="submission-box"
          >
            <h2>Submit Assignment</h2>

            <button
              type="button"
              class="upload-zone"
              :class="{ active: selectedFileName || assignment.submittedFileName }"
              @click="fileInput?.click()"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <UploadCloud :size="34" />
              <strong>
                {{ selectedFileName || assignment.submittedFileName || "Drag file here or click to browse" }}
              </strong>
              <span>{{ assignment.fileTypes }} · Max {{ assignment.maxSize }}</span>
            </button>

            <input
              ref="fileInput"
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              @change="handleFileSelect"
            />

            <label class="form-label">
              Comments
              <textarea
                v-model.trim="comments"
                class="comment-box"
                placeholder="Add a comment for your lecturer..."
              ></textarea>
            </label>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

            <div class="submit-actions">
              <button type="button" class="draft-btn" @click="saveDraft">
                Save Draft
              </button>

              <button type="button" class="submit-btn" @click="submitAssignment">
                Submit Assignment
              </button>
            </div>
          </section>
        </section>
      </main>

      <aside class="assignment-side">
        <section class="side-card">
          <h2>Submission Requirements</h2>

          <div class="requirement-row">
            <span>File Types</span>
            <strong>{{ assignment.fileTypes }}</strong>
          </div>

          <div class="requirement-row">
            <span>Max Size</span>
            <strong>{{ assignment.maxSize }}</strong>
          </div>

          <div class="requirement-row">
            <span>Score</span>
            <strong>
              {{ assignment.score || "-" }}/{{ assignment.maxScore }}
            </strong>
          </div>
        </section>

        <section class="side-card">
          <h2>Previous Submission</h2>

          <article
            v-for="submission in previousSubmissions"
            :key="submission.id"
            class="previous-row"
          >
            <div class="previous-icon">
              <FileCheck2 :size="17" />
            </div>

            <div>
              <strong>{{ submission.title }}</strong>
              <span>{{ submission.subtitle }}</span>
            </div>
          </article>
        </section>
      </aside>
    </div>

    <div v-if="joinModalOpen" class="modal-backdrop">
      <section class="join-modal">
        <button type="button" class="modal-close" @click="closeJoinModal">×</button>

        <h2>Join Group</h2>
        <p>Enter the invite code shared by your group leader.</p>

        <input
          v-model.trim="joinCode"
          class="join-input"
          placeholder="e.g. DBX-892"
        />

        <p v-if="joinError" class="error-message">{{ joinError }}</p>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeJoinModal">
            Cancel
          </button>

          <button type="button" class="submit-btn" @click="joinGroup">
            Join Group
          </button>
        </div>
      </section>
    </div>
  </section>

  <section v-else class="empty-state">
    <h1>Assignment not found</h1>
    <button type="button" class="back-btn" @click="goBack">
      Back to Assignments
    </button>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FileCheck2, UploadCloud } from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();

const fileInput = ref(null);
const selectedFileName = ref("");
const comments = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const joinModalOpen = ref(false);
const joinCode = ref("");
const joinError = ref("");

const courseId = computed(() => String(route.params.courseId || ""));
const assignmentId = computed(() => String(route.params.assignmentId || ""));

const assignment = computed(() =>
  studentStore.getAssignmentById(assignmentId.value)
);

const group = computed(() =>
  studentStore.getGroupForAssignment(assignmentId.value)
);

const previousSubmissions = computed(() =>
  studentStore.previousSubmissions.filter(
    (item) => item.courseId === courseId.value
  )
);

const statusClass = computed(() => {
  if (assignment.value?.status === "Graded") return "graded";
  if (assignment.value?.status === "Submitted") return "submitted";
  return "due";
});

watch(
  assignment,
  (value) => {
    if (!value) return;
    comments.value = value.comments || "";
    selectedFileName.value = "";
  },
  { immediate: true }
);

function goBack() {
  router.push(`/student/my-courses/${courseId.value}/assignments`);
}

function handleFileSelect(event) {
  acceptFile(event.target.files?.[0]);
  event.target.value = "";
}

function handleDrop(event) {
  acceptFile(event.dataTransfer.files?.[0]);
}

function acceptFile(file) {
  if (!file) return;

  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowed.includes(file.type)) {
    errorMessage.value = "Only PDF, DOC and DOCX files are allowed.";
    successMessage.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = "File cannot exceed 10 MB.";
    successMessage.value = "";
    return;
  }

  selectedFileName.value = file.name;
  errorMessage.value = "";
}

function saveDraft() {
  if (!assignment.value) return;

  const result = studentStore.saveSubmissionDraft(assignment.value.id, {
    comments: comments.value,
    fileName: selectedFileName.value || assignment.value.submittedFileName,
  });

  if (!result.success) {
    errorMessage.value = result.message;
    successMessage.value = "";
    return;
  }

  errorMessage.value = "";
  successMessage.value = "Draft saved successfully.";
}

function submitAssignment() {
  if (!assignment.value) return;

  if (!selectedFileName.value && !assignment.value.submittedFileName) {
    errorMessage.value = "Please upload your assignment file.";
    successMessage.value = "";
    return;
  }

  const result = studentStore.submitAssignment(assignment.value.id, {
    comments: comments.value,
    fileName: selectedFileName.value || assignment.value.submittedFileName,
  });

  if (!result.success) {
    errorMessage.value = result.message;
    successMessage.value = "";
    return;
  }

  errorMessage.value = "";
  successMessage.value = "Assignment submitted successfully.";
}

function createGroup() {
  if (!assignment.value) return;

  const result = studentStore.createGroup(assignment.value.id);

  if (!result.success) {
    errorMessage.value = result.message;
    successMessage.value = "";
    return;
  }

  successMessage.value = "Group created successfully.";
}

function closeJoinModal() {
  joinModalOpen.value = false;
  joinCode.value = "";
  joinError.value = "";
}

function joinGroup() {
  if (!assignment.value) return;

  const result = studentStore.joinGroup(assignment.value.id, joinCode.value);

  if (!result.success) {
    joinError.value = result.message;
    return;
  }

  closeJoinModal();
  successMessage.value = "You joined the group successfully.";
}

async function copyInviteCode() {
  if (!group.value?.inviteCode) return;

  try {
    await navigator.clipboard.writeText(group.value.inviteCode);
    successMessage.value = "Invite code copied.";
  } catch {
    successMessage.value = `Invite code: ${group.value.inviteCode}`;
  }
}
</script>

<style scoped>
.assignment-view-page {
  color: #0f172a;
}

.back-btn {
  height: 32px;
  margin-bottom: 20px;
  padding: 0 15px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 13px;
  font-weight: 900;
}

.assignment-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.assignment-card,
.side-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.assignment-card {
  padding: 24px;
}

.assignment-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.assignment-top h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 900;
}

.assignment-top p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.status-pill {
  height: 27px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.status-pill.graded {
  color: #16a34a;
  background: #dcfce7;
}

.status-pill.submitted {
  color: #0875f5;
  background: #dbeafe;
}

.status-pill.due {
  color: #ef4444;
  background: #fee2e2;
}

.instruction-box,
.group-section,
.submission-box {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #edf2f7;
  border-radius: 12px;
  background: #f8fafc;
}

.instruction-box h2,
.group-section h2,
.submission-box h2,
.side-card h2 {
  margin: 0 0 14px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.instruction-box p,
.muted-text {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.group-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.create-group-btn,
.join-group-btn,
.copy-code-btn,
.draft-btn,
.submit-btn,
.cancel-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.create-group-btn,
.submit-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.join-group-btn,
.copy-code-btn,
.draft-btn,
.cancel-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.group-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.group-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
}

.members-list {
  display: grid;
  gap: 12px;
}

.member-row {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  background: white;
}

.member-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #16a34a;
  color: white;
  font-size: 12px;
  font-weight: 900;
}

.member-row strong {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.member-row small {
  color: #64748b;
  font-size: 11px;
}

.member-row em {
  padding: 5px 8px;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  color: #f59e0b;
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
}

.member-warning {
  margin: 16px 0 0;
  color: #ef4444;
  font-size: 12px;
  font-weight: 800;
}

.upload-zone {
  width: 100%;
  min-height: 148px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 7px;
  border: 1px dashed #334155;
  border-radius: 8px;
  background: white;
  color: #334155;
  text-align: center;
}

.upload-zone.active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.upload-zone strong {
  font-size: 13px;
  font-weight: 900;
}

.upload-zone span {
  color: #64748b;
  font-size: 12px;
}

.form-label {
  display: block;
  margin-top: 18px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.comment-box {
  width: 100%;
  min-height: 90px;
  margin-top: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 6px;
  padding: 12px;
  color: #334155;
  outline: 0;
  resize: vertical;
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.assignment-side {
  display: grid;
  gap: 20px;
}

.side-card {
  padding: 20px;
}

.requirement-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #64748b;
  font-size: 13px;
}

.requirement-row strong {
  color: #334155;
}

.previous-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 58px;
  border-bottom: 1px solid #edf2f7;
}

.previous-row:last-child {
  border-bottom: 0;
}

.previous-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: #dcfce7;
  color: #16a34a;
}

.previous-row strong {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.previous-row span {
  color: #64748b;
  font-size: 10px;
}

.error-message {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 900;
}

.success-message {
  margin: 12px 0 0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 900;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
}

.join-modal {
  position: relative;
  width: min(430px, 100%);
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.join-modal h2 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
}

.join-modal p {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 13px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 18px;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 24px;
}

.join-input {
  width: 100%;
  height: 38px;
  border: 1px solid #cbd8ea;
  border-radius: 6px;
  padding: 0 12px;
  color: #334155;
  outline: 0;
  text-transform: uppercase;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.empty-state {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
}

.empty-state h1 {
  margin: 0;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
}

@media (max-width: 1120px) {
  .assignment-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .assignment-top,
  .group-header {
    flex-direction: column;
  }

  .member-row {
    grid-template-columns: 38px 1fr;
  }

  .member-row em {
    grid-column: 2;
    width: max-content;
  }
}
</style>