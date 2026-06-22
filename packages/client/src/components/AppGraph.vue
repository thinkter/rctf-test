<template>
  <div v-if="graphData" class="frame graph-frame">
    <div class="frame__body">
      <svg
        ref="svgEl"
        :viewBox="`${-stroke - axis} ${-stroke} ${width + stroke * 2 + axis} ${height + stroke * 2 + axis + axisGap}`"
      >
        <g v-for="(pl, i) in polylines" :key="i">
          <polyline
            :stroke="pl.color"
            :points="pl.points"
            :stroke-width="stroke"
            stroke-linecap="round"
            fill="transparent"
            pointer-events="none"
          />
          <polyline
            :stroke="pl.color"
            :points="pl.points"
            :stroke-width="strokeHoverWidth"
            stroke-linecap="round"
            fill="transparent"
            pointer-events="stroke"
            @mouseover="tooltipContent = `${pl.name} - ${pl.currentScore} points`"
            @mousemove="onMouseMove"
            @mouseout="tooltipContent = ''"
          />
        </g>
        <text
          v-for="(label, i) in labels"
          :key="i"
          :x="label.x"
          :y="height + axis + axisGap"
          fill="#fff"
          font-size="12"
        >{{ label.label }}</text>
        <line :x1="-axisGap" :y1="height + axisGap" :x2="width" :y2="height + axisGap" stroke="#444" stroke-linecap="round" :stroke-width="stroke" />
        <line :x1="-axisGap" y1="0" :x2="-axisGap" :y2="height + axisGap" stroke="#444" stroke-linecap="round" :stroke-width="stroke" />
      </svg>
    </div>
    <div
      v-if="tooltipContent"
      class="tooltip"
      :style="{ transform: `translate(${tooltipX}px, ${tooltipY}px)` }"
    >{{ tooltipContent }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import config from '../config'

const props = defineProps<{ graphData: any }>()

const height = 400
const stroke = 2
const axis = 20
const axisGap = 20
const day = 86400000
const strokeHoverWidth = 12

const svgEl = ref<SVGElement | null>(null)
const width = ref(600)
const tooltipContent = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

const updateWidth = () => {
  if (svgEl.value) width.value = svgEl.value.getBoundingClientRect().width
}

const onMouseMove = (e: MouseEvent) => {
  tooltipX.value = e.clientX
  tooltipY.value = e.clientY
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})
onUnmounted(() => window.removeEventListener('resize', updateWidth))

const timeToX = (time: number, minX: number, maxX: number) =>
  ((time - minX) / (maxX - minX)) * width.value

const uuidToColor = (uuid: string) => {
  const uuidInt = parseInt(uuid.slice(-12), 16) + 1
  const g = (uuidInt * 89) % 128
  const b = (uuidInt * 53) % 128
  return `rgba(186, ${g}, ${b}, 0.8)`
}

const polylines = computed(() => {
  if (!props.graphData?.graph?.length) return []
  const minX = config.startTime
  const maxX = Math.min(Date.now(), config.endTime)
  let maxY = 0
  props.graphData.graph.forEach((u: any) =>
    u.points.forEach((p: any) => {
      if (p.score > maxY) maxY = p.score
    })
  )

  return props.graphData.graph.map((user: any) => {
    const pts = user.points
      .map(
        (p: any) => `${timeToX(p.time, minX, maxX)} ${(1 - p.score / maxY) * height}`
      )
      .join(',')
    return {
      color: uuidToColor(user.id),
      name: user.name,
      currentScore: user.points[0]?.score ?? 0,
      points: pts,
    }
  })
})

const labels = computed(() => {
  if (!props.graphData?.graph?.length) return []
  const minX = config.startTime
  const maxX = Math.min(Date.now(), config.endTime)
  const result: { label: string; x: number }[] = []
  const step = Math.ceil((((maxX - minX) / width.value) * 200) / day) * day
  let labelStart = new Date(minX).setHours(0, 0, 0, 0)
  if (labelStart % step !== 0) labelStart += step
  for (let l = labelStart; l <= maxX; l += step) {
    result.push({
      label: new Date(l).toLocaleDateString(),
      x: timeToX(l, minX, maxX),
    })
  }
  return result
})
</script>

<style scoped>
.graph-frame {
  margin-bottom: 20px;
  background: #222;
}

.graph-frame :deep(.frame__body) {
  padding: 20px;
}

svg {
  width: 100%;
  display: block;
}

.tooltip {
  position: fixed;
  pointer-events: none;
  background: #fff;
  color: #222;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 5px;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
