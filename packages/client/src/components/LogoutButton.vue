<template>
  <a href="#" v-bind="$attrs" @click.prevent="open = true">Logout</a>
  <AppModal :open="open" @close="open = false">
    <div class="modal-header">
      <div class="modal-title">Logout</div>
    </div>
    <div class="modal-body">
      <div>This will log you out on your current device.</div>
    </div>
    <div class="modal-footer">
      <div class="btn-container u-inline-block">
        <button class="btn-small outline" @click.prevent="open = false">Cancel</button>
      </div>
      <div class="btn-container u-inline-block">
        <button class="btn-small btn-danger outline" @click.prevent="doLogout">Logout</button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from './AppModal.vue'
import { logout } from '../api/auth'

const open = ref(false)
const doLogout = () => { logout(); open.value = false }
</script>
