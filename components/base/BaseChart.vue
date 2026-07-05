<template>
  <div class="w-full min-w-0 h-auto bg-brown-1 rounded-[24px] p-7 shadow-card border border-brown-8">
    <!-- 上方：百分比和提示文字 -->
    <div class="mb-8">
      <!-- 百分比 -->
      <div class="flex items-baseline gap-2 mb-3">
        <template v-if="percentage !== null && percentage !== undefined">
          <span class="text-5xl font-bold text-brown-10">{{ percentage.toFixed(2) }}</span>
          <span class="text-2xl text-brown-10 font-semibold">%</span>
        </template>
        <template v-else>
          <span class="text-5xl font-bold text-brown-10">-</span>
          <span class="text-2xl text-brown-10 font-semibold">%</span>
        </template>
      </div>
      <!-- 標題 -->
      <p v-if="title" class="text-sm text-brown-9 font-medium">{{ title }}</p>
      <p v-else-if="percentage === null || percentage === undefined" class="text-sm text-brown-9 font-medium">無法測量。</p>
      <!-- 提示文字 -->
      <p v-if="hint" class="text-xs text-brown-8 mt-1">{{ hint }}</p>
    </div>

    <!-- 下方：柱狀圖 -->
    <div class="space-y-4">
      <!-- 圖表區域 -->
      <div class="flex gap-2" :style="{ height: chartHeight }">
        <!-- Y 軸標籤 -->
        <div class="w-8 flex flex-col justify-between text-xs text-brown-8 font-medium flex-shrink-0">
          <span v-for="(label, index) in yAxisLabels" :key="`y-label-${index}`">
            {{ label }}
          </span>
        </div>

        <!-- 柱狀圖容器 -->
        <div class="flex-1 min-w-0 flex items-end relative gap-1.5">
          <!-- 背景網格線 -->
          <svg class="absolute left-0 right-0 top-0 bottom-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <line 
              v-for="(lineY, index) in gridLines" 
              :key="`grid-${index}`"
              x1="0" 
              :y1="`${lineY}%`" 
              x2="100%" 
              :y2="`${lineY}%`" 
              stroke="#CDC7BE" 
              :stroke-width="lineY === 100 ? '0.5' : '0.5'" 
              :opacity="lineY === 100 ? '1' : '0.3'"
            />
          </svg>

          <!-- 數據柱 -->
          <div
            v-for="(dateLabel, index) in dateLabels"
            :key="index"
            class="flex-1 min-w-0 flex flex-col items-center justify-end h-full relative"
          >
            <!-- 應到數（細柱，背景） -->
            <div
              v-if="data[index]?.expected"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 rounded-sm transition-all duration-300 bar-expected"
              :style="{ height: barHeightPct(data[index].expected), zIndex: 1 }"
            ></div>
            <!-- 已報到數（正常柱，前景） -->
            <div
              v-if="data[index]?.actual"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 rounded-md transition-all duration-300 bar-actual"
              :style="{ height: barHeightPct(data[index].actual), zIndex: 2 }"
            ></div>
          </div>
        </div>
      </div>

      <!-- X 軸標籤 -->
      <div class="flex gap-2">
        <div class="w-8 flex-shrink-0"></div>
        <div class="flex-1 min-w-0 flex gap-1.5">
          <div
            v-for="(dateLabel, index) in dateLabels"
            :key="`label-${index}`"
            class="flex-1 min-w-0 text-center"
          >
            <span class="text-xs text-brown-8 font-medium">{{ dateLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DataItem {
  actual: number // 已報到數
  expected?: number // 應到數（可選）
  value?: number // 舊版相容（如果只有 value，會當作 actual）
  label?: string
}

interface Props {
  percentage?: number | null // 百分比，null 時不顯示
  title?: string // 標題
  hint?: string // 提示文字
  data: DataItem[] // 圖表數據
  maxValue?: number // Y 軸最大值（可選：不給就自動用 data 最大值）
  chartHeight?: string // 圖表高度
}

const props = withDefaults(defineProps<Props>(), {
  percentage: null,
  title: '',
  hint: '',
  maxValue: undefined,
  chartHeight: '256px'
})

// 生成從今天往回推22天的日期標籤（顯示日期的「日」）
const dateLabels = computed(() => {
  const labels: string[] = []
  const today = new Date()
  
  for (let i = 21; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    labels.push(date.getDate().toString())
  }
  
  return labels
})

// maxValue：外部有給就用外部，沒給就用應到數最大值；如果都沒有則預設為 3
const computedMaxValue = computed(() => {
  // 只取應到數的最大值
  const expectedValues = props.data
    .map(d => d.expected ?? 0)
    .filter(v => Number.isFinite(v))
  const dataMax = expectedValues.length > 0 ? Math.max(0, ...expectedValues) : 0
  const mv = props.maxValue ?? dataMax
  // 如果最終值為0或更小，預設為3
  return mv > 0 ? mv : 3
})

// Y軸刻度（生成整數刻度）
const yAxisLabels = computed(() => {
  const max = computedMaxValue.value
  const labels: number[] = []
  
  // 根據最大值決定刻度數量
  if (max <= 5) {
    // 如果maxValue小於等於5，每個整數都顯示
    for (let i = max; i >= 0; i--) {
      labels.push(i)
    }
  } else {
    // 如果maxValue較大，顯示大約4-5個刻度
    const step = Math.ceil(max / 4)
    for (let i = max; i >= 0; i -= step) {
      labels.push(i)
    }
    if (labels[labels.length - 1] !== 0) {
      labels.push(0)
    }
  }
  
  return labels
})

// 網格線位置（根據刻度值計算百分比位置，從頂部算起）
const gridLines = computed(() => {
  const max = computedMaxValue.value
  return yAxisLabels.value.map(label => {
    const percentage = 100 - (label / max * 100)
    return percentage
  })
})

// 高度百分比：clamp 0~100，避免超出容器 / NaN
const barHeightPct = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0
  const pct = (safeValue / computedMaxValue.value) * 100
  const clamped = Math.max(0, Math.min(100, pct))
  return `${clamped}%`
}
</script>

<style scoped>
/* 柱子顏色 */
/* 已報到數 */
.bar-actual {
  background-color: #EE7959; /* primary-1 */
}

/* 應到數細柱 */
.bar-expected {
  background-color: #F8F7F0; /* cream */
  opacity: 0.9;
}
</style>