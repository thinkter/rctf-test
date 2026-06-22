<template>
  <div class="markup" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import snarkdown from 'snarkdown'

const props = defineProps<{ content: string }>()

const snarkdownEnhanced = (md: string): string => {
  const htmls = md
    .split(/(?:\r?\n){2,}/)
    .map(l =>
      [' ', '\t', '#', '-', '*'].some(ch => l.startsWith(ch))
        ? snarkdown(l)
        : `<p>${snarkdown(l)}</p>`
    )
  return htmls.join('\n\n')
}

const html = computed(() => snarkdownEnhanced(props.content || ''))
</script>
