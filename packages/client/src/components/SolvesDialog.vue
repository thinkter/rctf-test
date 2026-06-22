<template>
  <AppModal :open="solves !== null" @close="$emit('close')">
    <template v-if="solves !== null">
      <template v-if="solves.length === 0">
        <div class="empty-solves">
          <div class="clock-icon"><Clock /></div>
          <h5>{{ challName }} has no solves.</h5>
        </div>
      </template>
      <template v-else>
        <div class="modal-header">
          <div class="modal-title">Solves for {{ challName }}</div>
        </div>
        <div class="modal-body solves-body" ref="bodyRef">
          <div class="solves-table">
            <div class="label">#</div>
            <div class="label">Team</div>
            <div class="label">Solve time</div>
            <template v-for="(solve, i) in solves" :key="solve.userId">
              <div class="inline-label number">#</div>
              <div class="number">{{ (page - 1) * pageSize + i + 1 }}</div>
              <div class="inline-label">Team</div>
              <div class="name">
                <RouterLink :to="`/profile/${solve.userId}`">{{ solve.userName }}</RouterLink>
              </div>
              <div class="inline-label">Solve time</div>
              <div>{{ formatRelativeTime(solve.createdAt) }}</div>
            </template>
          </div>
          <AppPagination
            :totalItems="solveCount"
            :pageSize="pageSize"
            :page="page"
            @update:page="$emit('update:page', $event)"
          />
        </div>
      </template>
      <div class="modal-footer">
        <div class="btn-container u-inline-block">
          <button class="btn-small outline" @click.prevent="$emit('close')">Close</button>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from './AppModal.vue'
import AppPagination from './AppPagination.vue'
import { formatRelativeTime } from '../util/time'
import Clock from '../icons/clock.svg'

const props = defineProps<{
  solves: any[] | null
  challName: string
  solveCount: number
  pageSize: number
  page: number
}>()

defineEmits<{ close: []; 'update:page': [page: number] }>()

const bodyRef = ref<HTMLElement | null>(null)

watch(() => props.page, () => {
  if (bodyRef.value) bodyRef.value.scrollTop = 0
})
</script>

<style scoped>
.empty-solves {
  padding: 3rem;
  text-align: center;
}

.clock-icon {
  width: 60px;
  margin: auto;
}

.solves-table {
  display: grid;
  grid-template-columns: repeat(3, max-content);
}

.solves-table > div {
  margin: auto;
  padding: 5px 10px;
  text-align: center;
  white-space: nowrap;
}

.label {
  border-bottom: 1px solid #fff;
  width: 100%;
  text-align: center;
}

.name {
  overflow: hidden;
  width: 300px;
}

.inline-label {
  display: none;
}

.solves-body {
  max-height: 60vh !important;
}

@media (max-width: 768px) {
  .inline-label {
    display: initial;
    border-right: 1px solid #fff;
  }

  .solves-table {
    grid-template-columns: repeat(2, minmax(max-content, 1fr));
  }

  .solves-table > div {
    margin: 0;
  }

  .label {
    display: none;
  }

  .number {
    border-top: 1px solid #fff;
  }

  .name {
    width: initial;
    max-width: 300px;
  }
}
</style>
