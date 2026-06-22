<template>
  <div class="row">
    <div class="card u-center col-6 not-started-card">
      <div class="clock-icon">
        <Clock />
      </div>
      <h4>{{ config.ctfName }} has not started yet.</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from '../config'
import Clock from '../icons/clock.svg'
</script>

<style scoped>
.not-started-card {
  background: #222;
  padding: 30px !important;
  flex-direction: column;
}

.clock-icon {
  width: 60px;
}

.clock-icon :deep(svg) {
  fill: #666;
}
</style>
