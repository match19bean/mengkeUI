<template>
  <div class="w-full bg-white rounded-3xl p-7 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-brown-8">
    <!-- 標題和進度文字 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-black text-brown-1 flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style="font-size: 16px; font-weight: 900;">
        {{ title || '-' }}
      </h3>
      <span class="font-black text-brown-1 flex-shrink-0" style="font-size: 12px; font-weight: 900;">
        <template v-if="completed !== null && completed !== undefined && total">
          {{ completed }}/{{ total }} 堂
        </template>
        <template v-else>
          - 小堂
        </template>
      </span>
    </div>

    <!-- 進度條 -->
    <div class="w-full bg-brown-8 rounded-full h-4 overflow-hidden">
      <div
        v-if="completed !== null && completed !== undefined && total"
        class="h-full rounded-full transition-all duration-300"
        :style="{
          width: progressPct,
          backgroundColor: progressColor
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string // 課堂標題
  completed?: number | null // 已完成課堂數
  total?: number | null // 總課堂數
  progressColor?: string // 進度條顏色
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  completed: null,
  total: null,
  progressColor: '#E8996D' // 預設為橙紅色
})

const progressPct = computed(() => {
  if (!props.total || props.total === 0) return '0%'
  if (props.completed === null || props.completed === undefined) return '0%'
  return `${(props.completed / props.total) * 100}%`
})
</script>

<style scoped>
</style>
