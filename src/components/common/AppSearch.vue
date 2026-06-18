<template>
  <div class="search-box">
    <Search :size="16" />

    <input
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { Search } from "lucide-vue-next";

defineProps({
  modelValue: String,
  placeholder: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #d7e0eb;
  border-radius: 999px;
  background: white;
}

.search-box svg {
  color: #94a3b8;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  color: #334155;
  font-size: 13px;
}

.search-box input::placeholder {
  color: #94a3b8;
}
</style>