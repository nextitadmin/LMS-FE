<template>
  <div class="table-shell">
    <table>
      <slot />
    </table>
  </div>
</template>

<style scoped>
.table-shell {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #d5deeb;
  border-radius: 10px;
  background: white;
}

table {
  width: 100%;
  border-collapse: collapse;
}

:deep(thead) {
  background: #f8fafc;
}

:deep(th) {
  height: 52px;
  padding: 0 18px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  text-align: left;
  border-bottom: 1px solid #d5deeb;
}

:deep(td) {
  height: 58px;
  padding: 0 18px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #edf2f7;
}

:deep(tbody tr:hover) {
  background: #f8fafc;
}
</style>