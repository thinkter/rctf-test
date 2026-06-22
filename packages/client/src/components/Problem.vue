<template>
  <div class="frame problem-frame">
    <div class="frame__body">
      <div class="row u-no-padding">
        <div class="col-6 u-no-padding">
          <div class="frame__title title">{{ problem.category }}/{{ problem.name }}</div>
          <div class="frame__subtitle u-no-margin">{{ problem.author }}</div>
        </div>
        <div class="col-6 u-no-padding u-text-right">
          <a
            class="points-link"
            :class="{ 'solves-pending': solvesPending }"
            @click.prevent="onSolvesClick"
          >
            {{ problem.solves }}{{ problem.solves === 1 ? ' solve / ' : ' solves / ' }}{{ problem.points }}{{ problem.points === 1 ? ' point' : ' points' }}
          </a>
        </div>
      </div>

      <div class="content-no-padding u-center">
        <div class="divider problem-divider" />
      </div>

      <div class="frame__subtitle problem-description">
        <AppMarkdown :content="problem.description" external-links />
      </div>

      <form class="form-section" @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            autocomplete="off"
            autocorrect="off"
            class="form-group-input input-small problem-input"
            :class="{ 'input-error': hasError, 'input-success': solved }"
            :placeholder="`Flag${solved ? ' (solved)' : ''}`"
            v-model="flagValue"
          />
          <button class="form-group-btn btn-small problem-submit">Submit</button>
        </div>
      </form>

      <div v-if="problem.files.length">
        <p class="frame__subtitle u-no-margin">Downloads</p>
        <div class="tag-container">
          <div v-for="file in problem.files" :key="file.url" class="tag problem-tag">
            <a :download="file.name" :href="file.url">{{ file.name }}</a>
          </div>
        </div>
      </div>
    </div>

    <SolvesDialog
      :solves="solves"
      :challName="problem.name"
      :solveCount="problem.solves"
      :pageSize="solvesPageSize"
      :page="solvesPage"
      @update:page="handleSetSolvesPage"
      @close="solves = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppMarkdown from './AppMarkdown.vue'
import SolvesDialog from './SolvesDialog.vue'
import { submitFlag, getSolves } from '../api/challenges'
import { useToast } from '../stores/toast'

const props = defineProps<{ problem: any; solved: boolean }>()
const emit = defineEmits<{ setSolved: [id: string] }>()
const { toast } = useToast()

const flagValue = ref('')
const hasError = ref(false)
const solves = ref<any[] | null>(null)
const solvesPending = ref(false)
const solvesPage = ref(1)
const solvesPageSize = 10

const handleSubmit = async () => {
  const { error } = await submitFlag(props.problem.id, flagValue.value.trim())
  if (error === undefined) {
    toast({ body: 'Flag successfully submitted!' })
    emit('setSolved', props.problem.id)
    hasError.value = false
  } else {
    toast({ body: error, type: 'error' })
    hasError.value = true
  }
}

const onSolvesClick = async () => {
  if (solvesPending.value) return
  solvesPending.value = true
  const { kind, message, data } = await getSolves({ challId: props.problem.id, limit: solvesPageSize, offset: 0 })
  solvesPending.value = false
  if (kind !== 'goodChallengeSolves') {
    toast({ body: message, type: 'error' })
    return
  }
  solves.value = data.solves
  solvesPage.value = 1
}

const handleSetSolvesPage = async (newPage: number) => {
  const { kind, message, data } = await getSolves({
    challId: props.problem.id, limit: solvesPageSize, offset: (newPage - 1) * solvesPageSize
  })
  if (kind !== 'goodChallengeSolves') {
    toast({ body: message, type: 'error' })
    return
  }
  solves.value = data.solves
  solvesPage.value = newPage
}
</script>

<style scoped>
.problem-frame {
  margin-bottom: 1em;
  padding-bottom: 0.625em;
  background: #222;
}

.problem-description {
  color: #aaa;
}

.problem-description :deep(a) {
  display: inline;
  padding: 0;
}

.problem-description :deep(p) {
  line-height: 1.4em;
  font-size: 1em;
  margin-top: 0;
}

.problem-description :deep(pre) {
  white-space: pre-wrap;
}

.problem-description :deep(blockquote) {
  background: transparent !important;
}

.problem-divider {
  margin: 0.625em;
  width: 80%;
}

.points-link {
  margin-top: 0.75rem !important;
  margin-bottom: 0 !important;
  cursor: pointer;
  display: inline-block;
  transition: opacity ease-in-out 0.2s;
  color: var(--cirrus-link);
}

.solves-pending {
  opacity: 0.6;
  pointer-events: none;
  cursor: default;
}

.problem-tag {
  background: #111;
}

.problem-input {
  background: #111;
  color: #fff !important;
}

.problem-submit {
  background: #111;
  color: #fff;
}

.problem-submit:hover {
  background: #222;
}
</style>
