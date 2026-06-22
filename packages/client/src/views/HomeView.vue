<template>
  <div class="row u-center">
    <div class="col-6 home-content">
      <AppMarkdown :content="config.homeContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import config from '../config'
import AppMarkdown from '../components/AppMarkdown.vue'

onMounted(() => { document.title = config.ctfName })
</script>

<style scoped>
.home-content :deep(a) {
  display: inline;
  padding: 0;
}

.home-content :deep(h1),
.home-content :deep(h2),
.home-content :deep(h3) {
  margin: 32px 0 16px 0;
}
</style>
