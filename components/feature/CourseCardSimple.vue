<template>
  <div class="w-full min-w-[340px] h-auto bg-brown-10 rounded-[24px] p-4 flex items-center gap-4 shadow-card">
    <!-- 左側圖片區塊 -->
    <div class="w-16 h-16 rounded-[16px] flex items-center justify-center mr-4 overflow-hidden">
      <img v-if="image" :src="image" alt="課程圖片" class="w-full h-full object-contain rounded-[16px]" />
      <img v-else src="/images/default-course.png" alt="預設課程圖片" class="w-20 h-20 object-contain rounded-[12px]" />
    </div>
    <!-- 右側內容 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-3 mb-2">
        <span class="text-title font-bold text-brown-2">{{ props.title }}</span>
        <span class="px-3 py-1 rounded-full w-[90px] text-center bg-primary-1 text-white text-sm font-bold whitespace-nowrap">{{ props.status }}</span>
      </div>
      <div class="flex gap-2 mb-2">
        <span v-for="tag in props.tags" :key="tag" class="px-3 py-1 rounded-full border border-brown-6 text-brown-2 text-xs font-bold">{{ tag }}</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <div class="flex-1 h-2 rounded-full bg-brown-8">
          <div class="h-2 rounded-full bg-primary-1" :style="{ width: progressBarWidth }"></div>
        </div>
      </div>
      <div class="text-brown-2 text-sm font-bold mt-1">{{ props.timeInfo }}</div>
    </div>
    <!-- 右箭頭 -->
    <button class="flex-shrink-0 text-brown-2 hover:text-brown-4 transition-colors" type="button">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  status: string
  tags: string[]
  progress: number
  timeInfo: string
  image?: string
}>()

const progressBarWidth = computed(() => {
  const percent = Math.max(0, Math.min(100, props.progress))
  return `${percent}%`
})
</script>
