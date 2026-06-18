<template>
  <section class="student-discussion-page">
    <div class="discussion-layout">
      <main class="discussion-feed">
        <article
          v-for="post in discussions"
          :key="post.id"
          class="post-card"
        >
          <div class="post-header">
            <div class="avatar" :class="post.authorRole">
              {{ post.initials }}
            </div>

            <div class="post-author">
              <strong>{{ post.authorName }}</strong>
              <span>{{ post.timeLabel }}</span>
            </div>

            <span class="post-type" :class="post.type.toLowerCase()">
              {{ post.type }}
            </span>
          </div>

          <p class="post-body">{{ post.body }}</p>

          <section v-if="post.replies?.length" class="reply-list">
            <article
              v-for="reply in post.replies"
              :key="reply.id"
              class="reply-card"
            >
              <div class="reply-avatar" :class="reply.authorRole">
                {{ reply.initials }}
              </div>

              <div>
                <strong>{{ reply.authorName }}</strong>
                <p>{{ reply.body }}</p>
              </div>
            </article>
          </section>

          <div class="post-actions">
            <button
              type="button"
              class="like-btn"
              :class="{ active: post.liked }"
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
          </div>

          <form
            v-if="replyTarget?.id === post.id"
            class="reply-form"
            @submit.prevent="submitReply(post)"
          >
            <textarea
              v-model.trim="replyText"
              placeholder="Write your reply..."
            ></textarea>

            <div>
              <button type="button" class="cancel-btn" @click="cancelReply">
                Cancel
              </button>

              <button type="submit" class="send-btn">
                Send Reply
              </button>
            </div>
          </form>
        </article>

        <div v-if="discussions.length === 0" class="empty-card">
          <h2>No discussion yet</h2>
          <p>Ask a question or share something with the class.</p>
        </div>
      </main>

      <aside class="discussion-side">
        <section class="quick-reply-card">
          <h2>Quick Reply</h2>

          <textarea
            v-model.trim="quickPostText"
            placeholder="Share a question or insight..."
          ></textarea>

          <button type="button" @click="submitQuickPost">
            Post
          </button>

          <p v-if="formError" class="error-message">{{ formError }}</p>
        </section>

        <section class="boards-card">
          <h2>Other Course Boards</h2>

          <button
            v-for="board in studentStore.courseBoards"
            :key="board.id"
            type="button"
            class="board-row"
          >
            <span class="board-icon" :class="board.color"></span>

            <strong>{{ board.code }}</strong>

            <em :class="{ muted: board.newPosts === 'no new' }">
              {{ board.newPosts }}
            </em>
          </button>
        </section>
      </aside>
    </div>

    <button type="button" class="floating-new-post" @click="newPostOpen = true">
      + New Post
    </button>

    <div v-if="newPostOpen" class="modal-backdrop">
      <section class="new-post-modal">
        <button type="button" class="modal-close" @click="closeNewPost">
          ×
        </button>

        <h2>New Discussion Post</h2>
        <p>Ask a question or share something with class</p>

        <form @submit.prevent="submitNewPost">
          <label class="form-label">
            Course
            <select v-model="newPost.courseId" class="form-control">
              <option :value="courseId">{{ course?.code }} - {{ course?.title }}</option>
            </select>
          </label>

          <label class="form-label">
            Post Type
            <select v-model="newPost.type" class="form-control">
              <option>Question</option>
              <option>Announcement</option>
              <option>General</option>
            </select>
          </label>

          <label class="form-label">
            Your Post
            <textarea
              v-model.trim="newPost.body"
              class="post-textarea"
              placeholder="What do you wanna ask or share?"
            ></textarea>
          </label>

          <p v-if="modalError" class="error-message">{{ modalError }}</p>

          <div class="modal-actions">
            <button type="button" class="cancel-post-btn" @click="closeNewPost">
              Cancel
            </button>

            <button type="submit" class="submit-post-btn">
              Post
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const studentStore = useStudentStore();

const quickPostText = ref("");
const formError = ref("");
const modalError = ref("");
const replyTarget = ref(null);
const replyText = ref("");
const newPostOpen = ref(false);

