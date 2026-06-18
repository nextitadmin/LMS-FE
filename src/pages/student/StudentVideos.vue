<template>
  <section class="student-videos-page">
    <div v-if="videos.length" class="videos-layout">
      <main>
        <section class="player-card">
          <div class="video-stage">
            <button type="button" class="play-button" @click="togglePlay">
              <Play v-if="!isPlaying" :size="48" fill="currentColor" />
              <Pause v-else :size="48" fill="currentColor" />
            </button>

            <div class="video-caption">
              <h2>{{ selectedVideo.fullTitle }}</h2>
              <p>
                {{ course?.code }} · {{ selectedVideo.lecturer }} · Week
                {{ selectedVideo.week }}
              </p>
            </div>
          </div>

          <div class="video-controls">
            <button type="button" @click="togglePlay">
              <Play v-if="!isPlaying" :size="16" />
              <Pause v-else :size="16" />
            </button>

            <span>{{ selectedVideo.currentTime }}</span>

            <input
              v-model.number="progress"
              type="range"
              min="0"
              max="100"
            />

            <span>{{ selectedVideo.duration }}</span>

            <button type="button" class="speed-btn" @click="cycleSpeed">
              {{ speed }}x
            </button>

            <button
              type="button"
              class="download-video"
              :disabled="!selectedVideo.allowDownload"
            >
              Download
            </button>

            <button type="button">
              <Maximize2 :size="16" />
            </button>
          </div>
        </section>

        <section class="about-card">
          <h2>About this lecture</h2>
          <p>{{ selectedVideo.description }}</p>
          <span>Week {{ selectedVideo.week }}</span>
        </section>
      </main>

      <aside class="playlist-card">
        <h2>All Videos ({{ videos.length }})</h2>

        <button
          v-for="(video, index) in videos"
          :key="video.id"
          type="button"
          class="playlist-item"
          :class="{ active: selectedVideo.id === video.id }"
          @click="selectVideo(video)"
        >
          <span>{{ index + 1 }}</span>

          <div>
            <strong>{{ video.title }}</strong>
            <small>
              {{ video.duration }}
              <template v-if="selectedVideo.id === video.id">
                · ▶ Playing
              </template>
              <template v-else>
                · Week {{ video.week }}
              </template>
            </small>
          </div>
        </button>
      </aside>
    </div>

    <div v-else class="empty-card">
      <h2>No videos available</h2>
      <p>Your lecturer has not uploaded videos for this course yet.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Maximize2, Pause, Play } from "lucide-vue-next";

import { useStudentStore } from "../../stores/student.store";

const route = useRoute();
const studentStore = useStudentStore();

const isPlaying = ref(false);
const progress = ref(38);
const speed = ref(1);
const selectedVideo = ref(null);

const courseId = computed(() => String(route.params.courseId || ""));
const course = computed(() => studentStore.getCourseById(courseId.value));
const videos = computed(() => studentStore.getVideosByCourse(courseId.value));

watch(
  videos,
  (items) => {
    selectedVideo.value = items[0] || null;
  },
  { immediate: true }
);

function selectVideo(video) {
  selectedVideo.value = video;
  isPlaying.value = false;
  progress.value = 0;
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
}

function cycleSpeed() {
  const speeds = [1, 1.25, 1.5, 2];
  const currentIndex = speeds.indexOf(speed.value);
  speed.value = speeds[(currentIndex + 1) % speeds.length];
}
</script>

<style scoped>
.student-videos-page {
  color: #0f172a;
}

.videos-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.player-card,
.playlist-card,
.about-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #ffffff;
}

.player-card {
  overflow: hidden;
}

.video-stage {
  position: relative;
  height: 430px;
  background: #0f172a;
}

.play-button {
  position: absolute;
  inset: 0;
  width: 82px;
  height: 82px;
  display: grid;
  place-items: center;
  margin: auto;
  border: 0;
  border-radius: 999px;
  background: #dbeafe;
  color: #0f172a;
}

.video-caption {
  position: absolute;
  left: 24px;
  bottom: 30px;
  color: white;
}

.video-caption h2 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
}

.video-caption p {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.video-controls {
  height: 62px;
  display: grid;
  grid-template-columns: 34px 46px 1fr 50px 48px 88px 34px;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
}

.video-controls button {
  border: 0;
  background: transparent;
  color: #0f172a;
}

.video-controls input {
  accent-color: #16a34a;
}

.speed-btn {
  height: 25px;
  border: 1px solid #94a3b8 !important;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
}

.download-video {
  height: 25px;
  border-radius: 4px !important;
  background: #b7e4c7 !important;
  color: white !important;
  font-size: 11px;
  font-weight: 800;
}

.download-video:not(:disabled) {
  background: #16a34a !important;
}

.about-card {
  margin-top: 24px;
  padding: 24px;
}

.about-card h2,
.playlist-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.about-card p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.about-card span {
  display: inline-flex;
  height: 23px;
  align-items: center;
  padding: 0 8px;
  border: 1px solid #0875f5;
  border-radius: 4px;
  color: #0875f5;
  font-size: 11px;
}

.playlist-card {
  padding: 20px;
}

.playlist-item {
  width: 100%;
  min-height: 68px;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
  align-items: center;
  border: 0;
  border-bottom: 1px solid #edf2f7;
  background: white;
  text-align: left;
}

.playlist-item:last-child {
  border-bottom: 0;
}

.playlist-item > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 900;
}

.playlist-item.active > span {
  background: #1e3a8a;
  color: white;
}

.playlist-item strong {
  display: block;
  margin-bottom: 5px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.playlist-item small {
  color: #64748b;
  font-size: 12px;
}

.empty-card {
  min-height: 360px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
  color: #64748b;
}

.empty-card h2 {
  margin: 0;
  color: #334155;
}

.empty-card p {
  margin: 0;
}

@media (max-width: 1120px) {
  .videos-layout {
    grid-template-columns: 1fr;
  }
}
</style>