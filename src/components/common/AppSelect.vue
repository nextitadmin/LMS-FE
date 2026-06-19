<template>
  <select
    class="app-select"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot />
  </select>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.app-select {
  min-width: 160px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d7e0eb;
  border-radius: 4px;
  background: white;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}
</style>