<template>
  <div class="card">
    <div class="content">
      <p>Update Information</p>
      <p class="font-thin u-no-margin">
        This will change how your team appears on the scoreboard. You may only change your team's name once every 10 minutes.
      </p>
      <AppForm class="update-form" @submit="doUpdate" :disabled="isButtonDisabled" buttonText="Update">
        <div class="form-section">
          <div class="input-control">
            <input
              autocomplete="username"
              autocorrect="off"
              name="name"
              placeholder="Team Name"
              type="text"
              v-model="name"
              class="input-contains-icon"
            />
            <span class="icon"><UserCircle /></span>
          </div>
        </div>
        <div v-if="(config as any).emailEnabled" class="form-section">
          <div class="input-control">
            <input
              autocomplete="email"
              autocorrect="off"
              name="email"
              placeholder="Email"
              type="email"
              v-model="email"
              class="input-contains-icon"
            />
            <span class="icon"><EnvelopeOpen /></span>
          </div>
        </div>
        <div class="form-section">
          <div class="input-control">
            <select
              class="select division-select"
              name="division"
              v-model="division"
            >
              <option value="" disabled>Division</option>
              <option v-for="code in allowedDivisions" :key="code" :value="code">
                {{ config.divisions[code] }}
              </option>
            </select>
            <span class="icon"><AddressBook /></span>
          </div>
        </div>
      </AppForm>
      <div v-if="recaptchaEnabled" class="recaptcha-notice">
        <RecaptchaLegalNotice />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppForm from '../AppForm.vue'
import RecaptchaLegalNotice from '../RecaptchaLegalNotice.vue'
import UserCircle from '../../icons/user-circle.svg'
import EnvelopeOpen from '../../icons/envelope-open.svg'
import AddressBook from '../../icons/address-book.svg'
import config from '../../config'
import { updateAccount, updateEmail, deleteEmail } from '../../api/profile'
import { useToast } from '../../stores/toast'
import { useRecaptcha } from '../../composables/recaptcha'

const props = defineProps<{
  name: string
  email?: string
  divisionId: string
  allowedDivisions: string[]
}>()
const emit = defineEmits<{
  update: [{ name?: string; email?: string; divisionId?: string }]
}>()
const { toast } = useToast()

const name = ref(props.name)
const email = ref(props.email || '')
const division = ref(props.divisionId)
const isButtonDisabled = ref(false)
const requestRecaptchaCode = useRecaptcha('setEmail')
const recaptchaEnabled = computed(() => !!requestRecaptchaCode)

const doUpdate = async () => {
  if (isButtonDisabled.value) return

  let updated = false
  isButtonDisabled.value = true

  try {
    if (name.value !== props.name || division.value !== props.divisionId) {
      updated = true
      const { error, data } = await updateAccount({
        name: name.value !== props.name ? name.value : undefined,
        division: division.value !== props.divisionId ? division.value : undefined,
      })
      if (error !== undefined) {
        toast({ body: error, type: 'error' })
        return
      }
      toast({ body: 'Profile updated' })
      emit('update', { name: data.user.name, divisionId: data.user.division })
    }

    if (email.value !== (props.email || '')) {
      updated = true
      let error, data
      if (email.value === '') {
        const res = await deleteEmail()
        error = res.error
        data = res.data
      } else {
        const recaptchaCode = await requestRecaptchaCode?.()
        const res = await updateEmail({ email: email.value, recaptchaCode })
        error = res.error
        data = res.data
      }
      if (error !== undefined) {
        toast({ body: error, type: 'error' })
        return
      }
      toast({ body: data || 'Email updated' })
      emit('update', { email: email.value })
    }

    if (!updated) {
      toast({ body: 'Nothing to update!' })
    }
  } finally {
    isButtonDisabled.value = false
  }
}
</script>

<style scoped>
.update-form { padding: 0 !important; }
.division-select { padding-left: 2.75rem; width: 100%; }
.recaptcha-notice { margin-top: 20px; }
</style>
