<template>
  <div class="row u-center">
    <a class="action-button" v-bind="linkAttrs" v-html="html"></a>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  html: string
  externalLinks?: boolean
}>()

const attrs = useAttrs()

const linkAttrs = computed(() => {
  if (!props.externalLinks) return attrs

  const rel = typeof attrs.rel === 'string' ? attrs.rel : ''

  return {
    ...attrs,
    target: '_blank',
    rel: rel.split(/\s+/).includes('noopener') ? rel : `${rel} noopener`.trim(),
  }
})
</script>

<style scoped>
.action-button {
  padding: 16px !important;
  color: #fff;
  background: #222;
  box-shadow: rgba(250, 250, 250, 0.6) 0 0 1rem 0;
  font-size: 20px;
  border-radius: 1rem;
  text-align: center;
  transition: box-shadow ease-in-out 0.2s, transform ease-in-out 0.2s;
  margin: 20px auto;
}

.action-button:hover {
  box-shadow: rgba(250, 250, 250, 0.6) 0 0 1.1rem 0;
  transform: scale(1.1);
  color: #fff;
}

.action-button :deep(svg) {
  height: 1em;
  position: relative;
  top: 0.125em;
}
</style>
