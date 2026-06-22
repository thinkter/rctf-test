<template>
  <div class="card solves-grid" :class="{ 'private-solves': isPrivate }">
    <template v-if="solves.length === 0">
      <div class="title-span">
        <div class="clock-icon"><Clock /></div>
        <h5>This team has no solves.</h5>
      </div>
    </template>
    <template v-else>
      <h5 class="title title-span">Solves</h5>
      <div class="label">Category</div>
      <div class="label">Challenge</div>
      <div class="label">Solve time</div>
      <div class="label">Points</div>
      <template v-for="solve in solves" :key="solve.id">
        <div class="inline-label category-cell">Category</div>
        <div class="category-cell">{{ solve.category }}</div>
        <div class="inline-label">Name</div>
        <div>{{ solve.name }}</div>
        <div class="inline-label">Solve time</div>
        <div>{{ formatRelativeTime(solve.createdAt) }}</div>
        <div class="inline-label">Points</div>
        <div>{{ solve.points }}</div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import Clock from '../../icons/clock.svg'
import { formatRelativeTime } from '../../util/time'

defineProps<{ solves: any[]; isPrivate?: boolean }>()
</script>

<style scoped>
.solves-grid {
  display: grid;
  padding: 20px;
  padding-top: 0;
  grid-template-columns: repeat(4, minmax(max-content, 1fr));
}

.solves-grid > div {
  margin: auto;
  padding: 10px;
}

.title-span { grid-column: 1 / -1; margin: 20px auto !important; }
.label { border-bottom: 1px solid #fff; width: 100%; text-align: center; }
.inline-label { display: none; }
.clock-icon { width: 60px; margin: auto !important; }

@media (max-width: 1500px) {
  .private-solves .inline-label { display: initial; border-right: 1px solid #fff; }
  .private-solves.solves-grid { grid-template-columns: repeat(2, minmax(max-content, 1fr)); }
  .private-solves.solves-grid > div { margin: 0; }
  .private-solves .label { display: none; }
  .private-solves .category-cell { border-top: 1px solid #fff; }
}

@media (max-width: 800px) {
  .inline-label { display: initial; border-right: 1px solid #fff; }
  .solves-grid { grid-template-columns: repeat(2, minmax(max-content, 1fr)); }
  .solves-grid > div { margin: 0; }
  .label { display: none; }
  .category-cell { border-top: 1px solid #fff; }
}
</style>
