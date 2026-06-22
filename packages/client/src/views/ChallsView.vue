<template>
  <template v-if="loadState === 'pending'" />
  <NotStarted v-else-if="loadState === 'notStarted'" />
  <div v-else class="row challs-row">
    <div class="col-3">
      <div class="frame challs-frame">
        <div class="frame__body">
          <div class="frame__title title">Filters</div>
          <div class="show-solved">
            <div class="form-ext-control form-ext-checkbox">
              <input
                id="show-solved"
                class="form-ext-input"
                type="checkbox"
                v-model="showSolved"
              />
              <label for="show-solved" class="form-ext-label">
                Show Solved ({{ solvedCount }}/{{ problems?.length ?? 0 }} solved)
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="frame challs-frame">
        <div class="frame__body">
          <div class="frame__title title">Categories</div>
          <div
            v-for="[category, { solved, total }] in sortedCategories"
            :key="category"
            class="form-ext-control form-ext-checkbox"
          >
            <input
              :id="`category-${category}`"
              :data-category="category"
              class="form-ext-input"
              type="checkbox"
              v-model="categories[category]"
            />
            <label :for="`category-${category}`" class="form-ext-label">
              {{ category }} ({{ solved }}/{{ total }} solved)
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6">
      <Problem
        v-for="problem in problemsToDisplay"
        :key="problem.id"
        :problem="problem"
        :solved="solveIDs.includes(problem.id)"
        @setSolved="setSolved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Problem from '../components/Problem.vue'
import NotStarted from '../components/NotStarted.vue'
import { getChallenges, getPrivateSolves } from '../api/challenges'
import { useToast } from '../stores/toast'
import config from '../config'

const { toast } = useToast()
const challPageState = JSON.parse(window.localStorage.getItem('challPageState') || '{}')

const problems = ref<any[] | null>(null)
const categories = ref<Record<string, boolean>>(challPageState.categories || {})
const showSolved = ref<boolean>(challPageState.showSolved || false)
const solveIDs = ref<string[]>([])
const loadState = ref<'pending' | 'notStarted' | 'loaded'>('pending')

onMounted(async () => {
  document.title = `Challenges | ${config.ctfName}`

  const { data, error, notStarted } = await getChallenges()
  if (error) { toast({ body: error, type: 'error' }); return }

  if (notStarted) { loadState.value = 'notStarted'; return }

  const newCats = { ...categories.value }
  data.forEach((p: any) => {
    if (newCats[p.category] === undefined) newCats[p.category] = false
  })
  problems.value = data
  categories.value = newCats
  loadState.value = 'loaded'

  const { data: solves, error: sErr } = await getPrivateSolves()
  if (sErr) { toast({ body: sErr, type: 'error' }); return }
  solveIDs.value = solves.map((s: any) => s.id)
})

watch([categories, showSolved], () => {
  window.localStorage.challPageState = JSON.stringify({ categories: categories.value, showSolved: showSolved.value })
}, { deep: true })

const setSolved = (id: string) => {
  if (!solveIDs.value.includes(id)) solveIDs.value = [...solveIDs.value, id]
}

const categoryCounts = computed(() => {
  const counts = new Map<string, { total: number; solved: number }>()
  if (problems.value) {
    for (const p of problems.value) {
      if (!counts.has(p.category)) counts.set(p.category, { total: 0, solved: 0 })
      const entry = counts.get(p.category)!
      entry.total++
      if (solveIDs.value.includes(p.id)) entry.solved++
    }
  }
  return counts
})

const solvedCount = computed(() => {
  if (!problems.value) return 0
  return problems.value.filter(p => solveIDs.value.includes(p.id)).length
})

const sortedCategories = computed(() =>
  Array.from(categoryCounts.value.entries()).sort((a, b) => a[0].localeCompare(b[0]))
)

const problemsToDisplay = computed(() => {
  if (!problems.value) return []
  let filtered = [...problems.value]
  if (!showSolved.value) filtered = filtered.filter(p => !solveIDs.value.includes(p.id))

  const activeCats = Object.entries(categories.value).filter(([, v]) => v).map(([k]) => k)
  if (activeCats.length) filtered = filtered.filter(p => activeCats.includes(p.category))

  return filtered.sort((a, b) => {
    if (a.points !== b.points) return a.points - b.points
    if (a.solves !== b.solves) return b.solves - a.solves
    return (b.sortWeight || 0) - (a.sortWeight || 0)
  })
})
</script>

<style scoped>
.challs-row { justify-content: center; }
.challs-row :deep(.title),
.challs-row :deep(.frame__subtitle) { color: #fff; }
.challs-frame { margin-bottom: 1em; padding-bottom: 0.625em; background: #222; }
.show-solved { margin-bottom: 0.625em; }
</style>
