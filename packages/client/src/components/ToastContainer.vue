<template>
  <div v-if="store.toasts.length" class="toast-container">
    <ToastItem
      v-for="t in store.toasts"
      :key="t.id"
      :id="t.id"
      :type="t.type"
      :body="t.body"
    />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toast'
import ToastItem from './ToastItem.vue'
const store = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1em;
  right: 1em;
  z-index: 9999;
  width: 320px;
}
</style>
