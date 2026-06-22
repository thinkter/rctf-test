<template>
  <div class="card">
    <div class="content">
      <p>CTFtime Integration</p>
      <template v-if="ctftimeId === null">
        <p class="font-thin u-no-margin">
          To login with CTFtime and get a badge on your profile, connect CTFtime to your account.
        </p>
        <div class="row u-center">
          <CtftimeButton class="ctftime-card-btn" @ctftimeDone="handleCtftimeDone" />
        </div>
      </template>
      <template v-else>
        <p class="font-thin u-no-margin">
          Your account is already connected to CTFtime. You can disconnect CTFtime from your account.
        </p>
        <div class="row u-center">
          <button class="btn-info u-center" @click="handleRemove">Remove</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import CtftimeButton from '../CtftimeButton.vue'
import { putCtftime, deleteCtftime } from '../../api/auth'
import { useToast } from '../../stores/toast'

const props = defineProps<{ ctftimeId: string | null }>()
const emit = defineEmits<{ update: [{ ctftimeId: string | null }] }>()
const { toast } = useToast()

const handleCtftimeDone = async ({ ctftimeToken, ctftimeId }: any) => {
  const { kind, message } = await putCtftime({ ctftimeToken })
  if (kind !== 'goodCtftimeAuthSet') { toast({ body: message, type: 'error' }); return }
  emit('update', { ctftimeId })
}

const handleRemove = async () => {
  const { kind, message } = await deleteCtftime()
  if (kind !== 'goodCtftimeRemoved') { toast({ body: message, type: 'error' }); return }
  emit('update', { ctftimeId: null })
}
</script>

<style scoped>
.ctftime-card-btn :deep(button) {
  border-color: #d9d9d9 !important;
}
</style>
