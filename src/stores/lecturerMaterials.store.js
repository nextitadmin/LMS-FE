import { defineStore } from "pinia";

const STORAGE_KEY = "uniosun_lms_lecturer_materials_v1";

const defaultState = {
  materials: [],
  drafts: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : clone(defaultState);
  } catch {
    return clone(defaultState);
  }
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function getFileTypeFromName(name, category = "") {
  const ext = String(name || "").split(".").pop()?.toLowerCase();

  if (category === "Video Lectures") return "mp4";
  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx"].includes(ext)) return "pptx";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (ext === "mp4") return "mp4";
  if (ext === "zip") return "zip";

  return "file";
}

export const useLecturerMaterialsStore = defineStore("lecturerMaterials", {
  state: () => loadState(),

  getters: {
    getMaterialsByCourse: (state) => (courseId) => {
      return state.materials.filter(
        (material) =>
          material.courseId === courseId &&
          material.category !== "Video Lectures" &&
          material.type !== "mp4"
      );
    },

    getVideosByCourse: (state) => (courseId) => {
      return state.materials.filter(
        (material) =>
          material.courseId === courseId &&
          (material.category === "Video Lectures" || material.type === "mp4")
      );
    },

    getAllUploadsByCourse: (state) => (courseId) => {
      return state.materials.filter((material) => material.courseId === courseId);
    },

    getRecentUploadsByCourse: (state) => (courseId) => {
      return state.materials
        .filter((material) => material.courseId === courseId)
        .slice(0, 4);
    },

    getDraftCount(state) {
      return state.drafts.length;
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          materials: this.materials,
          drafts: this.drafts,
        })
      );
    },

    addMaterial(payload) {
      const type = getFileTypeFromName(payload.fileName || payload.title, payload.category);

      const material = {
        id: `mat-${Date.now()}`,
        courseId: sanitizeText(payload.courseId),
        title: sanitizeText(payload.title),
        description: sanitizeText(payload.description),
        category: sanitizeText(payload.category),
        type,
        week: Number(payload.week),
        date: "Today",
        size: sanitizeText(payload.size),
        allowDownload: Boolean(payload.allowDownload),
        fileUrl: payload.fileUrl || "",
        fileName: sanitizeText(payload.fileName),
        mimeType: sanitizeText(payload.mimeType),
        duration: sanitizeText(payload.duration) || "00:00",
        createdAt: new Date().toISOString(),
      };

      this.materials.unshift(material);
      this.persist();

      return material;
    },

    deleteMaterial(materialId) {
      const material = this.materials.find((item) => item.id === materialId);

      if (material?.fileUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(material.fileUrl);
      }

      this.materials = this.materials.filter((item) => item.id !== materialId);
      this.persist();
    },

    saveDraft(payload) {
      const draft = {
        id: `draft-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };

      this.drafts.unshift(draft);
      this.persist();

      return draft;
    },

    getLatestDraft() {
      return this.drafts[0] || null;
    },
  },
});