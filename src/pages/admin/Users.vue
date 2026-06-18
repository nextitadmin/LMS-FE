<template>
  <div class="users-page">
    <div class="page-header users-header">
      <div>
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">Manage students, lecturers, and administrators</p>
      </div>

      <AppButton @click="openAddUser">Add User</AppButton>
    </div>

    <div class="filters-card">
      <div class="filters-row">
        <div class="search-container">
          <AppSearch
            v-model="search"
            placeholder="Search by name, ID, or email..."
          />
        </div>

        <AppSelect v-model="roleFilter">
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Admin">Admin</option>
        </AppSelect>

        <AppSelect v-model="facultyFilter">
          <option value="">All Faculties</option>
          <option value="Science, Eng & Technology">Science, Eng & Technology</option>
          <option value="Management & Social Sci.">Management & Social Sci.</option>
          <option value="Health Sciences">Health Sciences</option>
          <option value="Humanities & Culture">Humanities & Culture</option>
        </AppSelect>
      </div>
    </div>

    <AppTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Faculty</th>
          <th>Status</th>
          <th>Last Login</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>
            <div class="user-cell">
              <div class="avatar" :class="user.role.toLowerCase()">
                {{ getInitials(user.name) }}
              </div>

              <div>
                <strong>{{ user.name }}</strong>
                <span>{{ user.identifier }}</span>
              </div>
            </div>
          </td>

          <td>{{ user.role }}</td>
          <td>{{ user.faculty }}</td>

          <td>
            <AppBadge :type="user.status === 'Active' ? 'success' : 'danger'">
              {{ user.status }}
            </AppBadge>
          </td>

          <td>{{ user.lastLogin }}</td>

          <td>
            <button class="action-btn" @click="openEditUser(user)">
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </AppTable>

    <AppModal v-model="isModalOpen">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h2>{{ modalMode === "add" ? "Add User" : "Edit User" }}</h2>
            <p>
              {{ modalMode === "add"
                ? "Create a new LMS user account."
                : "Update user details and account status." }}
            </p>
          </div>

          <button type="button" class="close-btn" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="handleSaveUser">
          <div class="form-grid">
            <label class="form-label">
              Full Name
              <input
                v-model.trim="userForm.name"
                class="form-input"
                maxlength="80"
                autocomplete="off"
              />
            </label>

            <label class="form-label">
              Identifier / Matric No.
              <input
                v-model.trim="userForm.identifier"
                class="form-input"
                maxlength="40"
                autocomplete="off"
              />
            </label>

            <label class="form-label">
              Email
              <input
                v-model.trim="userForm.email"
                class="form-input"
                type="email"
                maxlength="120"
                autocomplete="off"
              />
            </label>

            <label class="form-label">
              Role
              <select v-model="userForm.role" class="form-select">
                <option>Student</option>
                <option>Lecturer</option>
                <option>Admin</option>
              </select>
            </label>

            <label class="form-label">
              Faculty
              <select v-model="userForm.faculty" class="form-select">
                <option>Science, Eng & Technology</option>
                <option>Management & Social Sci.</option>
                <option>Health Sciences</option>
                <option>Humanities & Culture</option>
              </select>
            </label>

            <label class="form-label">
              Last Login
              <input
                v-model.trim="userForm.lastLogin"
                class="form-input"
                maxlength="40"
                autocomplete="off"
              />
            </label>
          </div>

          <div class="status-row">
            <div>
              <strong>Account Status</strong>
              <span>{{ userForm.isActive ? "Active" : "Inactive" }}</span>
            </div>

            <AppToggle v-model="userForm.isActive" />
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <AppButton type="button" variant="secondary" @click="closeModal">
              Cancel
            </AppButton>

            <AppButton type="submit">
              {{ modalMode === "add" ? "Create User" : "Save Changes" }}
            </AppButton>
          </div>
        </form>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import AppBadge from "../../components/common/AppBadge.vue";
import AppButton from "../../components/common/AppButton.vue";
import AppModal from "../../components/common/AppModal.vue";
import AppSearch from "../../components/common/AppSearch.vue";
import AppSelect from "../../components/common/AppSelect.vue";
import AppToggle from "../../components/common/AppToggle.vue";
import AppTable from "../../components/tables/AppTable.vue";

const search = ref("");
const roleFilter = ref("");
const facultyFilter = ref("");
const isModalOpen = ref(false);
const modalMode = ref("add");
const editingUserId = ref(null);
const formError = ref("");

