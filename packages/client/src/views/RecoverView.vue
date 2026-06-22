<template>
  <template v-if="verifySent">
    <div class="row u-center">
      <h3>Recovery email sent</h3>
    </div>
  </template>
  <template v-else>
    <div class="row u-center recover-root">
      <h4 class="recover-title">Recover your {{ config.ctfName }} account</h4>
      <AppForm
        class="recover-form col-6"
        @submit="handleSubmit"
        :disabled="disabled"
        buttonText="Recover"
      >
        <div class="form-section">
          <label v-if="errors.email" class="text-danger info">{{ errors.email }}</label>
          <div class="input-control">
            <input
              autofocus
              required
              autocomplete="email"
              autocorrect="off"
              name="email"
              placeholder="Email"
              type="email"
              v-model="email"
              class="input-contains-icon recover-input"
            />
            <span class="icon"><EnvelopeOpen /></span>
          </div>
        </div>
      </AppForm>
      <div v-if="recaptchaEnabled" class="recaptcha-notice">
        <RecaptchaLegalNotice />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppForm from '../components/AppForm.vue'
import RecaptchaLegalNotice from '../components/RecaptchaLegalNotice.vue'
import EnvelopeOpen from '../icons/envelope-open.svg'
import config from '../config'
import { recover } from '../api/auth'
import { useRecaptcha } from '../composables/recaptcha'

onMounted(() => { document.title = `Recover | ${config.ctfName}` })

const disabled = ref(false)
const errors = ref<Record<string, string>>({})
const verifySent = ref(false)
const email = ref('')
const requestRecaptchaCode = useRecaptcha('recover')
const recaptchaEnabled = computed(() => !!requestRecaptchaCode)

const handleSubmit = async () => {
  const recaptchaCode = await requestRecaptchaCode?.()
  disabled.value = true
  const { errors: errs, verifySent: vs } = await recover({ email: email.value, recaptchaCode })
  errors.value = errs || {}
  verifySent.value = !!vs
  disabled.value = false
}
</script>

<style scoped>
.recover-root { flex-direction: column; }
.recover-title { margin-bottom: 20px; }
.recover-form { padding: 1.5em; max-width: 500px; }
.recover-input { background: #222; color: #fff !important; }
.recaptcha-notice { margin-top: 50px; }
</style>
