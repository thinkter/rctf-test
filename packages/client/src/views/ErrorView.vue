<template>
  <div class="row u-text-center u-center">
    <div class="col-4">
      <h1>{{ error }}</h1>
      <p class="font-thin">{{ message || 'There was an error' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import config from '../config'

const props = defineProps<{ error?: string; message?: string }>()
onMounted(() => { document.title = `Error | ${config.ctfName}` })
</script>
