const materials = [];
const drafts = [];

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

export function getCourseMaterials(courseId) {
  return materials.filter((material) => material.courseId === courseId);
}

export function getCourseVideos(courseId) {
  return materials.filter(
    (material) => material.courseId === courseId && material.type === "mp4"
  );
}

export function getRecentMaterials(courseId) {
  return getCourseMaterials(courseId).slice(0, 4);
}

export function addMaterial(payload) {
  const material = {
    id: `mat-${Date.now()}`,
    courseId: sanitizeText(payload.courseId),
    title: sanitizeText(payload.title),
    description: sanitizeText(payload.description),
    type: sanitizeText(payload.type),
    category: sanitizeText(payload.category),
    week: Number(payload.week),
    date: "Today",
    size: sanitizeText(payload.size),
    allowDownload: Boolean(payload.allowDownload),
    fileUrl: payload.fileUrl || "",
    fileName: sanitizeText(payload.fileName),
    mimeType: sanitizeText(payload.mimeType),
    duration: payload.duration || "00:00",
  };

  materials.unshift(material);
  return material;
}

export function deleteMaterial(materialId) {
  const index = materials.findIndex((material) => material.id === materialId);

  if (index !== -1) {
    const material = materials[index];

    if (material.fileUrl) {
      URL.revokeObjectURL(material.fileUrl);
    }

    materials.splice(index, 1);
  }
}

export function saveMaterialDraft(payload) {
  const draft = {
    id: `draft-${Date.now()}`,
    ...payload,
  };

  drafts.unshift(draft);
  return draft;
}

export function getMaterialDrafts() {
  return drafts;
}