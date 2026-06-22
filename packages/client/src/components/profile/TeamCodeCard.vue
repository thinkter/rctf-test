<template>
  <div class="card">
    <div class="content">
      <p>Team Invite</p>
      <p class="font-thin">Send this team invite URL to your teammates so they can login.</p>
      <button @click="onCopyClick" class="team-btn btn-info u-center">Copy</button>
      <button @click="reveal = !reveal" class="team-btn btn-info u-center">
        {{ reveal ? 'Hide' : 'Reveal' }}
      </button>
      <TokenPreview v-if="reveal" :token="tokenUrl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TokenPreview from '../TokenPreview.vue'
import { useToast } from '../../stores/toast'

const props = defineProps<{ teamToken: string }>()
const { toast } = useToast()

const reveal = ref(false)
const tokenUrl = computed(() => `${location.origin}/login?token=${encodeURIComponent(props.teamToken)}`)

const onCopyClick = async () => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(tokenUrl.value)
      toast({ body: 'Copied team invite URL to clipboard' })
    } catch {}
  }
}
</script>

<style scoped>
.team-btn {
  margin-right: 10px;
}
</style>
