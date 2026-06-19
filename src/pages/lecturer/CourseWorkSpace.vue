<template>
  <section class="course-workspace">
    <div class="course-strip">
      <div class="course-info">
        <div class="course-icon"></div>
        <strong>{{ activeCourse.title }}</strong>
        <span>{{ activeCourse.code }}</span>
      </div>

      <nav class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ active: activeSection === tab.key }"
          @click="goToSection(tab.key)"
        >
          {{ tab.label }}
          <small v-if="tab.count" :class="tab.className">{{ tab.count }}</small>
        </button>
      </nav>
    </div>

    <section
      v-if="activeSection === 'gradebook' && selectedGradeAssignment && selectedGradeSubmission"
    >
      <AssignmentGradingView
        :course="activeCourse"
        :assignment="selectedGradeAssignment"
        :submission="selectedGradeSubmission"
        @save="handleGradeSave"
        @previous="goToPreviousSubmission"
        @next="goToNextSubmission"
      />
    </section>

    <section v-else-if="activeSection === 'gradebook'" class="empty-section">
      <h1>Grade Book</h1>
      <p>Select an assignment from the Assignments tab and click Grade.</p>
      <button type="button" class="create-assignment-btn" @click="goToSection('assignments')">
        Go to Assignments
      </button>
    </section>

    <section v-if="activeSection === 'assignments'" class="assignments-page">
      <div class="assignments-heading">
        <div>
          <h1 class="page-title">Assignments</h1>
          <p class="page-subtitle">
            Create, manage and grade assignments for {{ activeCourse.code }}
          </p>
        </div>

        <button type="button" class="create-assignment-btn" @click="openCreateAssignment">
          + Create Assignment
        </button>
      </div>

      <div class="assignment-tools">
        <div class="assignment-filters">
          <button
            v-for="filter in assignmentFilters"
            :key="filter.value"
            type="button"
            :class="{ active: assignmentFilter === filter.value }"
            @click="assignmentFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>

        <input
          v-model.trim="assignmentSearch"
          class="assignment-search"
          placeholder="Search assignments..."
        />
      </div>

      <div class="assignments-table-card">
        <table class="assignments-table">
          <thead>
            <tr>
              <th>Assignment Name</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th class="actions-th">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="assignment in filteredAssignments" :key="assignment.id">
              <td>
                <strong>{{ assignment.title }}</strong>
                <small>{{ assignment.submissionType }} · {{ assignment.totalMarks }} marks</small>
              </td>

              <td>
                <span
                  class="assignment-type-pill"
                  :class="assignment.type === 'grouped' ? 'grouped' : 'individual'"
                >
                  {{ assignment.type === "grouped" ? "Grouped" : "Individual" }}
                </span>
              </td>

              <td>
                <span>{{ formatDueDate(assignment) }}</span>
              </td>

              <td>
                {{ submittedCount(assignment.id) }}/{{ totalSubmissionCount(assignment.id) }}
              </td>

              <td>
                <span class="assignment-status">{{ assignment.status }}</span>
              </td>

              <td>
                <div class="assignment-actions">
                  <button type="button" class="view-action" @click="viewAssignment(assignment)">
                    View
                  </button>
                  <button type="button" class="edit-action" @click="editAssignment(assignment)">
                    Edit
                  </button>
                  <button type="button" class="grade-action" @click="openGradeAssignment(assignment)">
                    Grade
                  </button>
                  <button type="button" class="delete-action" @click="confirmDeleteAssignment(assignment)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredAssignments.length === 0" class="empty-assignments">
          <h2>No assignments found</h2>
          <p>Create an individual or grouped assignment for this course.</p>
          <button type="button" class="create-assignment-btn" @click="openCreateAssignment">
            + Create Assignment
          </button>
        </div>
      </div>
    </section>

    <section v-if="activeSection === 'videos'" class="videos-page">
      <div v-if="courseVideos.length" class="videos-layout">
        <main>
          <div class="video-player-card">
            <div class="video-stage">
              <video
                v-if="selectedVideo?.fileUrl"
                ref="videoRef"
                :src="selectedVideo.fileUrl"
                @timeupdate="syncVideoProgress"
                @loadedmetadata="syncVideoMeta"
              ></video>

              <button type="button" class="big-play" @click="toggleVideo">
                <Play v-if="!isPlaying" :size="46" fill="currentColor" />
                <Pause v-else :size="46" fill="currentColor" />
              </button>

              <div class="video-caption">
                <h2>{{ selectedVideo.title }}</h2>
                <p>
                  {{ activeCourse.code }} · {{ currentLecturer.name }} · Week {{ selectedVideo.week }}
                </p>
              </div>
            </div>

            <div class="video-controls">
              <button type="button" class="small-play" @click="toggleVideo">
                <Play v-if="!isPlaying" :size="16" />
                <Pause v-else :size="16" />
              </button>

              <span>{{ currentTimeLabel }}</span>

              <input
                class="video-range"
                type="range"
                min="0"
                :max="videoDuration"
                step="1"
                v-model.number="videoCurrentTime"
                @input="seekVideo"
              />

              <span>{{ durationLabel }}</span>

              <button type="button" class="speed-btn" @click="cycleSpeed">
                {{ playbackRate }}x
              </button>

              <button
                type="button"
                class="download-video-btn"
                :disabled="!selectedVideo.allowDownload"
                @click="downloadMaterial(selectedVideo)"
              >
                <Download :size="14" />
                Download
              </button>

              <button type="button" class="fullscreen-btn" @click="toggleFullscreen">
                <Maximize2 :size="16" />
              </button>
            </div>
          </div>

          <section class="about-lecture-card">
            <h2>About this lecture</h2>
            <p>{{ selectedVideo.description || "No description was provided for this lecture." }}</p>
            <span>Week {{ selectedVideo.week }}</span>
          </section>
        </main>

        <aside class="playlist-card">
          <h2>All Videos ({{ courseVideos.length }})</h2>

          <button
            v-for="(video, index) in courseVideos"
            :key="video.id"
            type="button"
            class="playlist-item"
            :class="{ active: selectedVideo?.id === video.id }"
            @click="selectVideo(video)"
          >
            <span class="playlist-number">{{ index + 1 }}</span>

            <span class="playlist-text">
              <strong>{{ video.title }}</strong>
              <small>
                {{ video.duration }}
                <template v-if="selectedVideo?.id === video.id"> · ▶ Playing</template>
                <template v-else> · Week {{ video.week }}</template>
              </small>
            </span>
          </button>
        </aside>
      </div>

      <div v-else class="empty-materials">
        <h2>No videos uploaded yet</h2>
        <p>Upload an MP4 material from the Upload tab and it will appear here.</p>
        <button type="button" class="upload-top-btn" @click="goToSection('upload')">
          + Upload Video
        </button>
      </div>
    </section>

    <section v-if="activeSection === 'materials' && !previewMaterial" class="materials-page">
      <div class="materials-title-row">
        <div>
          <h1 class="page-title">Materials</h1>
          <p class="page-subtitle">{{ activeCourse.title }} · {{ activeCourse.code }}</p>
        </div>

        <button type="button" class="upload-top-btn" @click="goToSection('upload')">
          + Upload Material
        </button>
      </div>

      <div class="materials-grid">
        <main class="materials-list">
          <article
            v-for="material in filteredMaterials"
            :key="material.id"
            class="material-item"
          >
            <div class="file-box" :class="material.type">
              <FileText :size="21" />
            </div>

            <div class="material-meta">
              <h2>{{ material.title }}</h2>
              <p>
                Week {{ material.week }}
                <span>·</span>
                {{ material.date }}
                <span>·</span>
                {{ material.size }}
              </p>
            </div>

            <div class="material-actions">
              <button type="button" class="preview-btn" @click="openPreview(material)">
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

              <button type="button" class="delete-btn" @click="removeMaterial(material.id)">
                ×
              </button>
            </div>
          </article>

          <div v-if="filteredMaterials.length === 0" class="empty-materials">
            <h2>No uploaded materials yet</h2>
            <p>Use the Upload tab to publish course materials for students.</p>
          </div>
        </main>

        <aside class="materials-side">
          <section class="side-card">
            <h2>Filter by Week</h2>

            <div class="week-buttons">
              <button
                v-for="week in weekFilters"
                :key="week.value"
                type="button"
                :class="{ active: selectedWeek === week.value }"
                @click="selectedWeek = week.value"
              >
                {{ week.label }}
              </button>
            </div>
          </section>

          <section class="side-card">
            <h2>Type</h2>

            <label v-for="type in materialTypes" :key="type" class="check-row">
              <input type="checkbox" v-model="selectedTypes" :value="type" />
              <span>{{ type }}</span>
            </label>
          </section>
        </aside>
      </div>
    </section>

    <section v-if="activeSection === 'materials' && previewMaterial" class="preview-page">
      <div class="preview-heading">
        <button type="button" class="back-btn" @click="previewMaterial = null">
          ← Back to Materials
        </button>

        <h1>{{ previewMaterial.title }}</h1>
      </div>

      <div class="viewer-shell">
        <div class="viewer-toolbar">
          <span class="dark-box">1</span>
          <strong>/ 1</strong>
          <i></i>
          <span class="dark-box">100%</span>
          <i></i>
          <button type="button" @click="downloadMaterial(previewMaterial)">
            <Download :size="18" />
          </button>
        </div>

        <iframe
          v-if="previewMaterial.type === 'pdf'"
          class="file-frame"
          :src="previewMaterial.fileUrl"
          title="PDF preview"
        ></iframe>

        <video
          v-else-if="previewMaterial.type === 'mp4'"
          class="video-preview"
          :src="previewMaterial.fileUrl"
          controls
        ></video>

        <div v-else class="unsupported-preview">
          <FileText :size="46" />
          <h2>{{ previewMaterial.title }}</h2>
          <p>This file type cannot be previewed directly in the browser.</p>

          <button
            type="button"
            class="download-large-btn"
            :disabled="!previewMaterial.allowDownload"
            @click="downloadMaterial(previewMaterial)"
          >
            Download File
          </button>
        </div>
      </div>
    </section>

    <section v-if="activeSection === 'upload'" class="upload-page">
      <div class="upload-title-row">
        <div>
          <h1 class="page-title">Upload Material</h1>
          <p class="page-subtitle">
            Published files become instantly available to enrolled students · {{ activeCourse.code }}
          </p>
        </div>

        <button type="button" class="draft-badge" @click="loadDraft">
          Saved Draft ({{ materialsStore.getDraftCount }})
        </button>
      </div>

      <div class="upload-grid">
        <form class="upload-card" @submit.prevent="publish">
          <div class="form-two">
            <label class="form-label">
              Course
              <select v-model="form.courseId" class="form-select">
                <option v-for="course in lecturerCourses" :key="course.id" :value="course.id">
                  {{ course.code }} - {{ course.title }}
                </option>
              </select>
            </label>

            <label class="form-label">
              Type
              <select v-model="form.category" class="form-select">
                <option v-for="type in materialTypes" :key="type">{{ type }}</option>
              </select>
            </label>
          </div>

          <label class="form-label">
            Title
            <input
              v-model.trim="form.title"
              class="form-input"
              placeholder="e.g. Week 10 - Concurrency Control"
            />
          </label>

          <label class="form-label">
            Description
            <textarea
              v-model.trim="form.description"
              class="form-textarea upload-textarea"
              placeholder="Brief description of this material..."
            ></textarea>
          </label>

          <div class="form-three">
            <label class="form-label">
              Week Number
              <input v-model.number="form.week" class="form-input" type="number" min="1" max="15" />
            </label>

            <label class="form-label">
              Visibility
              <select v-model="form.visibility" class="form-select">
                <option>All Students</option>
                <option>Only 300L</option>
              </select>
            </label>

            <label class="form-label">
              Allow Download
              <select v-model="form.allowDownload" class="form-select">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            class="drop-zone"
            :class="{ active: form.fileName }"
            @click="fileInput?.click()"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <FolderOpen :size="34" />
            <strong>{{ form.fileName || "Drag file here or click to browse" }}</strong>
            <span>PDF, PPTX, DOCX, MP4 - max 500 MB</span>
          </button>

          <input
            ref="fileInput"
            type="file"
            hidden
            accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.zip"
            @change="handleFileSelect"
          />

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="upload-actions">
            <button type="button" class="save-draft" @click="saveDraft">Save Draft</button>
            <button type="submit" class="publish-btn">Publish to Students</button>
          </div>
        </form>

        <aside class="recent-card">
          <h2>Recent Uploads</h2>

          <article v-for="item in recentUploads" :key="item.id" class="recent-item">
            <div class="recent-icon" :class="item.type">
              <Video v-if="item.type === 'mp4'" :size="17" />
              <FileText v-else :size="17" />
            </div>

            <div>
              <strong>{{ item.title }}</strong>
              <span>{{ item.date }}</span>
            </div>
          </article>

          <div v-if="recentUploads.length === 0" class="recent-empty">
            No uploads yet
          </div>
        </aside>
      </div>
    </section>

    <section
      v-if="!['materials', 'upload', 'videos', 'assignments', 'gradebook'].includes(activeSection)"
      class="empty-section"
    >
      <h1>{{ activeSection }}</h1>
      <p>This course section will be implemented next.</p>
    </section>

    <div v-if="assignmentModalOpen" class="modal-backdrop">
      <div class="assignment-modal">
        <div class="modal-header">
          <div>
            <h2>{{ editingAssignmentId ? "Edit Assignment" : "Create Assignment" }}</h2>
            <p>{{ activeCourse.code }} · {{ activeCourse.title }}</p>
          </div>

          <button type="button" class="modal-close" @click="closeAssignmentModal">×</button>
        </div>

        <form @submit.prevent="saveAssignment">
          <label class="form-label">
            Assignment Title
            <input
              v-model.trim="assignmentForm.title"
              class="form-input"
              placeholder="Enter assignment title"
            />
          </label>

          <label class="form-label">
            Description
            <textarea
              v-model.trim="assignmentForm.description"
              class="form-textarea assignment-description"
              placeholder="Enter assignment instructions..."
            ></textarea>
          </label>

          <div class="assignment-form-grid">
            <label class="form-label">
              Assignment Type
              <select v-model="assignmentForm.type" class="form-select">
                <option value="individual">Individual</option>
                <option value="grouped">Grouped</option>
              </select>
            </label>

            <label class="form-label">
              Submission Type
              <select v-model="assignmentForm.submissionType" class="form-select">
                <option>File Upload</option>
                <option>Text Entry</option>
                <option>File Upload + Text Entry</option>
              </select>
            </label>
          </div>

          <div class="assignment-form-grid">
            <label class="form-label">
              Total Marks
              <input
                v-model.number="assignmentForm.totalMarks"
                class="form-input"
                type="number"
                min="1"
                max="100"
              />
            </label>

            <label class="form-label">
              Due Date
              <input v-model="assignmentForm.dueDate" class="form-input" type="date" />
            </label>

            <label class="form-label">
              Due Time
              <input v-model="assignmentForm.dueTime" class="form-input" type="time" />
            </label>
          </div>

          <section v-if="assignmentForm.type === 'grouped'" class="group-settings-card">
            <h3>Group Settings</h3>

            <div class="assignment-form-grid">
              <label class="form-label">
                Group Formation Method
                <select v-model="assignmentForm.groupMethod" class="form-select">
                  <option value="student_choose">Student Choose</option>
                  <option value="system_auto">System Auto Generate</option>
                  <option value="matric_last_digit">Matriculation Last Digit</option>
                </select>
              </label>

              <label class="form-label">
                Group Size
                <input
                  v-model.number="assignmentForm.groupSize"
                  class="form-input"
                  type="number"
                  min="1"
                  max="10"
                  :disabled="assignmentForm.groupMethod === 'matric_last_digit'"
                />
              </label>
            </div>

            <p>
              For now, the system uses mock enrolled students. When the student module is added,
              actual course students will be passed into this same grouping logic.
            </p>
          </section>

          <p v-if="assignmentError" class="form-error">{{ assignmentError }}</p>

          <div class="modal-actions">
            <button type="button" class="cancel-modal-btn" @click="closeAssignmentModal">
              Cancel
            </button>
            <button type="submit" class="save-assignment-btn">
              {{ editingAssignmentId ? "Save Changes" : "Create Assignment" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="viewingAssignment" class="modal-backdrop">
      <div class="assignment-modal view-assignment-modal">
        <div class="modal-header">
          <div>
            <h2>View Assignment</h2>
            <p>{{ activeCourse.code }}</p>
          </div>

          <button type="button" class="modal-close" @click="viewingAssignment = null">×</button>
        </div>

        <div class="assignment-view-body">
          <h3>{{ viewingAssignment.title }}</h3>
          <p>{{ viewingAssignment.description }}</p>

          <div class="assignment-detail-grid">
            <div>
              <span>Assignment Type</span>
              <strong>{{ viewingAssignment.type === "grouped" ? "Grouped" : "Individual" }}</strong>
            </div>

            <div>
              <span>Submission Type</span>
              <strong>{{ viewingAssignment.submissionType }}</strong>
            </div>

            <div>
              <span>Total Marks</span>
              <strong>{{ viewingAssignment.totalMarks }}</strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>{{ formatDueDate(viewingAssignment) }}</strong>
            </div>
          </div>

          <section v-if="viewingAssignment.type === 'grouped'" class="generated-groups">
            <h3>Generated Groups</h3>

            <article v-for="group in viewingAssignment.groups" :key="group.id">
              <strong>{{ group.name }}</strong>
              <p v-if="group.members.length">{{ group.members.join(", ") }}</p>
              <p v-else>Students will choose their groups.</p>
            </article>
          </section>
        </div>
      </div>
    </div>

    <div v-if="deleteTarget" class="modal-backdrop">
      <div class="delete-modal">
        <h2>Delete Assignment?</h2>
        <p>
          This will remove <strong>{{ deleteTarget.title }}</strong> and all related dummy submissions.
        </p>

        <div class="modal-actions">
          <button type="button" class="cancel-modal-btn" @click="deleteTarget = null">
            Cancel
          </button>
          <button type="button" class="confirm-delete-btn" @click="deleteAssignment">
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Download,
  FileText,
  FolderOpen,
  Maximize2,
  Pause,
  Play,
  Video,
} from "lucide-vue-next";

import AssignmentGradingView from "../../pages/lecturer/AssignmentGradingView.vue";
import { useLecturerCoursesStore } from "../../stores/lecturerCourses.store";
import { useLecturerMaterialsStore } from "../../stores/lecturerMaterials.store";
import { useLecturerWorkspaceStore } from "../../stores/lecturerWorkspace.store";

const route = useRoute();
const router = useRouter();
const fileInput = ref(null);
const videoRef = ref(null);

const coursesStore = useLecturerCoursesStore();
const materialsStore = useLecturerMaterialsStore();
const workspaceStore = useLecturerWorkspaceStore();

const materialTypes = [
  "Lecture Notes (PDF)",
  "Slides (PPT)",
  "Video Lectures",
  "Past Questions",
];

const assignmentFilters = [
  { label: "All", value: "all" },
  { label: "Individual", value: "individual" },
  { label: "Grouped", value: "grouped" },
];

const selectedWeek = ref("all");
const selectedTypes = ref([...materialTypes]);
const previewMaterial = ref(null);
const formError = ref("");

const selectedVideo = ref(null);
const isPlaying = ref(false);
const videoCurrentTime = ref(0);
const videoDuration = ref(0);
const playbackRate = ref(1);

const assignmentFilter = ref("all");
const assignmentSearch = ref("");
const assignmentModalOpen = ref(false);
const editingAssignmentId = ref("");
const assignmentError = ref("");
const viewingAssignment = ref(null);
const deleteTarget = ref(null);

const currentLecturer = computed(() => coursesStore.currentLecturer);
const lecturerCourses = computed(() => coursesStore.lecturerCourses);

const activeCourse = computed(() => {
  return coursesStore.getCourseById(route.params.courseId) || lecturerCourses.value[0] || {};
});

const activeSection = computed(() => String(route.params.section || "materials").toLowerCase());

const courseMaterials = computed(() => materialsStore.getMaterialsByCourse(activeCourse.value?.id));
const courseVideos = computed(() => materialsStore.getVideosByCourse(activeCourse.value?.id));
const recentUploads = computed(() => materialsStore.getRecentUploadsByCourse(activeCourse.value?.id));

const courseAssignments = computed(() =>
  workspaceStore.getAssignmentsByCourse(activeCourse.value?.id)
);

const courseDiscussions = computed(() =>
  workspaceStore.getDiscussionsByCourse(activeCourse.value?.id)
);

const courseGradeBook = computed(() =>
  workspaceStore.getGradeBookByCourse(activeCourse.value?.id)
);

const selectedGradeAssignment = computed(() => {
  const assignmentId = String(route.query.assignmentId || "");
  return workspaceStore.getAssignmentById(assignmentId);
});

const selectedGradeSubmission = computed(() => {
  const submissionId = String(route.query.submissionId || "");
  return workspaceStore.getSubmissionById(submissionId);
});

const selectedAssignmentSubmissions = computed(() => {
  if (!selectedGradeAssignment.value) return [];
  return workspaceStore
    .getSubmissionsByAssignment(selectedGradeAssignment.value.id)
    .filter((submission) => submission.status !== "Pending");
});

const tabs = computed(() => [
  {
    key: "materials",
    label: "Materials",
    count: courseMaterials.value.length,
    className: "info-dot",
  },
  {
    key: "videos",
    label: "Videos",
    count: courseVideos.value.length,
    className: "info-dot",
  },
  {
    key: "assignments",
    label: "Assignments",
    count: courseAssignments.value.length,
    className: "danger-dot",
  },
  {
    key: "discussion",
    label: "Discussion",
    count: courseDiscussions.value.length,
    className: "success-dot",
  },
  {
    key: "gradebook",
    label: "Grade Book",
    count: courseGradeBook.value.length,
    className: "warning-dot",
  },
  {
    key: "upload",
    label: "Upload",
  },
]);

const form = reactive({
  courseId: "",
  category: "Lecture Notes (PDF)",
  title: "",
  description: "",
  week: 10,
  visibility: "All Students",
  allowDownload: true,
  file: null,
  fileName: "",
  fileSize: "",
  fileUrl: "",
  mimeType: "",
  duration: "00:00",
});

const assignmentForm = reactive({
  title: "",
  description: "",
  type: "individual",
  submissionType: "File Upload",
  totalMarks: 20,
  dueDate: "",
  dueTime: "23:59",
  groupMethod: "system_auto",
  groupSize: 4,
});

const weekFilters = computed(() => {
  const weeks = [...new Set(courseMaterials.value.map((item) => item.week))].sort((a, b) => a - b);

  return [
    { label: "All", value: "all" },
    ...weeks.map((week) => ({ label: `Week ${week}`, value: week })),
  ];
});

const filteredMaterials = computed(() => {
  return courseMaterials.value.filter((material) => {
    const byWeek = selectedWeek.value === "all" || Number(material.week) === Number(selectedWeek.value);
    const byType = selectedTypes.value.includes(material.category);
    return byWeek && byType;
  });
});

const filteredAssignments = computed(() => {
  const query = assignmentSearch.value.toLowerCase();

  return courseAssignments.value.filter((assignment) => {
    const byType =
      assignmentFilter.value === "all" || assignment.type === assignmentFilter.value;

    const bySearch =
      !query ||
      assignment.title.toLowerCase().includes(query) ||
      assignment.description.toLowerCase().includes(query);

    return byType && bySearch;
  });
});

const durationLabel = computed(() => formatSeconds(videoDuration.value));
const currentTimeLabel = computed(() => formatSeconds(videoCurrentTime.value));

watch(
  () => activeCourse.value?.id,
  (courseId) => {
    form.courseId = courseId || "";
    previewMaterial.value = null;
    selectedWeek.value = "all";
    selectedTypes.value = [...materialTypes];
    selectedVideo.value = courseVideos.value[0] || null;
    resetVideoState();
  },
  { immediate: true }
);

watch(
  courseVideos,
  (videos) => {
    if (!selectedVideo.value && videos.length) {
      selectedVideo.value = videos[0];
    }

    if (selectedVideo.value && !videos.some((video) => video.id === selectedVideo.value.id)) {
      selectedVideo.value = videos[0] || null;
    }
  },
  { deep: true }
);

function goToSection(section) {
  router.push(`/lecturer/courses/${activeCourse.value.id}/${section}`);
}

function resetAssignmentForm() {
  Object.assign(assignmentForm, {
    title: "",
    description: "",
    type: "individual",
    submissionType: "File Upload",
    totalMarks: 20,
    dueDate: "",
    dueTime: "23:59",
    groupMethod: "system_auto",
    groupSize: 4,
  });

  editingAssignmentId.value = "";
  assignmentError.value = "";
}

function openCreateAssignment() {
  resetAssignmentForm();
  assignmentModalOpen.value = true;
}

function closeAssignmentModal() {
  assignmentModalOpen.value = false;
  resetAssignmentForm();
}

function validateAssignmentForm() {
  if (!sanitizeText(assignmentForm.title)) return "Assignment title is required.";
  if (!sanitizeText(assignmentForm.description)) return "Assignment description is required.";
  if (!Number(assignmentForm.totalMarks)) return "Total marks is required.";
  if (!assignmentForm.dueDate) return "Due date is required.";
  if (!assignmentForm.dueTime) return "Due time is required.";

  if (
    assignmentForm.type === "grouped" &&
    assignmentForm.groupMethod !== "matric_last_digit" &&
    !Number(assignmentForm.groupSize)
  ) {
    return "Group size is required.";
  }

  return "";
}

function saveAssignment() {
  const error = validateAssignmentForm();

  if (error) {
    assignmentError.value = error;
    return;
  }

  const payload = {
    courseId: activeCourse.value.id,
    ...assignmentForm,
  };

  if (editingAssignmentId.value) {
    workspaceStore.updateAssignment(editingAssignmentId.value, payload);
  } else {
    workspaceStore.createAssignment(payload);
  }

  closeAssignmentModal();
  assignmentFilter.value = "all";
  assignmentSearch.value = "";
}

function viewAssignment(assignment) {
  viewingAssignment.value = assignment;
}

function editAssignment(assignment) {
  Object.assign(assignmentForm, {
    title: assignment.title,
    description: assignment.description,
    type: assignment.type,
    submissionType: assignment.submissionType,
    totalMarks: assignment.totalMarks,
    dueDate: assignment.dueDate,
    dueTime: assignment.dueTime,
    groupMethod: assignment.groupMethod || "system_auto",
    groupSize: assignment.groupSize || 4,
  });

  editingAssignmentId.value = assignment.id;
  assignmentError.value = "";
  assignmentModalOpen.value = true;
}

function confirmDeleteAssignment(assignment) {
  deleteTarget.value = assignment;
}

function deleteAssignment() {
  if (!deleteTarget.value) return;
  workspaceStore.deleteAssignment(deleteTarget.value.id);
  deleteTarget.value = null;
}

function openGradeAssignment(assignment) {
  const submission = workspaceStore
    .getSubmissionsByAssignment(assignment.id)
    .find((item) => item.status !== "Pending");

  if (!submission) {
    viewingAssignment.value = assignment;
    return;
  }

  router.push({
    path: `/lecturer/courses/${activeCourse.value.id}/gradebook`,
    query: {
      assignmentId: assignment.id,
      submissionId: submission.id,
    },
  });
}

function handleGradeSave(payload) {
  workspaceStore.gradeSubmission(payload.submissionId, {
    score: payload.score,
    feedback: payload.feedback,
  });
}

function goToPreviousSubmission() {
  moveGradeSubmission(-1);
}

function goToNextSubmission() {
  moveGradeSubmission(1);
}

function moveGradeSubmission(direction) {
  if (!selectedGradeSubmission.value || selectedAssignmentSubmissions.value.length === 0) return;

  const currentIndex = selectedAssignmentSubmissions.value.findIndex(
    (item) => item.id === selectedGradeSubmission.value.id
  );

  const nextIndex =
    (currentIndex + direction + selectedAssignmentSubmissions.value.length) %
    selectedAssignmentSubmissions.value.length;

  const nextSubmission = selectedAssignmentSubmissions.value[nextIndex];

  router.push({
    path: `/lecturer/courses/${activeCourse.value.id}/gradebook`,
    query: {
      assignmentId: selectedGradeAssignment.value.id,
      submissionId: nextSubmission.id,
    },
  });
}

function submittedCount(assignmentId) {
  return workspaceStore
    .getSubmissionsByAssignment(assignmentId)
    .filter((item) => item.status !== "Pending").length;
}

function totalSubmissionCount(assignmentId) {
  return workspaceStore.getSubmissionsByAssignment(assignmentId).length;
}

function formatDueDate(assignment) {
  if (!assignment?.dueDate) return "Not set";
  return `${assignment.dueDate} ${assignment.dueTime || ""}`.trim();
}

function openPreview(material) {
  if (!material.fileUrl) {
    formError.value = "Preview unavailable for this file.";
    return;
  }

  previewMaterial.value = material;
}

function downloadMaterial(material) {
  if (!material?.allowDownload || !material?.fileUrl) return;

  const link = document.createElement("a");
  link.href = material.fileUrl;
  link.download = material.fileName || material.title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function removeMaterial(materialId) {
  materialsStore.deleteMaterial(materialId);

  if (selectedVideo.value?.id === materialId) {
    selectedVideo.value = courseVideos.value[0] || null;
  }
}

function selectVideo(video) {
  selectedVideo.value = video;
  resetVideoState();

  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.load();
    }
  });
}

