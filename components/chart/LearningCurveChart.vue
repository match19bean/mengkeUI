<template>
  <div class="min-w-[350px] w-full rounded-3xl bg-brown-10 p-5 md:p-6">
    <div class="relative w-full overflow-hidden rounded-[28px] bg-transparent">
      <svg
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0"
          y="0"
          :width="svgWidth"
          :height="svgHeight"
          :fill="colors.canvas"
        />

        <path :d="topBandPath" :fill="colors.primary1" />
        <path :d="middleBandPath" :fill="colors.primary2" />
        <path :d="bottomBandPath" :fill="colors.primary3" />

        <path
          :d="linePath"
          fill="none"
          :stroke="colors.white"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g v-for="(point, index) in points" :key="index">
          <circle
            v-if="index !== maxIndex && index !== minIndex"
            :cx="point.x"
            :cy="point.y"
            r="6"
            :fill="colors.white"
          />
        </g>

        <g v-if="minIndex >= 0 && points[minIndex]">
          <circle
            :cx="points[minIndex]!.x"
            :cy="points[minIndex]!.y"
            r="7"
            :fill="colors.complementary2"
            :stroke="colors.white"
            stroke-width="2"
          />
        </g>

        <g v-if="maxIndex >= 0 && points[maxIndex]">
          <circle
            :cx="points[maxIndex]!.x"
            :cy="points[maxIndex]!.y"
            r="7"
            :fill="colors.alert1"
            :stroke="colors.white"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>

    <div class="mt-1 grid grid-cols-7 text-center">
      <div v-for="(item, index) in normalizedData" :key="index" class="flex flex-col items-center gap-2">
        <span class="text-xs text-brown-7 md:text-sm">{{ item.weekday }}</span>
        <span
          class="text-xs md:text-sm"
          :class="index === normalizedData.length - 1 ? 'font-semibold text-brown-5' : 'text-brown-7'"
        >
          {{ item.day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartItem {
  date: string
  score: number
}

interface DisplayItem extends ChartItem {
  day: number
  weekday: string
}

interface ChartPoint {
  x: number
  y: number
  score: number
}

const colors = {
  canvas: '#F8F7F0',
  primary1: '#EE7959',
  primary2: '#FF9B80',
  primary3: '#FDBDAC',
  complementary2: '#597AEE',
  alert1: '#FF3700',
  white: '#FFFFFF'
}

const props = withDefaults(
  defineProps<{
    data: ChartItem[]
    width?: number
    height?: number
    maxScore?: number
  }>(),
  {
    width: 700,
    height: 210,
    maxScore: 120
  }
)

const svgWidth = computed(() => props.width)
const svgHeight = computed(() => props.height)

const normalizedData = computed<DisplayItem[]>(() => {
  const last7 = [...props.data].slice(-7)

  return last7.map((item) => {
    const d = new Date(item.date)
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const dayIndex = d.getDay()

    return {
      ...item,
      day: d.getDate(),
      weekday: weekdays[dayIndex] || '日'
    }
  })
})

const chartPadding = {
  top: 20,
  right: 24,
  bottom: 12,
  left: 24
}

const chartArea = computed(() => ({
  x: chartPadding.left,
  y: chartPadding.top,
  width: svgWidth.value - chartPadding.left - chartPadding.right,
  height: 165
}))

function scoreToY(score: number) {
  const max = props.maxScore
  const clamped = Math.max(0, Math.min(score, max))
  const ratio = clamped / max

  return chartArea.value.y + chartArea.value.height - ratio * chartArea.value.height
}

const points = computed<ChartPoint[]>(() => {
  const list = normalizedData.value
  if (!list.length) return []

  const stepX =
    list.length > 1 ? chartArea.value.width / (list.length - 1) : 0

  return list.map((item, index) => ({
    x: chartArea.value.x + stepX * index,
    y: scoreToY(item.score),
    score: item.score
  }))
})

const maxIndex = computed(() => {
  if (!normalizedData.value.length) return -1
  let index = 0
  let max = normalizedData.value[0]?.score ?? 0

  normalizedData.value.forEach((item, i) => {
    if (item.score > max) {
      max = item.score
      index = i
    }
  })

  return index
})

const minIndex = computed(() => {
  if (!normalizedData.value.length) return -1
  let index = 0
  let min = normalizedData.value[0]?.score ?? 0

  normalizedData.value.forEach((item, i) => {
    if (item.score < min) {
      min = item.score
      index = i
    }
  })

  return index
})

const linePath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''

  const firstPoint = pts[0]
  if (!firstPoint) return ''

  let d = `M ${firstPoint.x} ${firstPoint.y}`

  for (let i = 1; i < pts.length; i++) {
    const point = pts[i]
    if (!point) continue
    d += ` L ${point.x} ${point.y}`
  }

  return d
})

const createDownBulgeBand = (
  topY: number,
  bottomY: number,
  waveDepth: number,
  topOffset: number,
  bottomOffset: number
) => {
  const w = svgWidth.value

  return `
    M 0 ${topY}
    Q ${w / 2} ${topY + waveDepth + topOffset}, ${w} ${topY}
    L ${w} ${bottomY}
    Q ${w / 2} ${bottomY + waveDepth + bottomOffset}, 0 ${bottomY}
    Z
  `
}

const topBandPath = computed(() => {
  return createDownBulgeBand(
    scoreToY(120),
    scoreToY(100),
    22,
    13,
    20
  )
})

const middleBandPath = computed(() => {
  return createDownBulgeBand(
    scoreToY(100),
    scoreToY(20),
    28,
    13,
    20
  )
})

const bottomBandPath = computed(() => {
  return createDownBulgeBand(
    scoreToY(20),
    scoreToY(0),
    22,
    13,
    20
  )
})
</script>