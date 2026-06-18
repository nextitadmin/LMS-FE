<template>
  <section class="discussion-page">
    <div class="discussion-header">
      <div>
        <h1 class="page-title">Discussion Chat</h1>
        <p class="page-subtitle">{{ course.title }} · {{ course.code }}</p>
      </div>

      <button type="button" class="new-post-btn" @click="openNewPostModal">
        + New Post
      </button>
    </div>

    <div class="discussion-layout">
      <main class="discussion-feed-card">
        <article v-for="post in discussions" :key="post.id" class="discussion-post">
          <div class="post-top">
            <div class="author-avatar" :class="post.authorRole">
              {{ post.initials }}
            </div>

            <div class="author-meta">
              <strong>{{ post.authorName }}</strong>
              <span>{{ post.timeLabel }}</span>
            </div>

            <span class="post-type" :class="post.type.toLowerCase()">
              {{ post.type }}
            </span>
          </div>

          <p class="post-body">{{ post.body }}</p>

          <div v-if="post.targetType !== 'course'" class="target-pill">
            {{ post.targetType === "student" ? "To Student:" : "To Group:" }}
            {{ post.targetLabel }}
          </div>

          <section v-if="post.replies?.length" class="reply-stack">
            <article v-for="reply in post.replies" :key="reply.id" class="reply-card">
              <div class="reply-avatar" :class="reply.authorRole">
                {{ reply.initials }}
              </div>

              <div>
                <strong>{{ reply.authorName }}</strong>
                <p>{{ reply.body }}</p>
              </div>
            </article>
          </section>

          <div class="post-footer">
            <button
              type="button"
              class="like-btn"
              :class="{ active: post.likedByCurrentLecturer }"
              @click="toggleLike(post.id)"
            >
              👍 {{ post.likes }}
            </button>

            <button
              type="button"
              class="reply-btn"
              @click="startReply(post)"
            >
              Reply
            </button>

            <button
              v-if="post.authorRole === 'lecturer'"
              type="button"
              class="remove-post-btn"
              @click="deletePost(post.id)"
            >
              Delete
            </button>
          </div>

          <form
            v-if="replyTarget?.id === post.id"
            class="inline-reply-form"
            @submit.prevent="submitReply(post)"
          >
            <textarea
              v-model.trim="replyText"
              placeholder="Write a reply..."
            ></textarea>

            <div>
              <button type="button" class="cancel-reply-btn" @click="cancelReply">
                Cancel
              </button>

              <button type="submit" class="submit-reply-btn">
                Send Reply
              </button>
            </div>
          </form>
        </article>

        <div v-if="discussions.length === 0" class="empty-discussion">
          <h2>No discussion posts yet</h2>
          <p>Create a post or use quick reply to start the conversation.</p>
          <button type="button" class="new-post-btn" @click="openNewPostModal">
            + New Post
          </button>
        </div>
      </main>

      <aside class="discussion-side">
        <section class="quick-reply-card">
          <h2>Quick Reply</h2>

          <textarea
            v-model.trim="quickReplyText"
            placeholder="Share a question or insight..."
          ></textarea>

          <button type="button" @click="submitQuickReply">
            Post
          </button>

          <p v-if="quickReplyError" class="discussion-error">
            {{ quickReplyError }}
          </p>
        </section>

        <section class="boards-card">
          <h2>Other Course Boards</h2>

          <button
            v-for="board in otherBoards"
            :key="board.id"
            type="button"
            class="board-row"
          >
            <span class="board-icon" :class="board.theme"></span>
            <strong>{{ board.code }}</strong>
            <em>{{ board.newPosts }} new</em>
          </button>
        </section>
      </aside>
    </div>

    <div v-if="newPostModalOpen" class="modal-backdrop">
      <div class="discussion-modal">
        <div class="modal-header">
          <div>
            <h2>New Discussion Post</h2>
            <p>Ask a question or share something with class</p>
          </div>

          <button type="button" class="modal-close" @click="closeNewPostModal">
            ×
          </button>
        </div>

        <form @submit.prevent="submitPost">
          <label class="form-label">
            Course
            <select v-model="postForm.courseId" class="form-select">
              <option :value="course.id">
                {{ course.code }} - {{ course.title }}
              </option>
            </select>
          </label>

          <div class="form-two">
            <label class="form-label">
              Post Type
              <select v-model="postForm.type" class="form-select">
                <option>Question</option>
                <option>Announcement</option>
                <option>General</option>
              </select>
            </label>

            <label class="form-label">
              Send To
              <select v-model="postForm.targetType" class="form-select">
                <option value="course">Entire Course</option>
                <option value="student">Individual Student</option>
                <option value="group">Assignment Group</option>
              </select>
            </label>
          </div>

          <label v-if="postForm.targetType === 'student'" class="form-label">
            Student
            <select v-model="postForm.targetLabel" class="form-select">
              <option v-for="student in mockStudents" :key="student.matric">
                {{ student.name }} · {{ student.matric }}
              </option>
            </select>
          </label>

          <label v-if="postForm.targetType === 'group'" class="form-label">
            Group
            <select v-model="postForm.targetLabel" class="form-select">
              <option v-for="group in availableGroups" :key="group.id">
                {{ group.name }}
              </option>
            </select>
          </label>

          <label class="form-label">
            Your Post
            <textarea
              v-model.trim="postForm.body"
              class="form-textarea post-textarea"
              placeholder="What do you wanna ask or share?"
            ></textarea>
          </label>

          <p v-if="postError" class="discussion-error">
            {{ postError }}
          </p>

          <div class="modal-actions">
            <button type="button" class="cancel-post-btn" @click="closeNewPostModal">
              Cancel
            </button>

            <button type="submit" class="submit-post-btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import { useLecturerWorkspaceStore } from "../../stores/lecturerWorkspace.store";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  currentLecturer: {
    type: Object,
    required: true,
  },
  lecturerCourses: {
    type: Array,
    default: () => [],
  },
});

