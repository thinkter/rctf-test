<template>
  <div class="row">
    <div class="card timer-card">
      <div v-if="isOver" class="timer-over">The CTF is over.</div>
      <div v-else class="timer-content">
        <span class="timer-time">{{ daysLeft }}</span>
        <span class="timer-time">{{ hoursLeft }}</span>
        <span class="timer-time">{{ minutesLeft }}</span>
        <span class="timer-time">{{ secondsLeft }}</span>
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
        <span class="timer-sub">until {{ config.ctfName }} {{ targetEnd ? 'ends' : 'starts' }}</span>
        <span class="timer-absolute">{{ formatAbsoluteTimeWithTz(targetTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import config from '../config'
import { formatAbsoluteTimeWithTz } from '../util/time'

const now = ref(Date.now())
let intervalId: ReturnType<typeof setInterval>
onMounted(() => { intervalId = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(intervalId))

const isOver = computed(() => now.value > config.endTime)
const targetEnd = computed(() => now.value > config.startTime)
const targetTime = computed(() => targetEnd.value ? config.endTime : config.startTime)
const timeLeft = computed(() => targetTime.value - now.value)
const daysLeft = computed(() => Math.floor(timeLeft.value / (1000 * 60 * 60 * 24)))
const hoursLeft = computed(() => Math.floor(timeLeft.value / (1000 * 60 * 60)) % 24)
const minutesLeft = computed(() => Math.floor(timeLeft.value / (1000 * 60)) % 60)
const secondsLeft = computed(() => Math.floor(timeLeft.value / 1000) % 60)
</script>

<style scoped>
.timer-card {
  background: #222;
  margin: auto;
}

.timer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 20px;
  margin: 20px 40px;
  text-align: center;
}

.timer-time {
  font-size: 40px;
}

.timer-absolute {
  grid-column: span 4;
  font-size: 15px;
  color: #bbb;
}

.timer-sub {
  grid-column: span 4;
  margin-top: 10px;
  font-size: 20px;
}

.timer-over {
  margin: 20px 40px;
  font-size: 20px;
  text-align: center;
}
</style>