const courseId = computed(() => String(route.params.courseId || ""));
const course = computed(() => studentStore.getCourseById(courseId.value));

const discussions = computed(() =>
  studentStore.getDiscussionsByCourse(courseId.value)
);

const newPost = reactive({
  courseId: courseId.value,
  type: "Question",
  body: "",
});

function toggleLike(postId) {
  studentStore.toggleDiscussionLike(postId);
}

function submitQuickPost() {
  const result = studentStore.createDiscussionPost({
    courseId: courseId.value,
    type: "Question",
    body: quickPostText.value,
  });

  if (!result.success) {
    formError.value = result.message;
    return;
  }

  quickPostText.value = "";
  formError.value = "";
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
  if (!replyText.value) {
    formError.value = "Reply cannot be empty.";
    return;
  }

  post.replies.push({
    id: `reply-${Date.now()}`,
    authorName: studentStore.currentStudent.name,
    authorRole: "student",
    initials: studentStore.currentStudent.initials,
    body: replyText.value,
    timeLabel: "Now",
  });

  studentStore.persist();
  cancelReply();
}

function closeNewPost() {
  newPostOpen.value = false;
  newPost.type = "Question";
  newPost.body = "";
  modalError.value = "";
}

function submitNewPost() {
  const result = studentStore.createDiscussionPost({
    courseId: courseId.value,
    type: newPost.type,
    body: newPost.body,
  });

  if (!result.success) {
    modalError.value = result.message;
    return;
  }

  closeNewPost();
}
</script>

<style scoped>
.student-discussion-page {
  position: relative;
  color: #0f172a;
}

.discussion-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.discussion-feed,
.quick-reply-card,
.boards-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.discussion-feed {
  min-height: 500px;
  padding: 24px;
}

.post-card {
  padding-bottom: 26px;
  margin-bottom: 26px;
  border-bottom: 1px solid #edf2f7;
}

.post-card:last-child {
  margin-bottom: 0;
  border-bottom: 0;
}

.post-header {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.avatar,
.reply-avatar {
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  font-weight: 900;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #1e3a8a;
}

.avatar.lecturer,
.reply-avatar.lecturer {
  background: #f59e0b;
}

.post-author strong {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.post-author span {
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
  margin: 0 0 14px;
  color: #334155;
  font-size: 13.5px;
  line-height: 1.55;
}

.reply-list {
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

.post-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.like-btn,
.reply-btn {
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

.reply-form {
  margin-top: 12px;
}

.reply-form textarea {
  width: 100%;
  min-height: 74px;
  border: 1px solid #cbd8ea;
  border-radius: 8px;
  padding: 12px;
  outline: 0;
  resize: vertical;
}

.reply-form div {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-btn,
.send-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.cancel-btn {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.send-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.discussion-side {
  display: grid;
  gap: 20px;
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

.board-icon.blue {
  background: #dbeafe;
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

.board-row em.muted {
  border-color: #cbd5e1;
  color: #64748b;
}

.floating-new-post {
  position: fixed;
  right: 42px;
  bottom: 34px;
  z-index: 20;
  height: 38px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 14px 28px rgba(22, 163, 74, 0.25);
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

.new-post-modal {
  position: relative;
  width: min(555px, 100%);
  max-height: 92vh;
  overflow: auto;
  padding: 32px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.new-post-modal h2 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 900;
}

.new-post-modal > p {
  margin: 0 0 24px;
  color: #64748b;
  font-size: 13px;
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 20px;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 25px;
}

.form-label {
  display: block;
  margin-bottom: 18px;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.form-control,
.post-textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 4px;
  background: white;
  color: #334155;
  outline: 0;
  font-size: 13px;
}

.form-control {
  height: 34px;
  padding: 0 10px;
}

.post-textarea {
  min-height: 104px;
  padding: 12px;
  resize: vertical;
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

.error-message {
  margin: 10px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 900;
}

.empty-card {
  min-height: 300px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
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
  .discussion-layout {
    grid-template-columns: 1fr;
  }
}
</style>