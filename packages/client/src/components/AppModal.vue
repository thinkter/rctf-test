<template>
  <Teleport to="body">
    <div
      v-if="open || isLinger"
      :class="['modal shown animated', { leaving: !open }]"
      :hidden="!(open || isLinger)"
    >
      <div class="modal-overlay" @click="$emit('close')" aria-label="Close" />
      <div class="modal-content" role="document">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const ANIMATION_DURATION = 150
const isLinger = ref(props.open)

watch(() => props.open, (val) => {
  if (val) {
    isLinger.value = true
  } else {
    setTimeout(() => { isLinger.value = false }, ANIMATION_DURATION)
  }
})

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) emit('close')
}
onMounted(() => document.addEventListener('keyup', handleKey))
onUnmounted(() => document.removeEventListener('keyup', handleKey))
</script>

<style scoped>
.animated {
  animation: fade-in 150ms ease-out;
}

.animated .modal-content {
  animation: scale-in 150ms ease-out;
}

.animated.leaving {
  opacity: 0;
  transition: opacity 150ms ease-in;
}

.animated.leaving .modal-content {
  transform: scale(0.8);
  transition: transform 150ms ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.8); }
  to { transform: scale(1); }
}
</style>
