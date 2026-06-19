<template>
  <span
    class="badge"
    :class="type"
  >
    <slot />
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: "success",
  },
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 24px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
}

.success {
  color: #15803d;
  background: #dcfce7;
  border: 1px solid #86efac;
}

.warning {
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.danger {
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fca5a5;
}

.info {
  color: #2563eb;
  background: #dbeafe;
  border: 1px solid #93c5fd;
}
</style>