const workspaceStore = useLecturerWorkspaceStore();

const newPostModalOpen = ref(false);
const quickReplyText = ref("");
const quickReplyError = ref("");
const postError = ref("");
const replyTarget = ref(null);
const replyText = ref("");

const postForm = reactive({
  courseId: props.course.id,
  type: "Question",
  targetType: "course",
  targetLabel: "Entire Course",
  body: "",
});

const discussions = computed(() =>
  workspaceStore.getDiscussionsByCourse(props.course.id)
);

const otherBoards = computed(() =>
  props.lecturerCourses
    .filter((item) => item.id !== props.course.id)
    .map((item, index) => ({
      id: item.id,
      code: item.code,
      theme: index % 2 === 0 ? "purple" : "yellow",
      newPosts: item.newPosts || index + 4,
    }))
);

const mockStudents = computed(() => [
  {
    name: "Adebayo Oluwaseun",
    matric: `${props.course.code.replace(" ", "")}/2021/042`,
  },
  {
    name: "Bola Mogaji",
    matric: `${props.course.code.replace(" ", "")}/2021/057`,
  },
  {
    name: "Emeka B.",
    matric: `${props.course.code.replace(" ", "")}/2021/019`,
  },
]);

const availableGroups = computed(() => {
  return workspaceStore
    .getAssignmentsByCourse(props.course.id)
    .filter((assignment) => assignment.type === "grouped")
    .flatMap((assignment) =>
      assignment.groups.map((group) => ({
        id: `${assignment.id}-${group.id}`,
        name: `${assignment.title} · ${group.name}`,
      }))
    );
});

watch(
  () => props.course.id,
  (courseId) => {
    workspaceStore.ensureDefaultDiscussions(courseId);
    resetPostForm();
  },
  { immediate: true }
);

