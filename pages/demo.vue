<template>
  <div class="min-h-screen bg-brown-10 py-10 px-4">
    <div class="max-w-6xl mx-auto space-y-10">

      <section class="bg-white/90 border border-brown-8 rounded-[32px] p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)] space-y-4">
        <BaseTypography variant="h2" tag="h1">設計系統展示</BaseTypography>
        <BaseTypography variant="subtitle" tag="p" class="text-brown-4">
          這頁整理了目前的字體階層、按鈕、表單元件與品牌色票，方便快速檢視每個基本元件的樣貌與狀態。
        </BaseTypography>
      </section>

      <section class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-5 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Typography</BaseTypography>
          <div class="space-y-4">
            <div v-for="sample in typographySamples" :key="sample.label" class="flex items-baseline justify-between gap-4 border-b border-brown-9 pb-3">
              <BaseTypography :variant="sample.variant" :tag="sample.tag">{{ sample.text }}</BaseTypography>
              <span class="text-small text-brown-5 uppercase tracking-wide">{{ sample.label }}</span>
            </div>
          </div>
        </div>

         <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <div class="flex items-center justify-between mb-4">
            <BaseTypography variant="title" tag="h2" class="text-brown-2">Calendar</BaseTypography>
            <BaseButton
              variant="outline"
              size="medium"
              class="w-32 px-4"
              @click="calendarMode = calendarMode === 'view' ? 'select' : 'view'"
            >
              {{ calendarMode === 'view' ? '切換到選擇模式' : '切換到瀏覽模式' }}
            </BaseButton>
          </div>
          <ClientOnly>
            <BaseCalendar 
              v-if="calendarMode === 'view'"
              :holidays="holidays"
              :today="today"
              :course-dates="courseDates"
            />
            <BaseCalendar 
              v-else
              v-model="selectedDate"
              :holidays="holidays"
              :today="today"
              :course-dates="courseDates"
            />
            <div class="mt-4 pt-4 border-t border-brown-8 text-center">
              <p class="text-sm text-brown-5 mb-1">選擇的日期</p>
              <p class="text-lg font-semibold text-brown-1">
                {{ selectedDate.getFullYear() }}年 {{ selectedDate.getMonth() + 1 }}月 {{ selectedDate.getDate() }}日
              </p>
            </div>
          </ClientOnly>
        </div>
       
      </section>

      <section class="grid gap-6 lg:grid-cols-1">
         <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Carousel</BaseTypography>
          <BaseCarousel :items="carouselItems" :autoplay="true" :interval="6000" />
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-1">
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Search Input</BaseTypography>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-brown-5 mb-2">搜尋建議 (輸入「日」試試)</p>
              <BaseSearchInput 
                v-model="searchQuery" 
                placeholder="日文" 
                :suggestions="searchSuggestions"
                @select="handleSearchSelect"
              />
            </div>
            <div>
              <p class="text-sm text-brown-5 mb-2">Disable</p>
              <BaseSearchInput v-model="searchDisabled" placeholder="日文" :disabled="true" />
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-1">
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Course Card</BaseTypography>
                 
          <!-- 課程卡片列表 -->
          <div class="flex flex-wrap gap-4">
            <CourseCard
              v-for="course in courses"
              :key="course.id"
              :title="course.title"
              :status="course.status"
              :status-type="course.statusType"
              :tags="course.tags"
              :show-progress="course.showProgress"
              :progress="course.progress"
              :time-info="course.timeInfo"
              :image="course.image"
              :bookmarked="courseBookmarks[course.id]"
              :can-enter-course="course.canEnterCourse"
              :enter-button-text="course.enterButtonText"
              @toggle-bookmark="toggleCourseBookmark(course.id)"
            />
          </div>
        </div>

        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Buttons</BaseTypography>
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseButton variant="primary" size="large">Primary / Large</BaseButton>
            <BaseButton variant="primary" size="medium">Primary / Medium</BaseButton>
            <BaseButton variant="secondary" size="large">Secondary / Large</BaseButton>
            <BaseButton variant="secondary" size="medium">Secondary / Medium</BaseButton>
            <BaseButton variant="outline" size="large">Outline / Large</BaseButton>
            <BaseButton variant="outline" size="medium">Outline / Medium</BaseButton>
            <BaseButton variant="primary" size="large" :disabled="true">Disabled State</BaseButton>
            <BaseButton variant="primary" size="medium" :disabled="true">Disabled State</BaseButton>
            <BaseButton variant="brown" size="large">Brown / Large</BaseButton>
            <BaseButton variant="brown" size="medium">Brown / Medium</BaseButton>
            
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Inputs & Dropdown</BaseTypography>
          <div class="space-y-4">
            <BaseInput
              v-model="inputDefault"
              label="一般輸入"
              placeholder="請輸入內容"
            />
            <BaseInput
              v-model="inputError"
              label="錯誤狀態"
              placeholder="請輸入內容"
              :error="true"
              error-message="請檢查輸入格式"
            />
            <BaseInput
              v-model="inputDisabled"
              label="停用狀態"
              placeholder="停用"
              :disabled="true"
            />
            <BaseDropdown
              v-model="dropdownValue"
              label="課程類型"
              placeholder="請選擇課程"
              :options="dropdownOptions"
            />
          </div>
        </div>

        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Learning Frequency Card</BaseTypography>
          <div class="space-y-4">
            <LearningFrequencyCard
              :value="62"
              title="簡單練習前"
              status-text="學習頻率尚可"
              :info-number="12"
              @info-click="handleFrequencyInfo"
              @click="handleFrequencyClick"
            />
            <LearningFrequencyCard
              :value="85"
              title="完成課程數"
              status-text="學習狀態良好"
              progress-color="#85C7A4"
              :info-number="8"
              @info-click="handleFrequencyInfo"
              @click="handleFrequencyClick"
            />
            <LearningFrequencyCard
              :value="30"
              title="本週練習"
              status-text="需要加強"
              progress-color="#FF3D00"
              :show-info-icon="true"
              :info-number="3"
            />
            
            <BaseTypography variant="subtitle" tag="h3" class="text-brown-5 mb-2">未登入狀態展示</BaseTypography>
            <LearningFrequencyCard
              :value="('-' as FrequencyCardValue)"
              :info-number="('-' as FrequencyCardValue)"
              :progress-color="'#A89A8D'"
              :show-info-icon="true"
              :show-arrow="true"
            />
          </div>
        </div>
        
      </section>

       <section class="grid gap-6 lg:grid-cols-2">

        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2 mb-4">統計圓環卡片展示</BaseTypography>
          <CircleStatsGroup :items="circleStatsItems" />
           <div class="mt-8">
             <BaseTypography variant="subtitle" tag="h3" class="text-brown-5 mb-2">未登入狀態展示</BaseTypography>
             <CircleStatsGroup :items="circleStatsItemsGuest" />
           </div>
        </div>

        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Course Card Simple</BaseTypography>
          <CourseCardSimple
            title="N5文法"
            status="進行中"
            :tags="['N5', '文法', '單字']"
            :progress="80"
            timeInfo="上午10:00 - 中午12:30"
            image=""
          />
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-2">
        
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Selection Controls</BaseTypography>
          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <BaseCheckbox v-model="checkboxNewsletter" label="訂閱學習電子報" />
              <BaseCheckbox v-model="checkboxAgreement" label="已閱讀服務條款" />
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <BaseRadio v-model="radioLevel" name="level" value="starter" label="初階" />
              <BaseRadio v-model="radioLevel" name="level" value="advanced" label="進階" />
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <BaseToggle v-model="toggleReminder" label="開啟課程提醒" />
              <BaseToggle v-model="toggleMuted" label="靜音模式" :disabled="true" />
            </div>
          </div>
        </div>
        
      </section>

      <section class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
        <BaseTypography variant="title" tag="h2" class="text-brown-2">Color Palette</BaseTypography>
        <div class="grid gap-6 md:grid-cols-2">
          <div v-for="group in colorGroups" :key="group.title" class="space-y-3">
            <div>
              <p class="text-subtitle text-brown-2 font-semibold">{{ group.title }}</p>
              <p class="text-small text-brown-5 leading-snug">{{ group.description }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <div v-for="color in group.colors" :key="color.token" class="flex flex-col items-center gap-2">
                <div :class="['w-20 h-20 rounded-3xl shadow-[0_8px_18px_rgba(0,0,0,0.08)] border border-brown-8', color.class]"></div>
                <div class="text-small text-brown-4 text-center leading-tight">
                  <p class="uppercase">{{ color.token }}</p>
                  <p class="uppercase">{{ color.hex }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-1">
        <div class="bg-white border border-brown-8 rounded-[24px] p-6 space-y-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <BaseTypography variant="title" tag="h2" class="text-brown-2">Popup Demo</BaseTypography>
          <BaseButton variant="primary" size="large" @click="showPopup = true">打開彈窗</BaseButton>
          <Popup v-if="showPopup" @close="showPopup = false" />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type FrequencyCardValue = number | string

import CircleStatsGroup from '@/components/CircleStatsGroup.vue'
import Popup from '@/components/Popup.vue'

const circleStatsItems = [
  { value: 14, label: '快朗', color: '#D95847', maxValue: 20 },
  { value: 6, label: '組織圖', color: '#3E7871', maxValue: 20 },
  { value: 3, label: '關鍵字', color: '#F2A74B', maxValue: 20 },
  { value: 8, label: '必修課', color: '#4285F4', maxValue: 20 }
]

const circleStatsItemsGuest = [
  { value: '-', label: '-', color: '#D95847', maxValue: 20 },
  { value: '-', label: '-', color: '#3E7871', maxValue: 20 },
  { value: '-', label: '-', color: '#F2A74B', maxValue: 20 },
  { value: '-', label: '-', color: '#4285F4', maxValue: 20 }
]

interface TypographySample {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'subtitle' | 'body' | 'caption' | 'small'
  tag: string
  label: string
  text: string
}

interface ColorSwatch {
  token: string
  hex: string
  class: string
}

interface ColorGroup {
  title: string
  description: string
  colors: ColorSwatch[]
}

interface Course {
  id: string
  title: string
  status: string
  statusType: 'ongoing' | 'today' | 'other'
  tags: string[]
  showProgress: boolean
  progress?: number
  timeInfo: string
  image?: string
  canEnterCourse: boolean
  enterButtonText?: string
}

interface CarouselItem {
  id: string | number
  image: string
  alt: string
}

// 輪播假資料
const carouselItems = ref<CarouselItem[]>([
  {
    id: 1,
    image: '/images/Carousel1.png',
    alt: '輪播圖片 1'
  },
  {
    id: 2,
    image: 'https://placehold.co/800x400/3E7871/FFFFFF?text=Slide+2',
    alt: '輪播圖片 2'
  },
  {
    id: 3,
    image: 'https://placehold.co/800x400/F2A74B/FFFFFF?text=Slide+3',
    alt: '輪播圖片 3'
  }
])

// 搜尋輸入框狀態
const searchQuery = ref('')
const searchDisabled = ref('日文')

// 搜尋建議假資料
const searchSuggestions = [
  {
    title: '日文課程推薦',
    badge: '日文討論區',
    badgeColor: 'primary' as const
  },
  {
    title: '商業日文會話',
    badge: '聚樂部',
    badgeColor: 'secondary' as const
  },
  {
    title: '日文快閃文章參照',
    badge: '學習任務',
    badgeColor: 'alert' as const
  },
  {
    title: '商業日文會話',
    badge: '聚樂部',
    badgeColor: 'secondary' as const,
    disabled: true
  }
]

const handleSearchSelect = (suggestion: any) => {
  console.log('選擇了:', suggestion)
}

// 學習頻率卡片事件處理
const handleFrequencyInfo = () => {
  console.log('顯示學習頻率說明')
}

const handleFrequencyClick = () => {
  console.log('點擊學習頻率卡片')
}

// 課程假資料
const courses = ref<Course[]>([
    {
    id: 'course1',
    title: 'N5綜合養成',
    status: '進行中',
    statusType: 'ongoing',
    tags: ['N5', '語聯', '聽解'],
    showProgress: true,
    progress: 50,
    timeInfo: '22:30 - 23:00',
    canEnterCourse: true
  },
  {
    id: 'course2',
    title: '日文口說養成',
    status: '今日',
    statusType: 'today',
    tags: ['N2', '主題', '聽解'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: false
  },
  {
    id: 'course3',
    title: '日文主題班',
    status: '星期四',
    statusType: 'other',
    tags: ['N3', '文法', '閱讀'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: false,
    enterButtonText: '提醒我'
  },{
    id: 'course4',
    title: 'N3文法養成',
    status: '11/4',
    statusType: 'other',
    tags: ['N3', '文法', '閱讀'],
    showProgress: true,
    progress: 0,
    timeInfo: '10:00 - 12:30',
    canEnterCourse: true
  }
])

const typographySamples: TypographySample[] = [
  { variant: 'h1', tag: 'h1', label: 'H1 · 40px', text: '我是大標題一' },
  { variant: 'h2', tag: 'h2', label: 'H2 · 32px', text: '我是大標題二' },
  { variant: 'h3', tag: 'h3', label: 'H3 · 24px', text: '我是大標題三' },
  { variant: 'h4', tag: 'h4', label: 'H4 · 20px', text: '我是大標題四' },
  { variant: 'h5', tag: 'h5', label: 'H5 · 18px', text: '我是大標題五' },
  { variant: 'title', tag: 'p', label: 'Title · 16px', text: '我是標題' },
  { variant: 'subtitle', tag: 'p', label: 'Subtitle · 14px', text: '我是副標題' },
  { variant: 'body', tag: 'p', label: 'Body · 16px', text: '我是內文文字' },
  { variant: 'caption', tag: 'p', label: 'Caption · 12px', text: '我是備註文字' },
  { variant: 'small', tag: 'p', label: 'Small · 10px', text: '我是輔助文字' }
]

const colorGroups: ColorGroup[] = [
  {
    title: 'Primary Color',
    description: '暖色調主色適合用在關鍵 CTA 與品牌識別元素。',
    colors: [
      { token: 'primary-1', hex: '#D95847', class: 'bg-primary-1' },
      { token: 'primary-2', hex: '#EE7959', class: 'bg-primary-2' },
      { token: 'primary-3', hex: '#F5B6AA', class: 'bg-primary-3' },
      { token: 'primary-1/35', hex: '#D95847/35', class: 'bg-primary-1/35' }
    ]
  },
  {
    title: 'Secondary Color',
    description: '清新的綠色系補充主視覺，適合頁面重點區塊與狀態。',
    colors: [
      { token: 'secondary-1', hex: '#3E7871', class: 'bg-secondary-1' },
      { token: 'secondary-2', hex: '#5F9289', class: 'bg-secondary-2' },
      { token: 'secondary-3', hex: '#85C7A4', class: 'bg-secondary-3' },
      { token: 'secondary-4', hex: '#3E7871/35', class: 'bg-secondary-1/35' }
    ]
  },
  {
    title: 'Alert Color',
    description: '顯眼的提醒色彩用於錯誤與系統警示。',
    colors: [
      { token: 'alert-1', hex: '#FF3D00', class: 'bg-alert-1' },
      { token: 'alert-2', hex: '#FF3D00-1/35', class: 'bg-alert-1/35' }
    ]
  },
  {
    title: 'Complementary Color',
    description: '互補色加強版面層次，可搭配資訊圖表或標籤。',
    colors: [
      { token: 'complementary-1', hex: '#F2A74B', class: 'bg-complementary-1' },
      { token: 'complementary-1/35', hex: '#F2A74B/35', class: 'bg-complementary-1/35' },
      { token: 'complementary-2', hex: '#4285F4', class: 'bg-complementary-2' },
      { token: 'complementary-2/35', hex: '#4285F4/35', class: 'bg-complementary-2/35' }
    ]
  },
  {
    title: 'Brown Scale',
    description: '咖啡色階提供背景、邊框與字色的細膩層次。',
    colors: [
      { token: 'brown-1', hex: '#362010', class: 'bg-brown-1' },
      { token: 'brown-2', hex: '#49301B', class: 'bg-brown-2' },
      { token: 'brown-3', hex: '#5D4026', class: 'bg-brown-3' },
      { token: 'brown-4', hex: '#614030', class: 'bg-brown-4' },
      { token: 'brown-5', hex: '#8E7A69', class: 'bg-brown-5' },
      { token: 'brown-6', hex: '#A89A8D', class: 'bg-brown-6' },
      { token: 'brown-7', hex: '#C2B8AE', class: 'bg-brown-7' },
      { token: 'brown-8', hex: '#DCD6D1', class: 'bg-brown-8' },
      { token: 'brown-9', hex: '#F2EFEC', class: 'bg-brown-9' },
      { token: 'brown-10', hex: '#F8F7F0', class: 'bg-brown-10' }
    ]
  }
]

const inputDefault = ref('')
const inputError = ref('')
const inputDisabled = ref('無法編輯的內容')

const dropdownValue = ref<string | number>('')
const dropdownOptions = [
  { label: '英語課程', value: 'english' },
  { label: '日語課程', value: 'japanese' },
  { label: '韓語課程', value: 'korean' }
]

const checkboxNewsletter = ref(true)
const checkboxAgreement = ref(false)
const radioLevel = ref<'starter' | 'advanced'>('starter')
const toggleReminder = ref(true)
const toggleMuted = ref(false)

// Course Card - 使用物件管理每張卡片的書籤狀態
const courseBookmarks = ref<Record<string, boolean>>({
  course1: true,
  course2: true,
  course3: false,
  course4: false
})

const toggleCourseBookmark = (courseId: string) => {
  courseBookmarks.value[courseId] = !courseBookmarks.value[courseId]
}

// 輔助函數：直觀的日期創建 (月份1-12)
const createDate = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day)
}

// Calendar - 使用固定時間戳避免 SSR hydration mismatch
const selectedDate = ref(new Date()) // 初始顯示 2025年11月
const today = ref(new Date()) // 2025年11月17日
const holidays = ref([
  new Date(2025, 10, 6),   // 2025/11/6
  new Date(2025, 10, 12),  // 2025/11/12
  new Date(2025, 10, 13),  // 2025/11/13
  new Date(2025, 10, 17),  // 2025/11/17
  new Date(2025, 10, 20),  // 2025/11/20
  new Date(2025, 10, 24),  // 2025/11/24
  new Date(2025, 10, 27),  // 2025/11/27
  new Date(2025, 10, 30)   // 2025/11/30
])

// 有課程的日期（顯示兩個點點）
const courseDates = ref([
  new Date(2025, 10, 1),   // 2025/11/1
  new Date(2025, 10, 6),   // 2025/11/6
  new Date(2025, 10, 7),   // 2025/11/7
  new Date(2025, 10, 8),   // 2025/11/8
  new Date(2025, 10, 9),   // 2025/11/9
  new Date(2025, 10, 13),  // 2025/11/13
  new Date(2025, 10, 14),  // 2025/11/14
  new Date(2025, 10, 15),  // 2025/11/15
  new Date(2025, 10, 18),  // 2025/11/18
  new Date(2025, 10, 19),  // 2025/11/19
  new Date(2025, 10, 27)   // 2025/11/27
])

const showPopup = ref(false)
const calendarMode = ref<'view' | 'select'>('view')

</script>