const users = ref([
  {
    id: 1,
    name: "Adebayo Johnson",
    identifier: "UNIOSUN/CSC/20/001",
    email: "adebayo@student.edu",
    role: "Student",
    faculty: "Science, Eng & Technology",
    status: "Active",
    isActive: true,
    lastLogin: "Today, 09:32",
  },
  {
    id: 2,
    name: "Dr. Folake Adesanya",
    identifier: "STAFF001",
    email: "folake@uniosun.edu.ng",
    role: "Lecturer",
    faculty: "Science, Eng & Technology",
    status: "Active",
    isActive: true,
    lastLogin: "Yesterday, 16:08",
  },
  {
    id: 3,
    name: "Sola Adeyemi",
    identifier: "ADM001",
    email: "sola@uniosun.edu.ng",
    role: "Admin",
    faculty: "ICT",
    status: "Active",
    isActive: true,
    lastLogin: "Today, 11:21",
  },
  {
    id: 4,
    name: "Kehinde Adebisi",
    identifier: "UNIOSUN/ACC/21/044",
    email: "kehinde@student.edu",
    role: "Student",
    faculty: "Management & Social Sci.",
    status: "Inactive",
    isActive: false,
    lastLogin: "2 weeks ago",
  },
]);

const userForm = reactive({
  name: "",
  identifier: "",
  email: "",
  role: "Student",
  faculty: "Science, Eng & Technology",
  lastLogin: "Never",
  isActive: true,
});

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase();

  return users.value.filter((user) => {
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.identifier.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    const matchesRole = !roleFilter.value || user.role === roleFilter.value;
    const matchesFaculty = !facultyFilter.value || user.faculty === facultyFilter.value;

    return matchesSearch && matchesRole && matchesFaculty;
  });
});

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function resetForm() {
  Object.assign(userForm, {
    name: "",
    identifier: "",
    email: "",
    role: "Student",
    faculty: "Science, Eng & Technology",
    lastLogin: "Never",
    isActive: true,
  });

  editingUserId.value = null;
  formError.value = "";
}

function openAddUser() {
  modalMode.value = "add";
  resetForm();
  isModalOpen.value = true;
}

function openEditUser(user) {
  modalMode.value = "edit";
  editingUserId.value = user.id;
  formError.value = "";

  Object.assign(userForm, {
    name: user.name,
    identifier: user.identifier,
    email: user.email,
    role: user.role,
    faculty: user.faculty,
    lastLogin: user.lastLogin,
    isActive: user.isActive,
  });

  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  resetForm();
}

function validateUserForm() {
  if (!sanitizeText(userForm.name)) return "Full name is required.";
  if (!sanitizeText(userForm.identifier)) return "Identifier is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
    return "Enter a valid email address.";
  }

  return "";
}

function buildPayload() {
  return {
    name: sanitizeText(userForm.name),
    identifier: sanitizeText(userForm.identifier),
    email: sanitizeText(userForm.email).toLowerCase(),
    role: sanitizeText(userForm.role),
    faculty: sanitizeText(userForm.faculty),
    lastLogin: sanitizeText(userForm.lastLogin) || "Never",
    isActive: Boolean(userForm.isActive),
    status: userForm.isActive ? "Active" : "Inactive",
  };
}

function handleSaveUser() {
  const error = validateUserForm();

  if (error) {
    formError.value = error;
    return;
  }

  const payload = buildPayload();

  if (modalMode.value === "edit") {
    users.value = users.value.map((user) =>
      user.id === editingUserId.value
        ? { ...user, ...payload }
        : user
    );
  } else {
    users.value.unshift({
      id: Date.now(),
      ...payload,
    });
  }

  closeModal();
}

function getInitials(name) {
  return sanitizeText(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
</script>

<style scoped>
.users-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.filters-card {
  margin-bottom: 24px;
  padding: 18px;
  border: 1px solid #d5deeb;
  border-radius: 10px;
  background: #ffffff;
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-container {
  flex: 1;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
}

.avatar.student {
  background: #0875f5;
}

.avatar.lecturer {
  background: #8b5cf6;
}

.avatar.admin {
  background: #f59e0b;
}

.user-cell strong {
  display: block;
  color: #26344d;
  font-size: 13px;
  font-weight: 800;
}

.user-cell span {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.action-btn {
  border: 0;
  background: transparent;
  color: #0875f5;
  font-size: 13px;
  font-weight: 800;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 6px;
  color: #111827;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 900;
}

.modal-header p {
  margin: 0;
  color: #64748b;
}

.close-btn {
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 26px;
  line-height: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding: 14px 0;
}

.status-row strong {
  display: block;
  color: #334155;
  font-size: 14px;
  font-weight: 800;
}

.status-row span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.form-error {
  margin: 8px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

@media (max-width: 900px) {
  .filters-row,
  .users-header {
    flex-direction: column;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>