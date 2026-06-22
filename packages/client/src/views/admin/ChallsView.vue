<template>
  <div class="row admin-row">
    <div class="col-9">
      <div v-if="problems.length === 0" class="alert alert-info" style="text-align: center">
        <p>No challenges found</p>
      </div>
      <AdminProblem
        v-for="problem in completeProblems"
        :key="problem.id"
        :problem="problem"
        @update="updateProblem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { v4 as uuid } from 'uuid'
import AdminProblem from '../../components/admin/AdminProblem.vue'
import { getChallenges } from '../../api/admin/challs'
import { hasChallsWritePermission } from '../../util/permissions'
import config from '../../config'

const problems = ref<any[]>([])
const newId = computed(() => uuid())

const completeProblems = computed(() => {
  if (!hasChallsWritePermission()) return problems.value
  return [...problems.value, {
    id: newId.value,
    name: '', description: '', category: '', author: '', files: [],
    points: { min: 100, max: 500 },
  }]
})

onMounted(async () => {
  document.title = `Admin Challenges | ${config.ctfName}`
  problems.value = await getChallenges()
})

const updateProblem = ({ problem }: { problem: any }) => {
  let next = completeProblems.value
  if (problem.id !== newId.value) next = next.filter(p => p.id !== newId.value)
  problems.value = next.map(p => p.id === problem.id ? { ...p, ...problem } : p)
    .filter(p => p.id !== newId.value)
}
</script>

<style scoped>
.admin-row { justify-content: center; }
</style>
