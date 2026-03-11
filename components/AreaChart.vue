<template>
  <div class="rounded-2xl bg-white p-6 shadow-md">
    <!-- 標題 -->
    <div v-if="title" class="mb-6">
      <BaseTypography variant="h4" tag="h3" class="text-brown-1">
        {{ title }}
      </BaseTypography>
    </div>

    <!-- 圖表容器 -->
    <div class="relative" :style="`height: ${chartHeight}`">
      <svg width="100%" :height="chartHeight" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
        <!-- 定義漸變 -->
        <defs>
          <linearGradient
            v-for="(item, index) in series"
            :key="'gradient-' + index"
            :id="`areaGradient${index}`"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" :stop-color="item.color" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="item.color" stop-opacity="0.05" />
          </linearGradient>
        </defs>

        <!-- Y軸刻度線 -->
        <g v-for="level in 6" :key="'y-line-' + level">
          <line
            :x1="padding"
            :y1="padding + (chartAreaHeight / 5) * (level - 1)"
            :x2="padding + chartAreaWidth"
            :y2="padding + (chartAreaHeight / 5) * (level - 1)"
            stroke="#E8E4DD"
            stroke-width="1"
          />
          <text
            :x="padding - 10"
            :y="padding + (chartAreaHeight / 5) * (level - 1) + 4"
            text-anchor="end"
            class="text-[10px] fill-brown-5"
          >
            {{ Math.round(maxValue - (maxValue / 5) * (level - 1)) }}
          </text>
        </g>

        <!-- 繪製面積圖和線條 -->
        <g v-for="(item, seriesIndex) in series" :key="'series-' + seriesIndex">
          <!-- 面積 -->
          <path
            :d="getAreaPath(item.data)"
            :fill="`url(#areaGradient${seriesIndex})`"
          />

          <!-- 線條 -->
          <path
            :d="getLinePath(item.data)"
            :stroke="item.color"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- 數據點 -->
          <g v-for="(value, pointIndex) in item.data" :key="'point-' + pointIndex">
            <circle
              :cx="getX(pointIndex)"
              :cy="getY(value)"
              :r="pointIndex === item.highlightIndex ? 6 : 4"
              :fill="item.color"
              :stroke="pointIndex === item.highlightIndex ? 'white' : 'none'"
              :stroke-width="pointIndex === item.highlightIndex ? 2 : 0"
            />
          </g>
        </g>

        <!-- X軸標籤 -->
        <g v-for="(_, index) in series[0]?.data || []" :key="'x-label-' + index">
          <text
            v-if="index % 2 === 0"
            :x="getX(index)"
            :y="padding + chartAreaHeight + 20"
            text-anchor="middle"
            class="text-[10px] fill-brown-5"
          >
            {{ index + 1 }}
          </text>
        </g>
      </svg>
    </div>

    <!-- 圖例 -->
    <div class="mt-6 flex items-center justify-center gap-6">
      <div
        v-for="(item, index) in series"
        :key="'legend-' + index"
        class="flex items-center gap-2"
      >
        <div
          class="h-3 w-3 rounded-full"
          :style="`background-color: ${item.color}`"
        ></div>
        <span class="text-sm text-brown-3">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SeriesItem {
  name: string
  color: string
  data: number[]
  highlightIndex?: number
}

interface Props {
  series: SeriesItem[]
  title?: string
  maxValue?: number
  chartHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxValue: 100,
  chartHeight: '300px'
})

// 圖表尺寸設置
const padding = 50
const chartAreaWidth = 500
const chartAreaHeight = 200

// 計算X座標
function getX(index: number): number {
  const pointCount = props.series[0]?.data.length || 1
  const spacing = chartAreaWidth / (pointCount - 1)
  return padding + index * spacing
}

// 計算Y座標
function getY(value: number): number {
  const ratio = value / props.maxValue
  return padding + chartAreaHeight - ratio * chartAreaHeight
}

// 生成面積路徑
function getAreaPath(data: number[]): string {
  if (data.length === 0) return ''
  
  let path = `M ${getX(0)} ${padding + chartAreaHeight}`
  
  // 向上到第一個點
  path += ` L ${getX(0)} ${getY(data[0]!)}`
  
  // 連接所有數據點
  for (let i = 1; i < data.length; i++) {
    path += ` L ${getX(i)} ${getY(data[i]!)}`
  }
  
  // 向下到底部
  path += ` L ${getX(data.length - 1)} ${padding + chartAreaHeight}`
  
  // 關閉路徑
  path += ' Z'
  
  return path
}

// 生成線條路徑
function getLinePath(data: number[]): string {
  if (data.length === 0) return ''
  
  let path = `M ${getX(0)} ${getY(data[0]!)}`
  
  for (let i = 1; i < data.length; i++) {
    path += ` L ${getX(i)} ${getY(data[i]!)}`
  }
  
  return path
}
</script>

<style scoped>
/* 可以根據需要添加自定義樣式 */
</style>