function toggleVideo() {
  if (!videoRef.value) return;

  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
}

function syncVideoMeta() {
  if (!videoRef.value) return;
  videoDuration.value = Math.floor(videoRef.value.duration || 0);
}

function syncVideoProgress() {
  if (!videoRef.value) return;
  videoCurrentTime.value = Math.floor(videoRef.value.currentTime || 0);
}

function seekVideo() {
  if (!videoRef.value) return;
  videoRef.value.currentTime = videoCurrentTime.value;
}

function cycleSpeed() {
  const speeds = [1, 1.25, 1.5, 2];
  const currentIndex = speeds.indexOf(playbackRate.value);
  playbackRate.value = speeds[(currentIndex + 1) % speeds.length];

  if (videoRef.value) {
    videoRef.value.playbackRate = playbackRate.value;
  }
}

function toggleFullscreen() {
  const player = videoRef.value;
  if (player?.requestFullscreen) {
    player.requestFullscreen();
  }
}

function resetVideoState() {
  isPlaying.value = false;
  videoCurrentTime.value = 0;
  videoDuration.value = 0;
  playbackRate.value = 1;
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function fileTypeFromName(name, category = "") {
  const ext = String(name || "").split(".").pop()?.toLowerCase();

  if (category === "Video Lectures") return "mp4";
  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx"].includes(ext)) return "pptx";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (ext === "mp4") return "mp4";
  if (ext === "zip") return "zip";

  return "file";
}

function formatFileSize(bytes) {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

function formatSeconds(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function acceptFile(file) {
  if (!file) return;

  if (file.size > 500 * 1024 * 1024) {
    formError.value = "File cannot exceed 500 MB.";
    return;
  }

  if (form.fileUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(form.fileUrl);
  }

  form.file = file;
  form.fileName = file.name;
  form.fileSize = formatFileSize(file.size);
  form.fileUrl = URL.createObjectURL(file);
  form.mimeType = file.type || "";
  formError.value = "";

  if (fileTypeFromName(file.name, form.category) === "mp4") {
    form.category = "Video Lectures";
  }

  if (!form.title) form.title = file.name;
}

function handleFileSelect(event) {
  acceptFile(event.target.files?.[0]);
}

function handleDrop(event) {
  acceptFile(event.dataTransfer.files?.[0]);
}

function resetForm() {
  Object.assign(form, {
    courseId: activeCourse.value.id,
    category: "Lecture Notes (PDF)",
    title: "",
    description: "",
    week: 10,
    visibility: "All Students",
    allowDownload: true,
    file: null,
    fileName: "",
    fileSize: "",
    fileUrl: "",
    mimeType: "",
    duration: "00:00",
  });

  formError.value = "";
}

function buildPayload() {
  return {
    courseId: sanitizeText(form.courseId),
    title: sanitizeText(form.title),
    description: sanitizeText(form.description),
    category: sanitizeText(form.category),
    week: Number(form.week),
    size: form.fileSize || "0 KB",
    allowDownload: Boolean(form.allowDownload),
    fileUrl: form.fileUrl,
    fileName: form.fileName,
    mimeType: form.mimeType,
    duration: form.duration,
  };
}

function validateForm() {
  if (!sanitizeText(form.title)) return "Title is required.";
  if (!form.fileName || !form.fileUrl) return "Select a file to upload.";
  if (!Number(form.week)) return "Week number is required.";

  if (form.category === "Video Lectures" && fileTypeFromName(form.fileName) !== "mp4") {
    return "Video lectures must be uploaded as MP4 files.";
  }

  return "";
}

function saveDraft() {
  if (!sanitizeText(form.title) && !form.fileName) {
    formError.value = "Add a title or file before saving draft.";
    return;
  }

  materialsStore.saveDraft({ ...form });
  formError.value = "";
}

function loadDraft() {
  const draft = materialsStore.getLatestDraft();
  if (!draft) return;
  Object.assign(form, draft);
}

function publish() {
  const error = validateForm();

  if (error) {
    formError.value = error;
    return;
  }

  const material = materialsStore.addMaterial(buildPayload());

  if (material.type === "mp4" || material.category === "Video Lectures") {
    selectedVideo.value = material;
    resetForm();
    router.push(`/lecturer/courses/${material.courseId}/videos`);
    return;
  }

  resetForm();
  router.push(`/lecturer/courses/${material.courseId}/materials`);
}
</script>

<style scoped>
.course-strip {
  height: 54px;
  display: flex;
  align-items: stretch;
  gap: 32px;
  margin: calc(var(--page-padding-y) * -1) calc(var(--page-padding-x) * -1) 32px;
  padding: 0 var(--page-padding-x);
  border-bottom: 1px solid #edf2f7;
  background: white;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.course-info {
  width: 345px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.course-icon {
  width: 31px;
  height: 31px;
  border-radius: 8px;
  background: #dbeafe;
}

.course-info strong {
  color: #111827;
  font-size: 14px;
  font-weight: 900;
}

.course-info span {
  color: #334155;
  font-size: 12px;
  font-weight: 700;
}

.tabs {
  display: flex;
  gap: 26px;
  overflow-x: auto;
}

.tabs button {
  position: relative;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.tabs button.active {
  color: #0875f5;
}

.tabs button.active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #0875f5;
}

.tabs small {
  display: inline-grid;
  place-items: center;
  min-width: 14px;
  height: 14px;
  margin-left: 4px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 9px;
}

.info-dot {
  color: #0875f5;
  background: #dbeafe;
}

.danger-dot {
  color: #ef4444;
  background: #fee2e2;
}

.success-dot {
  color: #16a34a;
  background: #dcfce7;
}

.warning-dot {
  color: #b45309;
  background: #fef3c7;
}

.assignments-heading,
.materials-title-row,
.upload-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.assignment-tools {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.assignment-filters {
  display: flex;
  gap: 10px;
}

.assignment-filters button {
  height: 34px;
  padding: 0 16px;
  border: 1px solid #d7e4f3;
  border-radius: 5px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.assignment-filters button.active {
  border-color: #1e3a8a;
  background: #1e3a8a;
  color: white;
}

.assignment-search {
  width: 276px;
  height: 34px;
  border: 1px solid #cbd8ea;
  border-radius: 5px;
  padding: 0 13px;
  color: #334155;
  outline: 0;
}

.create-assignment-btn {
  height: 34px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

.assignments-table-card {
  overflow: hidden;
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.assignments-table {
  width: 100%;
  border-collapse: collapse;
}

.assignments-table th {
  height: 48px;
  padding: 0 20px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-align: left;
}

.assignments-table td {
  padding: 18px 20px;
  border-top: 1px solid #edf2f7;
  color: #334155;
  font-size: 13px;
  vertical-align: middle;
}

.assignments-table td strong {
  display: block;
  margin-bottom: 5px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.assignments-table td small {
  display: block;
  color: #64748b;
  font-size: 11px;
}

.actions-th {
  width: 270px;
}

.assignment-type-pill,
.assignment-status {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}

.assignment-type-pill.individual {
  color: #0875f5;
  background: #dbeafe;
}

.assignment-type-pill.grouped {
  color: #7c3aed;
  background: #ede9fe;
}

.assignment-status {
  color: #16a34a;
  background: #dcfce7;
}

.assignment-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.assignment-actions button {
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 900;
}

.view-action {
  border: 1px solid #0875f5;
  background: white;
  color: #0875f5;
}

.edit-action {
  border: 1px solid #f59e0b;
  background: #fffbeb;
  color: #b45309;
}

.grade-action {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.delete-action {
  border: 1px solid #ef4444;
  background: #fee2e2;
  color: #dc2626;
}

.empty-assignments {
  min-height: 310px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 30px;
  text-align: center;
}

.empty-assignments h2 {
  margin: 0;
  color: #334155;
}

.empty-assignments p {
  margin: 0 0 8px;
  color: #64748b;
}

.videos-layout,
.materials-grid,
.upload-grid {
  display: grid;
  grid-template-columns: minmax(0, 775px) 334px;
  gap: 20px;
  align-items: start;
}

.video-player-card,
.playlist-card,
.about-lecture-card,
.materials-list,
.side-card,
.recent-card,
.upload-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.video-player-card {
  overflow: hidden;
}

.video-stage {
  position: relative;
  height: 430px;
  background: #0f172a;
}

.video-stage video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.big-play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #dbeafe;
  color: #0f172a;
  transform: translate(-50%, -50%);
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
  grid-template-columns: 34px 46px 1fr 46px 46px 88px 34px;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  background: #ffffff;
}

.small-play,
.fullscreen-btn {
  border: 0;
  background: transparent;
  color: #0f172a;
}

.video-range {
  width: 100%;
  accent-color: #3f7f2f;
}

.speed-btn {
  height: 25px;
  border: 1px solid #94a3b8;
  border-radius: 4px;
  background: white;
  color: #334155;
  font-size: 11px;
  font-weight: 800;
}

.download-video-btn {
  height: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  border-radius: 4px;
  background: #b7e4c7;
  color: white;
  font-size: 11px;
  font-weight: 800;
}

.download-video-btn:not(:disabled) {
  background: #16a34a;
}

.playlist-card {
  padding: 20px;
}

.playlist-card h2,
.about-lecture-card h2,
.side-card h2,
.recent-card h2 {
  margin: 0 0 18px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.playlist-item {
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
  align-items: center;
  min-height: 68px;
  border: 0;
  border-bottom: 1px solid #edf2f7;
  background: white;
  text-align: left;
}

.playlist-item:last-child {
  border-bottom: 0;
}

.playlist-item.active .playlist-number {
  background: #1e3a8a;
  color: white;
}

.playlist-number {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 900;
}

.playlist-text strong {
  display: block;
  margin-bottom: 5px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.playlist-text small {
  color: #64748b;
  font-size: 12px;
}

.about-lecture-card {
  margin-top: 24px;
  padding: 24px;
}

.about-lecture-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.45;
}

.about-lecture-card span {
  display: inline-flex;
  align-items: center;
  height: 23px;
  padding: 0 8px;
  border: 1px solid #0875f5;
  border-radius: 4px;
  color: #0875f5;
  font-size: 11px;
}

.upload-top-btn {
  height: 34px;
  margin-top: 2px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 900;
}

.materials-list {
  min-height: 410px;
  overflow: hidden;
}

.material-item {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  min-height: 80px;
  padding: 18px 24px;
  border-bottom: 1px solid #edf2f7;
}

.material-item:last-child {
  border-bottom: 0;
}

.file-box {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
}

.file-box.pdf {
  color: #dc2626;
  background: #fee2e2;
}

.file-box.pptx {
  color: #0875f5;
  background: #dbeafe;
}

.file-box.docx {
  color: #d97706;
  background: #fef3c7;
}

.file-box.zip,
.file-box.mp4 {
  color: #16a34a;
  background: #dcfce7;
}

.material-meta h2 {
  margin: 0 0 5px;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.material-meta p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.material-meta span {
  margin: 0 8px;
}

.material-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.preview-btn,
.download-btn,
.delete-btn {
  height: 30px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
}

.preview-btn {
  width: 78px;
  border: 1px solid #0875f5;
  color: #0875f5;
  background: white;
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

.delete-btn {
  width: 32px;
  border: 1px solid #ff7a7a;
  color: #ef4444;
  background: #fee2e2;
  font-size: 18px;
}

.materials-side {
  display: grid;
  gap: 20px;
  align-content: start;
}

.side-card,
.recent-card {
  padding: 20px;
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

.empty-materials {
  min-height: 410px;
  display: grid;
  place-items: center;
  padding: 30px;
  text-align: center;
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: white;
}

.empty-materials h2 {
  margin: 0 0 8px;
  color: #334155;
}

.empty-materials p {
  margin: 0 0 16px;
  color: #64748b;
}

.preview-heading {
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

.preview-heading h1 {
  margin: 0;
  color: #334155;
  font-size: 16px;
  font-weight: 900;
}

.viewer-shell {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background: white;
  border: 1px solid #d5deeb;
}

.viewer-toolbar {
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  background: #3c3c3c;
  color: white;
}

.viewer-toolbar button {
  border: 0;
  background: transparent;
  color: white;
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

.file-frame {
  width: 100%;
  height: 760px;
  border: 0;
  background: white;
}

.video-preview {
  width: 100%;
  max-height: 760px;
  background: #0f172a;
}

.unsupported-preview {
  min-height: 520px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: #334155;
  text-align: center;
}

.unsupported-preview p {
  margin: 0;
  color: #64748b;
}

.download-large-btn {
  height: 38px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #16a34a;
  color: white;
  font-weight: 900;
}

.download-large-btn:disabled {
  background: #b7e4c7;
  cursor: not-allowed;
}

.upload-card {
  padding: 24px;
}

.form-two,
.form-three {
  display: grid;
  gap: 16px;
  margin-bottom: 18px;
}

.form-two {
  grid-template-columns: repeat(2, 1fr);
}

.form-three {
  grid-template-columns: repeat(3, 1fr);
}

.form-label {
  display: block;
  margin-bottom: 18px;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #cbd8ea;
  border-radius: 6px;
  background: white;
  color: #334155;
  outline: 0;
  font-size: 13px;
}

.form-input,
.form-select {
  height: 38px;
  padding: 0 12px;
}

.form-textarea {
  min-height: 92px;
  padding: 12px;
  resize: vertical;
}

.upload-textarea {
  min-height: 80px;
}

.drop-zone {
  width: 100%;
  min-height: 154px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  margin-top: 16px;
  border: 1px dashed #334155;
  border-radius: 8px;
  background: #f3f6fa;
  color: #334155;
  text-align: center;
}

.drop-zone.active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.drop-zone strong {
  font-size: 13px;
  font-weight: 900;
}

.drop-zone span {
  color: #64748b;
  font-size: 12px;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.save-draft,
.publish-btn {
  height: 34px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 900;
}

.save-draft {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.publish-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.draft-badge {
  height: 34px;
  padding: 0 18px;
  border: 1px solid #d97706;
  border-radius: 4px;
  background: #ffedd5;
  color: #b45309;
  font-size: 13px;
  font-weight: 900;
}

.recent-item {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #edf2f7;
}

.recent-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.recent-icon.pdf {
  color: #dc2626;
  background: #fee2e2;
}

.recent-icon.pptx {
  color: #8b5cf6;
  background: #ede9fe;
}

.recent-icon.docx {
  color: #d97706;
  background: #fef3c7;
}

.recent-icon.mp4,
.recent-icon.zip {
  color: #16a34a;
  background: #dcfce7;
}

.recent-item strong {
  display: block;
  overflow: hidden;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-item span,
.recent-empty {
  color: #64748b;
  font-size: 10px;
}

.form-error {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 800;
}

.empty-section {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  min-height: 260px;
  color: #64748b;
  text-transform: capitalize;
}

.empty-section h1 {
  margin: 0;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
}

.empty-section p {
  margin: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
}

.assignment-modal,
.delete-modal {
  width: min(760px, 100%);
  max-height: 92vh;
  overflow: auto;
  border-radius: 16px;
  background: white;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.assignment-modal {
  padding: 24px;
}

.delete-modal {
  width: min(430px, 100%);
  padding: 28px;
}

.delete-modal h2 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 20px;
  font-weight: 900;
}

.delete-modal p {
  margin: 0 0 22px;
  color: #64748b;
  line-height: 1.45;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 6px;
  color: #111827;
  font-size: 20px;
  font-weight: 900;
}

.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
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

.assignment-description {
  min-height: 116px;
}

.assignment-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.assignment-form-grid:has(.form-label:nth-child(3)) {
  grid-template-columns: repeat(3, 1fr);
}

.group-settings-card {
  margin: 4px 0 18px;
  padding: 18px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.group-settings-card h3 {
  margin: 0 0 12px;
  color: #334155;
  font-size: 15px;
  font-weight: 900;
}

.group-settings-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.45;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.cancel-modal-btn,
.save-assignment-btn,
.confirm-delete-btn {
  height: 36px;
  padding: 0 18px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 900;
}

.cancel-modal-btn {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.save-assignment-btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.confirm-delete-btn {
  border: 1px solid #dc2626;
  background: #dc2626;
  color: white;
}

.assignment-view-body h3 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 20px;
  font-weight: 900;
}

.assignment-view-body > p {
  margin: 0 0 20px;
  color: #64748b;
  line-height: 1.55;
}

.assignment-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.assignment-detail-grid div {
  padding: 14px;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  background: #f8fafc;
}

.assignment-detail-grid span {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
}

.assignment-detail-grid strong {
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.generated-groups {
  margin-top: 22px;
}

.generated-groups h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.generated-groups article {
  padding: 12px 14px;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  margin-bottom: 10px;
}

.generated-groups article strong {
  display: block;
  margin-bottom: 4px;
  color: #334155;
}

.generated-groups article p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 1180px) {
  .videos-layout,
  .materials-grid,
  .upload-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .course-strip {
    flex-direction: column;
    height: auto;
    padding-top: 12px;
  }

  .course-info {
    width: auto;
  }

  .tabs {
    padding-bottom: 8px;
  }

  .assignments-heading,
  .materials-title-row,
  .upload-title-row,
  .preview-heading,
  .assignment-tools {
    flex-direction: column;
    align-items: flex-start;
  }

  .assignment-search {
    width: 100%;
  }

  .assignment-form-grid,
  .assignment-form-grid:has(.form-label:nth-child(3)),
  .assignment-detail-grid {
    grid-template-columns: 1fr;
  }

  .material-item {
    grid-template-columns: 52px 1fr;
  }

  .material-actions {
    grid-column: 1 / -1;
    flex-wrap: wrap;
  }

  .form-two,
  .form-three {
    grid-template-columns: 1fr;
  }

  .video-controls {
    grid-template-columns: 34px 46px 1fr;
    height: auto;
    padding: 14px;
  }
}
</style>