<template>
  <div class="w-full h-auto bg-brown-1 rounded-[24px] p-7 shadow-card border border-brown-8 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
    <!-- 圆形进度条 - 使用相對尺寸 -->
    <div class="relative flex-shrink-0" :style="{ width: circleSize, height: circleSize }">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <!-- 背景圆环 -->
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="#F8F7F0"
          stroke-width="10"
          fill="none"
        />
        <!-- 進度圓環：未登入顯示 25% 灰色 -->
        <circle
          v-if="String(value) === '-'"
          cx="40"
          cy="40"
          r="32"
          stroke="#A89A8D"
          stroke-width="10"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference * 0.90"
          class="transition-all duration-500 ease-out"
        />
        <!-- 進度圓環：一般狀態 -->
        <circle
          v-else
          cx="40"
          cy="40"
          r="32"
          :stroke="progressColor"
          stroke-width="10"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-500 ease-out"
        />
      </svg>
      <!-- 中心数字 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span :class="['font-bold text-brown-10', numberSize]">{{ String(value) === '-' ? '-' : displayValue }}</span>
      </div>
    </div>

    <!-- 右侧文字内容 -->
    <div class="flex-1 min-w-0 flex flex-col items-center justify-center px-4">
      <!-- 標題+數字（白底圓角） -->
      <div class="inline-flex items-center bg-brown-10 w-[145px] rounded-full px-4 py-2 mb-2">
        <span :class="['font-bold text-brown-2 mr-3', titleSize]">{{ String(value) === '-' ? '訪客狀態' : title }}</span>
        <span v-if="showInfoIcon" :class="['flex-shrink-0 rounded-full bg-brown-2 text-brown-10 flex items-center justify-center font-bold', iconSize]">{{ String(value) === '-' ? '-' : infoNumber }}</span>
      </div>
      <!-- 狀態文字 -->
      <p :class="['text-brown-10 font-bold text-center', statusSize]">{{ String(value) === '-' ? '無法測量' : statusText }}</p>
    </div>

    <!-- 右箭头 -->
    <button 
      v-if="showArrow"
      class="flex-shrink-0 text-brown-10 hover:text-brown-9 transition-colors"
      @click="$emit('click')"
      type="button"
    >
      <svg :class="['fill-none stroke-current', arrowSize]" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number | string // 支援數字或 '-'
  maxValue?: number // 最大值，預設 100
  title?: string // 卡片標題
  statusText?: string // 狀態文字
  showInfoIcon?: boolean // 是否顯示右側數字
  infoNumber?: number | string // 右側數字
  showArrow?: boolean // 是否顯示右箭頭
  progressColor?: string // 進度條顏色
  size?: 'small' | 'medium' | 'large' // 新增：尺寸選項
}

const props = withDefaults(defineProps<Props>(), {
  maxValue: 100,
  title: '簡單練習前',
  statusText: '學習頻率尚可',
  showInfoIcon: true,
  infoNumber: 1,
  showArrow: true,
  progressColor: '#F2A74B', // complementary-1
  size: 'medium' // 新增預設值
})

defineEmits<{
  'info-click': []
  'click': []
}>()

// 根據 size 調整各元素尺寸
const circleSize = computed(() => {
  const sizes = {
    small: '60px',
    medium: '80px',
    large: '100px'
  }
  return sizes[props.size]
})

const numberSize = computed(() => {
  const sizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  }
  return sizes[props.size]
})

const titleSize = computed(() => {
  const sizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  }
  return sizes[props.size]
})

const statusSize = computed(() => {
  const sizes = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-lg'
  }
  return sizes[props.size]
})

const iconSize = computed(() => {
  const sizes = {
    small: 'w-5 h-5 text-sm',
    medium: 'w-7 h-7 text-lg',
    large: 'w-9 h-9 text-xl'
  }
  return sizes[props.size]
})

const arrowSize = computed(() => {
  const sizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7'
  }
  return sizes[props.size]
})

// 顯示的數值
const displayValue = computed(() => {
  if (String(props.value) === '-') return '-'
  return Math.min(Math.max(0, Math.round(Number(props.value))), props.maxValue)
})

// 圓環周長
const radius = 32
const circumference = computed(() => 2 * Math.PI * radius)

// 進度偏移量
const dashOffset = computed(() => {
  if (String(props.value) === '-') return circumference.value * 0.90
  const progress = Number(displayValue.value) / props.maxValue
  return circumference.value * (1 - progress)
})
</script>
