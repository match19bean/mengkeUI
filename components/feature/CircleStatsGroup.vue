<template>
  <div class="w-full h-auto bg-brown-2 rounded-[24px] p-6 shadow-card border border-brown-8">
    <!-- 移除 max-w-2xl，改用 w-full -->
    <div class="grid grid-cols-4 gap-4">
      <div v-for="item in items" :key="item.label" class="flex flex-col items-center gap-2">
        <!-- 圓形進度條 -->
        <div class="relative">
          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <!-- 背景圓環 -->
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="#F8F7F0"
              stroke-width="10"
              fill="none"
            />
            <!-- 進度圓環 -->
            <circle
              v-if="item.value === '-'"
              cx="32"
              cy="32"
              r="25"
              stroke="#A89A8D"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference * 0.90"
              class="transition-all duration-500 ease-out"
            />
            <circle
              v-else
              cx="32"
              cy="32"
              r="25"
              :stroke="item.color"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="getDashOffset(item.value, item.maxValue)"
              class="transition-all duration-500 ease-out"
            />
          </svg>
          <!-- 中心數字 -->
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold text-brown-10">{{ item.value === '-' ? '-' : item.value }}</span>
          </div>
        </div>
        <!-- 標籤文字 -->
        <span class="text-base text-brown-10 font-bold tracking-wide">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Item {
  value: number | string
  label: string
  color: string
  maxValue?: number
}

defineProps<{ items: Item[] }>()

const radius = 25
const circumference = 2 * Math.PI * radius

function getDashOffset(value: number | string, maxValue: number = 20) {
  if (value === '-') return circumference
  const progress = Math.min(Math.max(0, Number(value)), maxValue) / maxValue
  return circumference * (1 - progress)
}
</script>

<style scoped>
.bg-brown-2 {
  background-color: #362010;
}
.text-brown-10 {
  color: #F8F7F0;
}
</style>
