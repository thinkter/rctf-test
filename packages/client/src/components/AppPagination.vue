<template>
  <div class="pagination u-center">
    <div class="pagination-item short" :class="{ disabled: page === 1 }">
      <a href="#" @click.prevent="changePage(page - 1)">&lt;</a>
    </div>

    <template v-if="paging.startPage > 1">
      <div class="pagination-item short">
        <a href="#" @click.prevent="changePage(1)">1</a>
      </div>
      <div class="pagination-item short no-hover">
        <a class="ellipses" tabindex="-1">&hellip;</a>
      </div>
    </template>

    <div
      v-for="p in paging.pages"
      :key="p"
      class="pagination-item short"
      :class="{ selected: p === page }"
    >
      <a href="#" @click.prevent="changePage(p)">{{ p }}</a>
    </div>

    <template v-if="paging.endPage < totalPages">
      <div class="pagination-item short no-hover">
        <a class="ellipses" tabindex="-1">&hellip;</a>
      </div>
      <div class="pagination-item short">
        <a href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
      </div>
    </template>

    <div class="pagination-item short" :class="{ disabled: page === totalPages }">
      <a href="#" @click.prevent="changePage(page + 1)">&gt;</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  pageSize: number
  page: number
  numVisiblePages?: number
}>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const paging = computed(() => {
  const n = props.numVisiblePages ?? 9
  const tp = totalPages.value
  let sp: number, ep: number

  if (tp <= n) {
    sp = 1; ep = tp
  } else {
    sp = props.page - Math.ceil((n - 1) / 2)
    ep = props.page + Math.floor((n - 1) / 2)
    if (sp < 1) { sp = 1; ep = n }
    else if (ep > tp) { ep = tp; sp = tp - n + 1 }
    if (sp > 1) sp += 2
    if (ep < tp) ep -= 2
  }
  const pages: number[] = []
  for (let i = sp; i <= ep; i++) pages.push(i)
  return { pages, startPage: sp, endPage: ep }
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) emit('update:page', p)
}
</script>

<style scoped>
.no-hover a {
  background: transparent !important;
  cursor: default;
}

.disabled a {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
