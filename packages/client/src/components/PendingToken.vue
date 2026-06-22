<template>
  <template v-if="user">
    <div class="row u-center">
      <h3>Login as {{ user.name }}?</h3>
    </div>
    <div class="row u-center">
      <button class="btn-info" @click="handleLogin">Login</button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setAuthToken } from '../api/auth'
import { pendingPrivateProfile } from '../api/profile'

const props = defineProps<{ authToken: string }>()
const user = ref<any>(null)

onMounted(async () => {
  if (props.authToken) {
    user.value = await pendingPrivateProfile({ authToken: props.authToken })
  }
})

const handleLogin = () => setAuthToken({ authToken: props.authToken })
</script>