watch(
  () => postForm.targetType,
  () => {
    if (postForm.targetType === "course") {
      postForm.targetLabel = "Entire Course";
    }

    if (postForm.targetType === "student") {
      postForm.targetLabel = mockStudents.value[0]
        ? `${mockStudents.value[0].name} · ${mockStudents.value[0].matric}`
        : "";
    }

    if (postForm.targetType === "group") {
      postForm.targetLabel = availableGroups.value[0]?.name || "";
    }
  }
);

function resetPostForm() {
  Object.assign(postForm, {
    courseId: props.course.id,
    type: "Question",
    targetType: "course",
    targetLabel: "Entire Course",
    body: "",
  });

  postError.value = "";
}

function openNewPostModal() {
  resetPostForm();
  newPostModalOpen.value = true;
}

function closeNewPostModal() {
  newPostModalOpen.value = false;
  resetPostForm();
}

function submitPost() {
  const result = workspaceStore.createDiscussionPost({
    courseId: props.course.id,
    authorId: props.currentLecturer.id,
    authorName: props.currentLecturer.name,
    authorRole: "lecturer",
    type: postForm.type,
    targetType: postForm.targetType,
    targetLabel: postForm.targetLabel,
    body: postForm.body,
  });

  if (!result.success) {
    postError.value = result.message;
    return;
  }

  closeNewPostModal();
}

function submitQuickReply() {
  const result = workspaceStore.createQuickReply({
    courseId: props.course.id,
    authorId: props.currentLecturer.id,
    authorName: props.currentLecturer.name,
    authorRole: "lecturer",
    body: quickReplyText.value,
  });

  if (!result.success) {
    quickReplyError.value = result.message;
    return;
  }

  quickReplyText.value = "";
  quickReplyError.value = "";
}

function startReply(post) {
  replyTarget.value = post;
  replyText.value = "";
}

function cancelReply() {
  replyTarget.value = null;
  replyText.value = "";
}

function submitReply(post) {
  const result = workspaceStore.createDiscussionReply(post.id, {
    authorId: props.currentLecturer.id,
    authorName: props.currentLecturer.name,
    authorRole: "lecturer",
    body: replyText.value,
  });

  if (!result.success) {
    quickReplyError.value = result.message;
    return;
  }

  cancelReply();
}

function toggleLike(postId) {
  workspaceStore.toggleDiscussionLike(postId);
}

function deletePost(postId) {
  workspaceStore.deleteDiscussionPost(postId);
}
</script>

<style scoped>
.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.new-post-btn {
  height: 34px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

.discussion-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 335px;
  gap: 20px;
  align-items: start;
}

.discussion-feed-card,
.quick-reply-card,
.boards-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.discussion-feed-card {
  padding: 24px;
}

.discussion-post {
  padding-bottom: 26px;
  margin-bottom: 26px;
  border-bottom: 1px solid #edf2f7;
}

.discussion-post:last-child {
  margin-bottom: 0;
  border-bottom: 0;
}

