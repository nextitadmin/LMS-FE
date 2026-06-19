<template>
  <button
    type="button"
    class="toggle"
    :class="{ active: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span></span>
  </button>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.toggle {
  position: relative;
  width: 38px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: #cbd5e1;
}

.toggle span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: 0.2s;
}

.toggle.active {
  background: #16a34a;
}

.toggle.active span {
  transform: translateX(16px);
}
</style>