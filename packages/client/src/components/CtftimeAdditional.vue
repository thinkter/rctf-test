<template>
  <div class="row u-center">
    <AppForm
      class="ctftime-form col-6"
      @submit="handleSubmit"
      :disabled="disabledButton"
      :buttonText="'Register'"
    >
      <div v-if="showName" class="form-section">
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
            class="input-contains-icon"
          />
          <span class="icon"><UserCircle /></span>
        </div>
      </div>
    </AppForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppForm from './AppForm.vue'
import UserCircle from '../icons/user-circle.svg'
import { register } from '../api/auth'
import config from '../config'
import { useRecaptcha } from '../composables/recaptcha'

const props = defineProps<{ ctftimeToken: string; ctftimeName: string }>()

const disabledButton = ref(false)
const division = config.defaultDivision || Object.keys(config.divisions)[0]
const showName = ref(false)
const name = ref(props.ctftimeName)
const errors = ref<Record<string, string>>({})
const requestRecaptchaCode = useRecaptcha('register')

const handleRegister = async () => {
  disabledButton.value = true
  const { errors: errs } = await register({
    ctftimeToken: props.ctftimeToken,
    name: name.value || undefined,
    division,
    recaptchaCode: await requestRecaptchaCode?.(),
  })
  disabledButton.value = false
  if (!errs) return
  if (errs.name) showName.value = true
  errors.value = errs
}

const handleSubmit = () => handleRegister()
onMounted(() => handleRegister())
</script>

<style scoped>
.ctftime-form {
  padding: 1.5em;
}

.ctftime-form :deep(input) {
  background: #222;
  color: #fff !important;
}
</style>
