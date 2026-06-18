<template>
  <button
    :type="type"
    class="app-button"
    :class="variant"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.app-button {
  height: 38px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 800;
  transition: 0.2s ease;
}

.primary {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}

.primary:hover:not(:disabled) {
  background: #15803d;
}

.secondary {
  border: 1px solid #16a34a;
  background: white;
  color: #16a34a;
}

.secondary:hover:not(:disabled) {
  background: #f0fdf4;
}

.danger {
  border: 1px solid #ef4444;
  background: white;
  color: #ef4444;
}

.danger:hover:not(:disabled) {
  background: #fef2f2;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>