.post-top {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.author-avatar,
.reply-avatar {
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  font-weight: 900;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background: #1e3a8a;
}

.author-avatar.lecturer,
.reply-avatar.lecturer {
  background: #f59e0b;
}

.author-meta strong {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.author-meta span {
  color: #94a3b8;
  font-size: 11px;
}

.post-type {
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 900;
}

.post-type.question {
  border: 1px solid #f59e0b;
  color: #b45309;
  background: #fffbeb;
}

.post-type.announcement {
  border: 1px solid #ef4444;
  color: #dc2626;
  background: #fff1f2;
}

.post-type.general {
  border: 1px solid #0875f5;
  color: #0875f5;
  background: #dbeafe;
}

.post-body {
  margin: 0 0 12px;
  color: #334155;
  font-size: 13.5px;
  line-height: 1.45;
}

.target-pill {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 10px;
  border-radius: 5px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
}

.reply-stack {
  display: grid;
  gap: 10px;
  margin: 12px 0;
}

.reply-card {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  padding: 12px 14px;
  border-left: 4px solid #16a34a;
  border-radius: 8px;
  background: #f8fafc;
}

.reply-avatar {
  width: 28px;
  height: 28px;
  background: #1e3a8a;
  font-size: 11px;
}

.reply-card strong {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 12px;
}

.reply-card p {
  margin: 0;
  color: #334155;
  font-size: 12.5px;
  line-height: 1.45;
}

.post-footer {
  display: flex;
  gap: 12px;
  align-items: center;
}

.like-btn,
.reply-btn,
.remove-post-btn {
  height: 28px;
  border: 0;
  background: transparent;
  font-size: 12px;
  font-weight: 900;
}

.like-btn {
  color: #16a34a;
}

.like-btn.active {
  color: #0f7a38;
}

.reply-btn {
  color: #0875f5;
}

.remove-post-btn {
  color: #dc2626;
}

.inline-reply-form {
  margin-top: 12px;
}

.inline-reply-form textarea {
  width: 100%;
  min-height: 74px;
  border: 1px solid #cbd8ea;
  border-radius: 8px;
  padding: 12px;
  outline: 0;
  resize: vertical;
}

.inline-reply-form div {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-reply-btn,
.submit-reply-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.cancel-reply-btn {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.submit-reply-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.quick-reply-card,
.boards-card {
  padding: 20px;
}

.quick-reply-card h2,
.boards-card h2 {
  margin: 0 0 16px;
  color: #334155;
  font-size: 15px;
  font-weight: 900;
}

.quick-reply-card textarea {
  width: 100%;
  min-height: 118px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  resize: vertical;
  outline: 0;
}

.quick-reply-card button {
  width: 100%;
  height: 34px;
  margin-top: 16px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

.boards-card {
  margin-top: 20px;
}

.board-row {
  width: 100%;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  min-height: 56px;
  border: 0;
  border-bottom: 1px solid #edf2f7;
  background: white;
  text-align: left;
}

.board-row:last-child {
  border-bottom: 0;
}

.board-icon {
  width: 32px;
  height: 32px;
  border-radius: 7px;
}

.board-icon.purple {
  background: #ddd6fe;
}

.board-icon.yellow {
  background: #fef3c7;
}

.board-row strong {
  color: #64748b;
  font-size: 13px;
}

.board-row em {
  padding: 5px 8px;
  border: 1px solid #ef4444;
  border-radius: 4px;
  color: #ef4444;
  font-size: 10px;
  font-style: normal;
}

.empty-discussion {
  min-height: 300px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  text-align: center;
}

.empty-discussion h2 {
  margin: 0;
  color: #334155;
}

.empty-discussion p {
  margin: 0 0 8px;
  color: #64748b;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
}

.discussion-modal {
  width: min(555px, 100%);
  max-height: 92vh;
  overflow: auto;
  padding: 32px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 900;
}

.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: white;
  color: #334155;
  font-size: 22px;
}

.form-two {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-label {
  display: block;
  margin-bottom: 18px;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.form-select,
.form-textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 4px;
  background: white;
  color: #334155;
  outline: 0;
  font-size: 13px;
}

.form-select {
  height: 32px;
  padding: 0 10px;
}

.form-textarea {
  min-height: 104px;
  padding: 12px;
  resize: vertical;
}

.post-textarea {
  min-height: 104px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-post-btn,
.submit-post-btn {
  height: 32px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.cancel-post-btn {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.submit-post-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.discussion-error {
  margin: 10px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 1000px) {
  .discussion-layout {
    grid-template-columns: 1fr;
  }

  .discussion-header {
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .form-two {
    grid-template-columns: 1fr;
  }

  .post-top {
    grid-template-columns: 40px 1fr;
  }

  .post-type {
    grid-column: 1 / -1;
    width: max-content;
  }
}
</style>