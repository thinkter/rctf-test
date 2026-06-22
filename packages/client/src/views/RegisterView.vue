<template>
  <template v-if="ctftimeToken">
    <CtftimeAdditional :ctftimeToken="ctftimeToken" :ctftimeName="ctftimeName" />
  </template>
  <template v-else-if="verifySent">
    <div class="row u-center">
      <h3>Verification email sent!</h3>
    </div>
  </template>
  <template v-else>
    <div class="row u-center register-root">
      <h4 class="register-title">Register for {{ config.ctfName }}</h4>
      <p>Please register one account per team.</p>
      <AppForm
        class="register-form col-6"
        @submit="handleSubmit"
        :disabled="disabledButton"
        buttonText="Register"
      >
        <div class="form-section">
          <label v-if="errors.name" class="text-danger info">{{ errors.name }}</label>
          <div class="input-control">
            <input
              autofocus
              required
              autocomplete="username"
              autocorrect="off"
              name="name"
              maxlength="64"
              minlength="2"
              placeholder="Team Name"
              type="text"
              v-model="name"
              class="input-contains-icon register-input"
            />
            <span class="icon"><UserCircle /></span>
          </div>
        </div>
        <div class="form-section">
          <label v-if="errors.email" class="text-danger info">{{ errors.email }}</label>
          <div class="input-control">
            <input
              required
              autocomplete="email"
              autocorrect="off"
              name="email"
              placeholder="Email"
              type="email"
              v-model="email"
              class="input-contains-icon register-input"
            />
            <span class="icon"><EnvelopeOpen /></span>
          </div>
        </div>
      </AppForm>
      <template v-if="config.ctftime">
        <AuthOr />
        <CtftimeButton class="col-6" @ctftimeDone="handleCtftimeDone" />
      </template>
      <div v-if="recaptchaEnabled" class="recaptcha-notice">
        <RecaptchaLegalNotice />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppForm from '../components/AppForm.vue'
import AuthOr from '../components/AuthOr.vue'
import CtftimeButton from '../components/CtftimeButton.vue'
import CtftimeAdditional from '../components/CtftimeAdditional.vue'
import RecaptchaLegalNotice from '../components/RecaptchaLegalNotice.vue'
import UserCircle from '../icons/user-circle.svg'
import EnvelopeOpen from '../icons/envelope-open.svg'
import config from '../config'
import { register, login, setAuthToken } from '../api/auth'
import { useRecaptcha } from '../composables/recaptcha'

const name = ref('')
const email = ref('')
const ctftimeToken = ref<string | undefined>(undefined)
const ctftimeName = ref('')
const disabledButton = ref(false)
const errors = ref<Record<string, string>>({})
const verifySent = ref(false)
const requestRecaptchaCode = useRecaptcha('register')
const recaptchaEnabled = computed(() => !!requestRecaptchaCode)

onMounted(() => { document.title = `Registration | ${config.ctfName}` })

const handleCtftimeDone = async ({ ctftimeToken: token, ctftimeName: cname }: any) => {
  disabledButton.value = true
  const loginRes = await login({ ctftimeToken: token })
  if (loginRes.authToken) setAuthToken({ authToken: loginRes.authToken })
  if (loginRes.badUnknownUser) {
    ctftimeToken.value = token
    ctftimeName.value = cname
  }
}

const handleSubmit = async () => {
  const recaptchaCode = recaptchaEnabled.value ? await requestRecaptchaCode?.() : undefined
  disabledButton.value = true
  const { errors: errs, verifySent: vs } = await register({
    name: name.value,
    email: email.value,
    recaptchaCode,
  })
  if (vs) { verifySent.value = true; return }
  if (!errs) return
  errors.value = errs
  disabledButton.value = false
}
</script>

<style scoped>
.register-root { flex-direction: column; }
.register-title { margin-bottom: 20px; }
.register-form { padding: 1.5em; max-width: 500px; }
.register-input { background: #222; color: #fff !important; }
.recaptcha-notice { margin-top: 50px; }
</style>
