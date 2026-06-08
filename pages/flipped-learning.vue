<template>
  <BasePageShell>
      <section class="grid gap-4 xl:grid-cols-7"> 
        <!-- 課程出席率 -->
        <div class="grid grid-rows-[auto_auto_1fr] gap-2 xl:col-span-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
                保持下去 ， 學習成功近在咫尺 ！ 
              </BaseTypography>
              <BaseTypography variant="subtitle" tag="p" class="font-primary color-subtitle">
                你對於我們的學習方式理解度很不錯唷 ， 持續學習下去吧 ！ <br/>不用逼自己每天學習，只要維持一定的學習熱度即可，適時地讓自己進行休息吧 ！
              </BaseTypography>
            </div>
            <div class="flex justify-end gap-3 flex-shrink-0">
             <CourseDropdown
              placeholder="切換課程"   
              v-model="selectedCourse"
              :items="courseOptions"
              size="medium"                
              @change="handleCourseChange"
              />
            </div>
          </div>
          <div>
            <LearningCurveChart :data="chartData" />
          </div>
        </div>

         <!-- 課程出席率 -->
        <div class="grid grid-rows-[auto_auto_1fr] gap-2 xl:col-span-2">
          <div class="flex justify-end gap-3 flex-shrink-0">
            <BaseButton 
              variant="outline" 
              size="large"
              class="!px-10 !rounded-lg !pt-[9px] !pb-[9px] !bg-primary-1 !text-cream !border-transparent disabled:!bg-brown-9 disabled:!text-white/60 disabled:!cursor-not-allowed"
            >
              <span>諮商預約</span>
              <span class="inline-flex min-w-[44px] items-center justify-center rounded-full bg-cream px-3 py-1 text-[14px] font-extrabold leading-none text-primary-1">
                {{ consultationProgressText }}
              </span>
            </BaseButton>
          </div>

          <RadarChart
            :items="radarData"
            :maxValue="100"
            currentLabel="現況分數"
            targetLabel="期望分數"
          />
        </div>
      </section>
      
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <LearningCycleCard
          title="學習週期"
          :score="50"
          :max-score="100"
          :phase-number="2"
          cycle-state="waiting-analysis"
          :remaining-days="6"
          :progress="84"
          start-date="11/1"
          end-date="11/28"
          scenario-status="請進行諮商預約"
        />

        <CurrentLearningPanel :items="currentLearningItems" @item-click="openLearningTaskPopup" />

        <LearningHistoryPanel :items="learningHistoryItems" @item-click="openLearningTaskPopup" />
      </div>

  </BasePageShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LearningCurveChart from '~/components/LearningCurveChart.vue'
import RadarChart from '@/components/RadarChart.vue'
import CourseDropdown from '~/components/CourseDropdown.vue'
import LearningCycleCard from '~/components/LearningCycleCard.vue'
import CurrentLearningPanel from '~/components/CurrentLearningPanel.vue'
import LearningHistoryPanel from '~/components/LearningHistoryPanel.vue'

interface RadarDataItem {
  label: string
  current: number
  target: number
}

// 搜尋相關
const searchQuery = ref('')

const openLearningTaskPopup = (item?: { taskId?: string }) => {
  const taskId = item?.taskId || 'fast-reading'
  void navigateTo(`/learning-task/${encodeURIComponent(taskId)}`)
}

const selectedCourse = ref<string | number | null>(null)

const handleCourseChange = (item: { label: string; value: string | number }) => {
  console.log('目前選擇:', item)
}

const consultationProgressText = ref('1/3')

const courseOptions = [
  {
    label: '反轉日文',
    value: 'jp',
    tag: '主要課程',
    tagClass: 'bg-[#ee7b55]'
  },
  {
    label: '反轉英文',
    value: 'en',
    tag: '課程標籤',
    tagClass: 'bg-[#9d9185]'
  },
  {
    label: '次要課程',
    value: 'sub',
    tag: '次要課程',
    tagClass: 'bg-[#9d9185]'
  },
  {
    label: '學習結束',
    value: 'done-1',
    tag: '學習結束',
    tagClass: 'bg-[#9d9185]'
  }
]

const handleSearchSelect = (suggestion: any) => {
  console.log('選擇了:', suggestion)
}

const searchSuggestions = [
  {
    title: '日文課程推薦',
    url: '/courses/japanese',
    type: '課程',
    badge: '日文討論區',
    badgeColor: 'primary',
    selectable: true
  },
  {
    title: '商業日文會話',
    url: '/courses/business-jp',
    type: '課程',
    badge: '聚樂部',
    badgeColor: 'secondary',
    selectable: true
  },
  {
    title: '日文快閃文章參照',
    url: '/posts/jp-flash',
    type: '文章',
    badge: '學習任務',
    badgeColor: 'alert',
    selectable: true
  },
  {
    title: 'N5 學習任務清單',
    url: '/tasks/n5',
    type: '學習任務',
    badge: '任務',
    badgeColor: 'primary',
    selectable: true
  }
]

// 雷達圖數據
const radarData = ref<RadarDataItem[]>([
  { label: '記憶策略', current: 20, target: 50 },
  { label: '認知策略', current: 85, target: 95 },
  { label: '補償策略', current: 60, target: 80 },
  { label: '元認知策略', current: 70, target: 85 },
  { label: '情感策略', current: 80, target: 90 },
  { label: '社交策略', current: 65, target: 75 }
])

const chartData = [
  { date: '2026-04-08', score: 70 },
  { date: '2026-04-09', score: 55 },
  { date: '2026-04-10', score: 70 },
  { date: '2026-04-11', score: 62 },
  { date: '2026-04-12', score: 20 }, // 低點 -> 藍點
  { date: '2026-04-13', score: 48 },
  { date: '2026-04-14', score: 72 }  // 今日 / 高點 -> 紅點
  
]

const currentLearningItems = [
  {
    taskId: 'fast-reading',
    title: '快朗',
    actionText: '預約或上傳音檔',
    actionClass: 'bg-primary-2 text-white',
    current: 3,
    total: 5,
    unit: '篇',
    progressClass: 'bg-primary-2'
  },
  {
    taskId: 'mind-map',
    title: '組織圖',
    current: 7,
    total: 20,
    unit: '篇',
    progressClass: 'bg-complementary-1'
  },
  {
    taskId: 'keyword',
    title: '關鍵字',
    current: 10,
    total: 16,
    unit: '篇',
    progressClass: 'bg-secondary-1'
  },
  {
    taskId: 'required-course',
    title: '必修課',
    actionText: '前往聚樂部',
    actionClass: 'bg-complementary-2 text-white',
    current: 6,
    total: 8,
    unit: '堂',
    progressClass: 'bg-complementary-2'
  }
]

const learningHistoryItems = [
  { taskId: 'fast-reading', title: '快朗', tags: ['聽力', '口說'], time: '今天 08:31' },
  { taskId: 'mind-map', title: '組織圖', tags: ['閱讀', '邏輯', '記憶'], time: '昨天 15:31' },
  { taskId: 'keyword', title: '歷程簡稱', tags: ['學習標籤', '學習標籤'], time: 'YYYY年MM月DD日 hh:mm' },
  { taskId: 'required-course', title: '歷程簡稱', tags: ['學習標籤', '學習標籤'], time: 'YYYY年MM月DD日 hh:mm' },
  { taskId: 'fast-reading', title: '歷程簡稱', tags: ['學習標籤', '學習標籤', '學習標籤'], time: 'YYYY年MM月DD日 hh:mm' }
]
</script>
