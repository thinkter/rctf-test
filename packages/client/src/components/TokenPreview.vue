<template>
  <blockquote class="token-preview">{{ token }}</blockquote>
</template>

<script setup lang="ts">
defineProps<{ token: string }>()
</script>

<style scoped>
.token-preview {
  font-size: small;
  overflow-wrap: break-word;
  user-select: all;
  font-family: monospace !important;
  cursor: pointer;
  background: #111;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  color: #ccc;
  width: 100%;
}
</style>
