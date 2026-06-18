<template>
  <div class="stat-card">
    <div
      class="icon-box"
      :class="color"
    >
      <component
        :is="icon"
        :size="28"
      />
    </div>

    <div class="content">
      <p>{{ title }}</p>

      <h3 :class="color">
        {{ value }}
      </h3>

      <span>
        {{ subtitle }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  subtitle: String,
  icon: Object,
  color: String,
});
</script>

<style scoped>
.stat-card {
  background: white;
  border: 1px solid #d9e2ef;
  border-radius: 10px;
  padding: 26px;
  display: flex;
  align-items: center;
  gap: 22px;
}

.icon-box {
  width: 62px;
  height: 62px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blue {
  background: #1677ff;
}

.purple {
  background: #8b5cf6;
}

.green {
  background: #16a34a;
}

.content p {
  margin: 0 0 6px;
  font-size: 13px;
  text-transform: uppercase;
  color: #475569;
  font-weight: 600;
}

.content h3 {
  margin: 0 0 6px;
  font-size: 36px;
  font-family: Georgia, serif;
}

.content h3.blue {
  color: #1677ff;
  background: transparent;
}

.content h3.purple {
  color: #8b5cf6;
  background: transparent;
}

.content h3.green {
  color: #16a34a;
  background: transparent;
}

.content span {
  color: #64748b;
  font-size: 13px;
}
</style>