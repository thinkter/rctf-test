<template>
  <div v-bind="$attrs">
    <button class="ctftime-btn" @click="handleClick">
      <Ctftime />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Ctftime from '../icons/ctftime.svg'
import openPopup from '../util/ctftime'
import { ctftimeCallback } from '../api/auth'
import { useToast } from '../stores/toast'

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ ctftimeDone: [{ ctftimeToken: string; ctftimeName: string; ctftimeId?: string }] }>()
const { toast } = useToast()

let oauthState: string | null = null

const handleClick = () => {
  oauthState = openPopup()
}

const handleMessage = async (evt: MessageEvent) => {
  if (evt.origin !== location.origin) return
  if (evt.data.kind !== 'ctftimeCallback') return
  if (oauthState === null || evt.data.state !== oauthState) return

  const { kind, message, data } = await ctftimeCallback({ ctftimeCode: evt.data.ctftimeCode })
  if (kind !== 'goodCtftimeToken') {
    toast({ body: message, type: 'error' })
    return
  }
  emit('ctftimeDone', data)
}

onMounted(() => window.addEventListener('message', handleMessage))
onUnmounted(() => window.removeEventListener('message', handleMessage))
</script>

<style scoped>
.ctftime-btn {
  margin: auto;
  line-height: 0;
  padding: 10px;
  background: #222;
  display: block;
}

.ctftime-btn:hover {
  background: #222;
  opacity: 0.9;
}

.ctftime-btn :deep(svg) {
  width: 150px;
}
</style>
