<template>
  <template v-if="error">
    <ErrorView :error="'401'" :message="error" />
  </template>
  <template v-else-if="emailSet">
    <div class="row u-center">
      <h3>The email change has been verified. You can now close this tab.</h3>
    </div>
  </template>
  <template v-else-if="authToken">
    <PendingToken :authToken="authToken" />
  </template>
  <template v-else>
    <div class="row u-center">
      <h3>Verify email?</h3>
    </div>
    <div class="row u-center">
      <button class="btn-info" @click="handleVerify">Verify</button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ErrorView from './ErrorView.vue'
import PendingToken from '../components/PendingToken.vue'
import config from '../config'
import { verify } from '../api/auth'

const authToken = ref<string | null>(null)
const emailSet = ref(false)
const error = ref<string | null>(null)

onMounted(() => { document.title = `Verify | ${config.ctfName}` })

const handleVerify = async () => {
  const qs = new URLSearchParams(location.search)
  if (!qs.has('token')) {
    error.value = 'No verification token provided.'
    return
  }
  const res = await verify({ verifyToken: qs.get('token')! })
  if (res.authToken) authToken.value = res.authToken
  else if (res.emailSet) emailSet.value = true
  else error.value = res.verifyToken
}
</script>
