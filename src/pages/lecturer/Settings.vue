<template>
  <section class="settings-page">
    <div class="page-heading">
      <h1>Settings</h1>
      <p>Manage your account preferences and system notifications</p>
    </div>

    <div class="settings-layout">
      <main class="main-column">
        <section class="profile-card">
          <h2>Personal Profile</h2>

          <div class="photo-row">
            <div class="avatar-preview">
              <img v-if="settings.profilePhoto" :src="settings.profilePhoto" alt="Profile" />
              <span v-else>{{ profileInitials }}</span>
            </div>

            <div class="photo-actions">
              <div>
                <button type="button" class="outline-green-btn" @click="photoInput?.click()">
                  Change Photo
                </button>

                <button type="button" class="solid-green-small" @click="removePhoto">
                  Remove
                </button>
              </div>

              <p>JPG or PNG. Max size 2MB</p>
            </div>

            <input
              ref="photoInput"
              type="file"
              hidden
              accept="image/png,image/jpeg"
              @change="handlePhotoUpload"
            />
          </div>

          <form class="profile-form" @submit.prevent="updateProfile">
            <div class="form-grid">
              <label class="form-label">
                Title
                <select v-model="settings.title" class="form-control">
                  <option>Dr.</option>
                  <option>Prof.</option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Miss</option>
                </select>
              </label>

              <label class="form-label">
                Staff ID
                <input
                  v-model="settings.staffId"
                  class="form-control readonly"
                  readonly
                />
              </label>

              <label class="form-label">
                First Name
                <input v-model.trim="settings.firstName" class="form-control" />
              </label>

              <label class="form-label">
                Last Name
                <input v-model.trim="settings.lastName" class="form-control" />
              </label>

              <label class="form-label">
                Phone Number
                <input v-model.trim="settings.phoneNumber" class="form-control" />
              </label>

              <label class="form-label">
                Email
                <input v-model.trim="settings.email" class="form-control" type="email" />
              </label>
            </div>

            <p v-if="profileError" class="error-message">{{ profileError }}</p>
            <p v-if="profileSuccess" class="success-message">{{ profileSuccess }}</p>

            <div class="card-actions">
              <button type="submit" class="solid-green-btn">
                Update Profile
              </button>
            </div>
          </form>
        </section>

        <section class="security-card">
          <h2>Security & Access</h2>

          <form @submit.prevent="changePassword">
            <label class="form-label full">
              Current Password
              <input
                v-model="passwordForm.currentPassword"
                class="form-control"
                type="password"
                autocomplete="current-password"
              />
            </label>

            <div class="form-grid">
              <label class="form-label">
                New Password
                <input
                  v-model="passwordForm.newPassword"
                  class="form-control"
                  type="password"
                  autocomplete="new-password"
                />
              </label>

              <label class="form-label">
                Confirm New Password
                <input
                  v-model="passwordForm.confirmPassword"
                  class="form-control"
                  type="password"
                  autocomplete="new-password"
                />
              </label>
            </div>

            <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</p>

            <button type="submit" class="outline-green-wide">
              Change Password
            </button>
          </form>
        </section>
      </main>

      <aside class="side-column">
        <section class="side-card">
          <h2>Notifications</h2>

          <label class="check-row">
            <input v-model="settings.notifications.emailMaterials" type="checkbox" />
            <span>Email for new materials</span>
          </label>

          <label class="check-row">
            <input v-model="settings.notifications.assignmentDeadlines" type="checkbox" />
            <span>Assignment deadlines</span>
          </label>

          <label class="check-row">
            <input v-model="settings.notifications.discussionReplies" type="checkbox" />
            <span>Discussion chat replies</span>
          </label>

          <label class="check-row">
            <input v-model="settings.notifications.pushNotifications" type="checkbox" />
            <span>Push Notifications</span>
          </label>
        </section>

        <section class="side-card">
          <h2>Course Settings</h2>

          <label class="check-row">
            <input v-model="settings.courseSettings.allowLateSubmissions" type="checkbox" />
            <span>Allow student late submissions</span>
          </label>

          <label class="check-row">
            <input v-model="settings.courseSettings.hideTotalGrade" type="checkbox" />
            <span>Hide course total grade</span>
          </label>

          <label class="check-row">
            <input v-model="settings.courseSettings.allowDiscussionPosts" type="checkbox" />
            <span>Allow student discussion posts</span>
          </label>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const STORAGE_KEY = "uniosun_lms_lecturer_settings_v1";

const defaultSettings = {
  title: "Dr.",
  staffId: "STAFF/CSC/0042",
  firstName: "Adeyinka",
  lastName: "Oladapo",
  phoneNumber: "+234 803 456 7890",
  email: "a.oladapo@uniosun.edu.ng",
  profilePhoto: "",
  notifications: {
    emailMaterials: true,
    assignmentDeadlines: true,
    discussionReplies: false,
    pushNotifications: true,
  },
  courseSettings: {
    allowLateSubmissions: true,
    hideTotalGrade: false,
    allowDiscussionPosts: true,
  },
};

const photoInput = ref(null);
const profileError = ref("");
const profileSuccess = ref("");
const passwordError = ref("");
const passwordSuccess = ref("");

const settings = reactive(loadSettings());

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const profileInitials = computed(() => {
  const first = settings.firstName?.[0] || "";
  const last = settings.lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "AO";
});

