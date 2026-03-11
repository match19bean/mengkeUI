<template>
  <div class="min-h-screen bg-cream px-4 py-6 lg:px-10 lg:py-10">
    <div class="mx-auto w-full max-w-[1440px] space-y-8">
      <!-- 頁面標題 -->
      <section class="space-y-2">
        <BaseTypography variant="h2" tag="h1" class="text-brown-1">學習任務</BaseTypography>
        <BaseTypography variant="subtitle" tag="p" class="text-brown-5">
          查看你的學習策略分析與學習趨勢
        </BaseTypography>
      </section>

      <!-- 圖表展示區域 -->
      <section class="grid gap-6 lg:grid-cols-2">
        <!-- 雷達圖 - 策略分析 -->
        <RadarChart
          :items="radarData"
          :maxValue="100"
          currentLabel="現況分數"
          targetLabel="期望分數"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RadarChart from '@/components/RadarChart.vue'

// 雷達圖數據
const radarData = ref([
  { label: '記憶策略', current: 20, target: 50 },
  { label: '認知策略', current: 85, target: 95 },
  { label: '補償策略', current: 60, target: 80 },
  { label: '元認知策略', current: 70, target: 85 },
  { label: '情感策略', current: 80, target: 90 },
  { label: '社交策略', current: 65, target: 75 }
])

// 面積圖數據（兩週對比）
const trendData = ref([
  {
    name: '本週',
    color: '#FF9B80',
    data: [5, 7, 10, 12, 11, 9, 7, 8, 10, 13, 15, 12, 11, 9],
    highlightIndex: 10
  },
  {
    name: '上週',
    color: '#EE7959',
    data: [3, 5, 7, 9, 8, 10, 6, 4, 6, 9, 8, 10, 13, 11],
    highlightIndex: 6
  }
])
</script>
