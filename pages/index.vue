<template>
  <div class="min-h-screen bg-cream px-4 py-6 lg:px-10 lg:py-10">
    <div class="mx-auto w-full max-w-[1440px] space-y-8">
      <!-- 頂部搜尋列 -->
      <header class="flex items-center justify-between gap-4">
        <BaseSearchInput
          v-model="searchQuery"
          placeholder="搜尋課程標籤、話題、教材、學習方法或教導等等"
          class="flex-1"
          :useApi="true"
          @search="handleSearch"
        />
        <div class="flex items-center gap-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center rounded-full">
            <img src="/images/bell.svg" alt="通知" class="h-5 w-5" />
          </button>
          <NuxtLink to="/login" class="flex h-[18px] w-[18px] items-center justify-center rounded-full">
            <img src="/images/sign.svg" alt="提醒" class="h-6 w-6" />
          </NuxtLink>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[3fr_1fr]">
        <!-- 左側主內容 -->
        <main class="space-y-8">
          <!-- 最新公告 -->
          <section class="space-y-4">
            <div class="space-y-1">
              <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
                最新公告
              </BaseTypography>
              <BaseTypography variant="subtitle" tag="p" class="font-primary color-subtitle">
                最新的課程通知、講座活動、遊學團都在這裡！
              </BaseTypography>
            </div>
            <div class="space-y-1">
              <BaseCarousel :items="carouselItems" :autoplay="true" :interval="6000" />
            </div>
          </section>

          <!-- 下方雙欄：反轉學習 / 聚樂部課表 -->
          <section class="grid gap-4 lg:grid-cols-2">
            <!-- 反轉學習 -->
            <div class="grid grid-rows-[auto_auto_1fr] gap-2">
              <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
                反轉學習
              </BaseTypography>
              <BaseTypography variant="subtitle" tag="p" class="font-primary text-subtitle">
                你的最佳外語學習機制，用對學習方式，事半功倍！
              </BaseTypography>

              <!-- 卡片容器會填滿剩餘空間 -->
              <div class="space-y-3">
                <LearningFrequencyCard
                  :value="('-' as FrequencyCardValue)"
                  :info-number="('-' as FrequencyCardValue)"
                  :progress-color="'#A89A8D'"
                  :show-info-icon="true"
                  :show-arrow="true"
                />
                <CircleStatsGroup :items="statsItems" />
              </div>
            </div>

            <!-- 聚樂部課表 -->
            <div class="grid grid-rows-[auto_auto_1fr] gap-2">
              <div class="flex items-center justify-between">
                <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
                  聚樂部課程
                </BaseTypography>
                <NuxtLink
                  to="/club"
                  class="flex items-center gap-10 px-4 py-2 border-[1.5px] border-brown-1 rounded-[12px] text-brown-1 text-button-s font-semibold hover:bg-brown-9/30 transition-colors"
                >
                  <span class="font-extrabold">聚樂部</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </NuxtLink>
              </div>

              <BaseTypography variant="subtitle" tag="p" class="font-primary text-subtitle">
                聚樂部課程，選課後上課，學習很簡單
              </BaseTypography>

              <!-- 課程卡片會填滿剩餘空間 -->
              <div class="space-y-3">
                <CourseCardSimple
                  v-for="course in courses"
                  :key="course.title"
                  v-bind="course"
                />
              </div>
            </div>
          </section>
        </main>

        <!-- 右側：行事曆與快捷 -->
        <aside class="space-y-3">
          <div class="space-y-2">
            <BaseTypography variant="h1" tag="h1" class="font-secondary text-brown-1">
              行事曆
            </BaseTypography>
            <BaseTypography variant="subtitle" tag="p" class="font-primary text-brown-4">
              綁定自己的行事曆，讓你精準掌握學習行程！
            </BaseTypography>
          </div>
          
           <!-- 置中日曆 -->
          <div class="flex justify-center w-full">
            <BaseCalendar />
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <BaseButton variant="primary" :disabled="true" size="small" class="bg-white">
              諮商預約
            </BaseButton>
            <BaseButton variant="secondary" :disabled="true" size="small" class="bg-white">
              聚樂部選課
            </BaseButton>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CircleStatsGroup from '@/components/CircleStatsGroup.vue'
import CourseCardSimple from '@/components/CourseCardSimple.vue'
import BaseSearchInput from '@/components/BaseSearchInput.vue'
import BaseCarousel from '@/components/BaseCarousel.vue'

interface CarouselItem {
  id: number
  image: string
  alt: string
}

type FrequencyCardValue = number | string

const searchQuery = ref('')

// 搜尋處理函數
const handleSearch = (query: string) => {
  console.log('執行搜尋:', query)
  // 這裡可以導航到搜尋結果頁面
  // navigateTo(`/search?q=${encodeURIComponent(query)}`)
}

const statsItems = [
  { value: '-', label: '-', color: '#6B3F2E', maxValue: 100 },
  { value: '-', label: '-', color: '#D95847', maxValue: 100 },
  { value: '-', label: '-', color: '#F2A74B', maxValue: 100 },
  { value: '-', label: '-', color: '#3E7871', maxValue: 100 }
]

const courses = [
  {
    title: 'N5文法',
    status: '進行中',
    tags: ['N5', '文法', '聽力'],
    progress: 65,
    timeInfo: '上午10:00 - 中午12:30'
  },
  {
    title: '日文主題發表',
    status: '今天',
    tags: ['N3', '口說', '應對'],
    progress: 45,
    timeInfo: '晚上09:00 - 晚上10:30'
  }
]

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
</script>
