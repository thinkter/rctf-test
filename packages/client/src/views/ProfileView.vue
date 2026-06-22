<template>
  <template v-if="!loaded" />
  <template v-else-if="profileError">
    <div class="row u-center">
      <div class="col-4">
        <div class="card error-card">
          <div class="content">
            <p class="title">There was an error</p>
            <p class="font-thin">{{ profileError }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="profile-root">
      <div v-if="isPrivate" class="profile-col">
        <TeamCodeCard v-if="data.teamToken" :teamToken="data.teamToken" />
        <UpdateCard
          :name="data.name"
          :email="data.email"
          :divisionId="data.division"
          :allowedDivisions="data.allowedDivisions"
          @update="onProfileUpdate"
        />
        <CtftimeCard
          v-if="(config as any).ctftime"
          :ctftimeId="data.ctftimeId ?? null"
          @update="onProfileUpdate"
        />
      </div>
      <div class="profile-col">
        <SummaryCard
          :name="data.name"
          :score="data.score"
          :division="config.divisions[data.division]"
          :divisionPlace="placementString(data.divisionPlace)"
          :globalPlace="placementString(data.globalPlace)"
          :ctftimeId="data.ctftimeId"
          :isPrivate="isPrivate"
        />
        <MembersCard v-if="isPrivate && (config as any).userMembers" />
        <SolvesCard :solves="data.solves || []" :isPrivate="isPrivate" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import config from '../config'
import { privateProfile, publicProfile } from '../api/profile'
import { useToast } from '../stores/toast'
import { placementString } from '../util/strings'
import SummaryCard from '../components/profile/SummaryCard.vue'
import TeamCodeCard from '../components/profile/TeamCodeCard.vue'
import UpdateCard from '../components/profile/UpdateCard.vue'
import CtftimeCard from '../components/profile/CtftimeCard.vue'
import MembersCard from '../components/profile/MembersCard.vue'
import SolvesCard from '../components/profile/SolvesCard.vue'

const route = useRoute()
const { toast } = useToast()

const loaded = ref(false)
const profileError = ref<string | null>(null)
const data = ref<any>({})

const isPrivate = computed(() => !route.params.uuid || route.params.uuid === 'me')

const fetchProfile = async () => {
  loaded.value = false
  profileError.value = null
  if (isPrivate.value) {
    const { data: d, error } = await privateProfile()
    if (error) toast({ body: error, type: 'error' })
    else data.value = d
  } else {
    const { data: d, error } = await publicProfile(route.params.uuid as string)
    if (error) profileError.value = 'Profile not found'
    else data.value = d
  }
  loaded.value = true
}

onMounted(async () => {
  document.title = `Profile | ${config.ctfName}`
  await fetchProfile()
})

watch(() => route.params.uuid, fetchProfile)

const onProfileUpdate = (updates: { name?: string; email?: string; divisionId?: string; ctftimeId?: string | null }) => {
  data.value = {
    ...data.value,
    name: updates.name === undefined ? data.value.name : updates.name,
    email: updates.email === undefined ? data.value.email : updates.email,
    division: updates.divisionId === undefined ? data.value.division : updates.divisionId,
    ctftimeId: updates.ctftimeId === undefined ? data.value.ctftimeId : updates.ctftimeId,
  }
}
</script>

<style scoped>
.profile-root {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(384px, 1fr));
  width: 100%;
  max-width: 1500px;
  margin: auto;
}

.profile-root :deep(.card) {
  background: #222;
  margin-bottom: 20px;
}

.profile-root :deep(input),
.profile-root :deep(select),
.profile-root :deep(option) {
  background: #111;
  color: #fff !important;
}

.profile-col {
  width: calc(100% - 20px);
  margin-left: 10px;
}

.error-card {
  background: #222;
}
</style>
