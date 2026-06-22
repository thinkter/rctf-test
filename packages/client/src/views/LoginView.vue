<template>
  <template v-if="ctftimeToken">
    <CtftimeAdditional :ctftimeToken="ctftimeToken" :ctftimeName="ctftimeName" />
  </template>
  <template v-else-if="pending" />
  <template v-else-if="pendingAuthToken">
    <PendingToken :authToken="pendingAuthToken" />
  </template>
  <template v-else>
    <div class="row u-center login-root">
      <h4 class="login-title">Log in to {{ config.ctfName }}</h4>
      <AppForm
        class="login-form col-6"
        @submit="handleSubmit"
        :disabled="disabledButton"
        buttonText="Login"
      >
        <div class="form-section">
          <label v-if="errors.teamToken" class="text-danger info">{{ errors.teamToken }}</label>
          <div class="input-control">
            <input
              autofocus
              required
              autocomplete="off"
              autocorrect="off"
              name="teamToken"
              placeholder="Team Token"
              type="text"
              v-model="teamToken"
              class="input-contains-icon login-input"
            />
            <span class="icon"><IdCard /></span>
          </div>
        </div>
        <RouterLink v-if="config.emailEnabled" to="/recover" class="recover-link">
          Lost your team token?
        </RouterLink>
      </AppForm>
      <template v-if="config.ctftime">
        <AuthOr />
        <CtftimeButton class="col-12" @ctftimeDone="handleCtftimeDone" />
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppForm from '../components/AppForm.vue'
import AuthOr from '../components/AuthOr.vue'
import CtftimeButton from '../components/CtftimeButton.vue'
import CtftimeAdditional from '../components/CtftimeAdditional.vue'
import PendingToken from '../components/PendingToken.vue'
import IdCard from '../icons/id-card.svg'
import config from '../config'
import { login, setAuthToken } from '../api/auth'

const teamToken = ref('')
const errors = ref<Record<string, string>>({})
const disabledButton = ref(false)
const ctftimeToken = ref<string | undefined>(undefined)
const ctftimeName = ref('')
const pendingAuthToken = ref<string | null>(null)
const pending = ref(false)

onMounted(async () => {
  document.title = `Login | ${config.ctfName}`
  const qs = new URLSearchParams(location.search)
  if (qs.has('token')) {
    pending.value = true
    const loginRes = await login({ teamToken: qs.get('token')! })
    if (loginRes.authToken) pendingAuthToken.value = loginRes.authToken
    pending.value = false
  }
})

const handleCtftimeDone = async ({ ctftimeToken: token, ctftimeName: name }: any) => {
  disabledButton.value = true
  const loginRes = await login({ ctftimeToken: token })
  if (loginRes.authToken) setAuthToken({ authToken: loginRes.authToken })
  if (loginRes?.badUnknownUser) {
    ctftimeToken.value = token
    ctftimeName.value = name
  }
}

const handleSubmit = async () => {
  disabledButton.value = true
  let token = teamToken.value
  try {
    const url = new URL(token)
    if (url.searchParams.has('token')) token = url.searchParams.get('token')!
  } catch {}

  const result = await login({ teamToken: token })
  if (result.authToken) {
    setAuthToken({ authToken: result.authToken })
    return
  }
  errors.value = result
  disabledButton.value = false
}
</script>

<style scoped>
.login-root { flex-direction: column; }
.login-title { margin-bottom: 20px; }
.login-form { padding: 1.5em; max-width: 500px; }
.login-input { background: #222; color: #fff !important; }
.recover-link { display: inline; padding: 0; }
</style>
