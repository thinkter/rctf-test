<template>
  <div :class="`toast toast--${type}`">
    {{ body }}
    <button class="btn-close" @click="dismiss">×</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useToastStore } from '../stores/toast'

const props = defineProps<{ id: number; type?: string; body: string }>()
const store = useToastStore()

const dismiss = () => store.remove(props.id)

let timer: ReturnType<typeof setTimeout>
onMounted(() => { timer = setTimeout(dismiss, 5000) })
onUnmounted(() => clearTimeout(timer))
</script>
