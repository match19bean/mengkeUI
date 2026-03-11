<template>
  <div class="w-full min-w-0 h-auto bg-brown-1 rounded-[24px] p-7 shadow-card border border-brown-8">
    <!-- 上方：百分比和提示文字 -->
    <div class="mb-8">
      <!-- 百分比 -->
      <div v-if="percentage !== null" class="flex items-baseline gap-2 mb-3">
        <span class="text-5xl font-bold text-brown-10">{{ percentage.toFixed(2) }}</span>
        <span class="text-2xl text-brown-10 font-semibold">%</span>
      </div>
      <!-- 標題 -->
      <p v-if="title" class="text-sm text-brown-9 font-medium">{{ title }}</p>
      <!-- 提示文字 -->
      <p v-if="hint" class="text-xs text-brown-8 mt-1">{{ hint }}</p>
    </div>

    <!-- 下方：柱狀圖 -->
    <div v-if="data && data.length > 0" class="space-y-4">
      <!-- 圖表區域 -->
      <div class="flex gap-2" :style="{ height: chartHeight }">
        <!-- Y 軸標籤 -->
        <div class="w-8 flex flex-col justify-between text-xs text-brown-8 font-medium flex-shrink-0">
          <span>{{ computedMaxValue }}</span>
          <span v-if="Math.ceil(computedMaxValue / 2) !== computedMaxValue">
            {{ Math.ceil(computedMaxValue / 2) }}
          </span>
          <span>0</span>
        </div>

        <!-- 柱狀圖容器 -->
        <div class="flex-1 min-w-0 flex items-end relative gap-1.5">
          <!-- 背景網格線 -->
          <svg class="absolute left-0 right-0 top-0 bottom-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <line x1="0" y1="0%" x2="100%" y2="0%" stroke="#CDC7BE" stroke-width="0.5" opacity="0.3" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="#CDC7BE" stroke-width="0.5" opacity="0.3" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="#CDC7BE" stroke-width="0.5" opacity="0.3" />
            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#CDC7BE" stroke-width="0.5" />
          </svg>

          <!-- 數據柱 -->
          <div
            v-for="(item, index) in data"
            :key="index"
            class="flex-1 min-w-0 flex flex-col items-center justify-end h-full"
          >
            <!-- 柱子 -->
            <div
              class="w-4/5 rounded-md transition-all duration-300 hover:opacity-80 cursor-pointer"
              :class="highlightIndex === index ? 'bar-highlight' : 'bar-normal'"
              :style="{ height: barHeightPct(item.value) }"
              @mouseenter="onEnter(index)"
              @mouseleave="onLeave()"
            ></div>
          </div>
        </div>
      </div>

      <!-- X 軸標籤 -->
      <div class="flex gap-2">
        <div class="w-8 flex-shrink-0"></div>
        <div class="flex-1 min-w-0 flex gap-1.5">
          <div
            v-for="(item, index) in data"
            :key="`label-${index}`"
            class="flex-1 min-w-0 text-center"
          >
            <span class="text-xs text-brown-8 font-medium">{{ item.label || index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="w-full h-64 flex items-center justify-center">
      <p class="text-brown-8">暫無資料</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DataItem {
  value: number
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

const highlightIndex = ref<number | null>(null)

// maxValue：外部有給就用外部，沒給就用 data 最大值；最小至少 1 避免除以 0
const computedMaxValue = computed(() => {
  const dataMax = Math.max(0, ...props.data.map(d => Number.isFinite(d.value) ? d.value : 0))
  const mv = props.maxValue ?? dataMax
  return Math.max(1, mv)
})

// 高度百分比：clamp 0~100，避免超出容器 / NaN
const barHeightPct = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0
  const pct = (safeValue / computedMaxValue.value) * 100
  const clamped = Math.max(0, Math.min(100, pct))
  return `${clamped}%`
}

const onEnter = (index: number) => {
  highlightIndex.value = index
}
const onLeave = () => {
  highlightIndex.value = null
}
</script>

<style scoped>
/* 柱子顏色 - 根據設計稿調整 */
.bar-normal {
  background-color: #E8D4CF; /* 浅粉红色 */
}

.bar-highlight {
  background-color: #F0B8AC; /* 更深的粉红色 */
}
</style>