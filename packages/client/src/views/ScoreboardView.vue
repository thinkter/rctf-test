<template>
  <template v-if="scoreLoadState === 'pending' || graphLoadState === 'pending'" />
  <NotStarted v-else-if="scoreLoadState === 'notStarted' || graphLoadState === 'notStarted'" />
  <div v-else class="row u-center" style="align-items: initial !important">
    <div class="col-12 u-center">
      <div class="col-8">
        <AppGraph :graphData="graphData" />
      </div>
    </div>
    <div class="col-3">
      <div class="frame score-frame">
        <div class="frame__body">
          <template v-if="Object.keys(config.divisions).length > 1">
            <div class="frame__subtitle">Filter by division</div>
            <div class="input-control">
              <select required class="select" name="division" v-model="division" @change="onDivisionChange">
                <option value="all" selected>All</option>
                <option v-for="[code, name] in Object.entries(config.divisions)" :key="code" :value="code">{{ name }}</option>
              </select>
            </div>
          </template>
          <div class="frame__subtitle">Teams per page</div>
          <div class="input-control">
            <select required class="select" name="pagesize" v-model="pageSize" @change="onPageSizeChange">
              <option v-for="sz in PAGESIZE_OPTIONS" :key="sz" :value="sz">{{ sz }}</option>
            </select>
          </div>
          <div v-if="loggedIn" class="btn-container u-center" style="margin-top: 0.5rem">
            <button :disabled="!isUserOnCurrentScoreboard" @click="goToSelfPage">
              Go to my team
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="frame score-frame score-table-frame">
        <div class="frame__body">
          <table class="table small score-table">
            <thead>
              <tr>
                <th style="width: 3.5em">#</th>
                <th>Team</th>
                <th style="width: 5em">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ id, name, score, rank } in scores"
                :key="id"
                :class="{ 'self-row': profile && profile.id === id }"
                :ref="el => { if (profile && profile.id === id) selfRow = el as HTMLElement }"
              >
                <td>{{ rank }}</td>
                <td><RouterLink :to="`/profile/${id}`">{{ name }}</RouterLink></td>
                <td>{{ score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppPagination
          v-if="totalItems > pageSize"
          :totalItems="totalItems"
          :pageSize="pageSize"
          :page="page"
          @update:page="setPage"
          :numVisiblePages="9"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotStarted from '../components/NotStarted.vue'
import AppGraph from '../components/AppGraph.vue'
import AppPagination from '../components/AppPagination.vue'
import config from '../config'
import { getScoreboard, getGraph } from '../api/scoreboard'
import { privateProfile } from '../api/profile'
import { useToast } from '../stores/toast'

const { toast } = useToast()
const route = useRoute()
const router = useRouter()

const PAGESIZE_OPTIONS = [25, 50, 100]
const loggedIn = computed(() => !!localStorage.getItem('token'))
const scoreboardState = JSON.parse(localStorage.getItem('scoreboardPageState') || '{}')

const profile = ref<any>(null)
const pageSize = ref<number>(Number(route.query.pageSize) || scoreboardState.pageSize || 100)
const scores = ref<any[]>([])
const graphData = ref<any>(null)
const division = ref<string>(String(route.query.division || scoreboardState.division || 'all'))
const page = ref<number>(Number(route.query.page) || 1)
const totalItems = ref(0)
const scoreLoadState = ref<'pending' | 'notStarted' | 'loaded'>('pending')
const graphLoadState = ref<'pending' | 'notStarted' | 'loaded'>('pending')
const selfRow = ref<HTMLElement | null>(null)
const needsScrollToSelf = ref(false)

onMounted(async () => {
  document.title = `Scoreboard | ${config.ctfName}`
  if (loggedIn.value) {
    const { data, error } = await privateProfile()
    if (error) toast({ body: error, type: 'error' })
    else profile.value = data
  }
})

const fetchScores = async () => {
  const div = division.value === 'all' ? undefined : division.value
  const { kind, data } = await getScoreboard({
    division: div,
    offset: (page.value - 1) * pageSize.value,
    limit: pageSize.value,
  })
  scoreLoadState.value = kind === 'badNotStarted' ? 'notStarted' : 'loaded'
  if (kind !== 'goodLeaderboard') return
  scores.value = data.leaderboard.map((e: any, i: number) => ({
    ...e,
    rank: i + 1 + (page.value - 1) * pageSize.value,
  }))
  totalItems.value = data.total
}

const fetchGraph = async () => {
  const div = division.value === 'all' ? undefined : division.value
  const { kind, data } = await getGraph({ division: div })
  graphLoadState.value = kind === 'badNotStarted' ? 'notStarted' : 'loaded'
  if (kind === 'goodLeaderboardGraph') graphData.value = data
}

watch([division, page, pageSize], fetchScores, { immediate: true })
watch(division, fetchGraph, { immediate: true })

watch([pageSize, division, page], () => {
  localStorage.setItem(
    'scoreboardPageState',
    JSON.stringify({ pageSize: pageSize.value, division: division.value })
  )
  if (page.value !== 1 || route.query.page) {
    router.replace({
      query: {
        page: String(page.value),
        division: division.value,
        pageSize: String(pageSize.value),
      },
    })
  }
})

const onDivisionChange = () => {
  page.value = 1
}
const onPageSizeChange = (e: Event) => {
  const newSize = Number((e.target as HTMLSelectElement).value)
  const newPage = Math.floor(((page.value - 1) * pageSize.value) / newSize) + 1
  pageSize.value = newSize
  page.value = newPage
}

const setPage = (p: number) => {
  page.value = p
}

const isUserOnCurrentScoreboard = computed(() =>
  loggedIn.value &&
  profile.value !== null &&
  profile.value.globalPlace !== null &&
  (division.value === 'all' ||
    Number.parseInt(division.value) === profile.value.division)
)

const isSelfVisible = computed(() => {
  if (!profile.value) return false
  return scores.value.some(s => s.id === profile.value.id)
})

const scrollToSelf = () => {
  if (selfRow.value) {
    selfRow.value.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

const goToSelfPage = () => {
  if (!isUserOnCurrentScoreboard.value) return
  const place = division.value === 'all' ? profile.value.globalPlace : profile.value.divisionPlace
  page.value = Math.floor((place - 1) / pageSize.value) + 1
  if (isSelfVisible.value) {
    scrollToSelf()
  } else {
    needsScrollToSelf.value = true
  }
}

watch(isSelfVisible, (visible) => {
  if (needsScrollToSelf.value && visible) {
    scrollToSelf()
    needsScrollToSelf.value = false
  }
})
</script>

<style scoped>
.score-frame {
  padding-bottom: 1.5em;
  padding-top: 2.125em;
  background: #222;
}

.score-frame :deep(.frame__subtitle) { color: #fff; }
.score-frame :deep(button),
.score-frame :deep(select),
.score-frame :deep(option) { background: #111; color: #fff; }

.score-table-frame { padding-top: 1.5em; }

.score-table { table-layout: fixed; }
.score-table :deep(tbody td) { overflow: hidden; white-space: nowrap; }

.self-row td { background-color: rgba(216,216,216,.07); }
.self-row:hover td { background-color: rgba(216,216,216,.20) !important; }
</style>
