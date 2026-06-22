<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const params = new URLSearchParams(location.search)
  window.opener?.postMessage(
    { kind: 'ctftimeCallback', state: params.get('state'), ctftimeCode: params.get('code') },
    location.origin
  )
  window.close()
})
</script>

<template></template>