watch(
  settings,
  () => {
    saveSettings();
  },
  { deep: true }
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : clone(defaultSettings);

    return {
      ...clone(defaultSettings),
      ...parsed,
      notifications: {
        ...clone(defaultSettings.notifications),
        ...(parsed.notifications || {}),
      },
      courseSettings: {
        ...clone(defaultSettings.courseSettings),
        ...(parsed.courseSettings || {}),
      },
    };
  } catch {
    return clone(defaultSettings);
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    profileError.value = "Only JPG and PNG files are allowed.";
    profileSuccess.value = "";
    event.target.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    profileError.value = "Profile photo cannot exceed 2MB.";
    profileSuccess.value = "";
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    settings.profilePhoto = String(reader.result || "");
    profileError.value = "";
    profileSuccess.value = "Profile photo updated.";
  };

  reader.onerror = () => {
    profileError.value = "Unable to read selected photo.";
    profileSuccess.value = "";
  };

  reader.readAsDataURL(file);
  event.target.value = "";
}

function removePhoto() {
  settings.profilePhoto = "";
  profileError.value = "";
  profileSuccess.value = "Profile photo removed.";
}

function updateProfile() {
  profileError.value = "";
  profileSuccess.value = "";

  const firstName = sanitizeText(settings.firstName);
  const lastName = sanitizeText(settings.lastName);
  const phoneNumber = sanitizeText(settings.phoneNumber);
  const email = sanitizeText(settings.email);

  if (!firstName) {
    profileError.value = "First name is required.";
    return;
  }

  if (!lastName) {
    profileError.value = "Last name is required.";
    return;
  }

  if (!phoneNumber) {
    profileError.value = "Phone number is required.";
    return;
  }

  if (!isValidEmail(email)) {
    profileError.value = "Enter a valid email address.";
    return;
  }

  settings.firstName = firstName;
  settings.lastName = lastName;
  settings.phoneNumber = phoneNumber;
  settings.email = email;

  saveSettings();
  profileSuccess.value = "Profile updated successfully.";
}

function changePassword() {
  passwordError.value = "";
  passwordSuccess.value = "";

  if (!passwordForm.currentPassword) {
    passwordError.value = "Current password is required.";
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    passwordError.value = "New password must be at least 8 characters.";
    return;
  }

  if (!/[A-Z]/.test(passwordForm.newPassword)) {
    passwordError.value = "New password must include at least one uppercase letter.";
    return;
  }

  if (!/[0-9]/.test(passwordForm.newPassword)) {
    passwordError.value = "New password must include at least one number.";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "New password and confirmation do not match.";
    return;
  }

  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";

  passwordSuccess.value = "Password changed successfully.";
}
</script>

<style scoped>
.settings-page {
  color: #0f172a;
}

.page-heading {
  margin-bottom: 24px;
}

.page-heading h1 {
  margin: 0 0 8px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 900;
}

.page-heading p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.settings-layout {
  display: grid;
  grid-template-columns: minmax(0, 775px) 335px;
  gap: 20px;
  align-items: start;
}

.main-column {
  display: grid;
  gap: 20px;
}

.profile-card,
.security-card,
.side-card {
  border: 1px solid #cbd8ea;
  border-radius: 16px;
  background: #ffffff;
}

.profile-card {
  min-height: 386px;
  padding: 24px;
}

.security-card {
  min-height: 255px;
  padding: 24px;
}

.side-column {
  display: grid;
  gap: 18px;
}

.side-card {
  padding: 22px 20px;
}

.profile-card h2,
.security-card h2,
.side-card h2 {
  margin: 0 0 18px;
  color: #111827;
  font-size: 15px;
  font-weight: 900;
}

.photo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.avatar-preview {
  width: 49px;
  height: 49px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-actions {
  display: grid;
  gap: 8px;
}

.photo-actions > div {
  display: flex;
  gap: 8px;
}

.photo-actions p {
  margin: 0;
  color: #94a3b8;
  font-size: 11px;
}

.outline-green-btn,
.solid-green-small,
.solid-green-btn,
.outline-green-wide {
  height: 28px;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 900;
}

.outline-green-btn {
  border: 1px solid #16a34a;
  background: #ffffff;
  color: #16a34a;
}

.solid-green-small {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: #ffffff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 16px;
}

.form-label {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
}

.form-label.full {
  margin-bottom: 16px;
}

.form-control {
  width: 100%;
  height: 32px;
  margin-top: 6px;
  border: 1px solid #cbd8ea;
  border-radius: 4px;
  background: #ffffff;
  color: #334155;
  padding: 0 11px;
  outline: 0;
  font-size: 13px;
  font-weight: 700;
}

.form-control:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.08);
}

.form-control.readonly {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.solid-green-btn {
  height: 32px;
  min-width: 115px;
  border: 1px solid #16a34a;
  background: #16a34a;
  color: #ffffff;
}

.outline-green-wide {
  height: 32px;
  margin-top: 16px;
  border: 1px solid #16a34a;
  background: #ffffff;
  color: #16a34a;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.check-row input {
  width: 15px;
  height: 15px;
  accent-color: #16a34a;
}

.success-message {
  margin: 12px 0 0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 900;
}

.error-message {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 1100px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .profile-card,
  .security-card,
  .side-card {
    padding: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .photo-row {
    align-items: flex-start;
  }

  .photo-actions > div {
    flex-wrap: wrap;
  }
}
</style>