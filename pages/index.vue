<template>
  <BasePageShell>

      <div class="grid gap-6 2xl:grid-cols-[3fr_1fr]">
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
              <BaseCarousel :items="carouselItems ?? []" :autoplay="true" :interval="6000" />
            </div>
          </section>

          <!-- 下方雙欄：反轉學習 / 聚樂部課表 -->
          <section class="grid gap-4 2xl:grid-cols-2">
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
                <CircleStatsGroup :items="statsItems ?? []" />
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
                  class="w-[135px] flex items-center justify-between px-4 py-2 border-[1.5px] border-brown-1 rounded-[12px] text-brown-1 text-button-s font-semibold hover:bg-brown-9/30 transition-colors"
                >
                  <span class="font-extrabold flex-1 text-center">聚樂部</span>
                  <IconsChevronRight />
                </NuxtLink>
              </div>

              <BaseTypography variant="subtitle" tag="p" class="font-primary text-subtitle">
                聚樂部課程，選課後上課，學習很簡單
              </BaseTypography>

              <!-- 課程卡片會填滿剩餘空間 -->
              <div class="space-y-3">
                <CourseCardSimple
                  v-for="course in (courses ?? [])"
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
  </BasePageShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CircleStatsGroup from '@/components/feature/CircleStatsGroup.vue'
import CourseCardSimple from '@/components/feature/CourseCardSimple.vue'
import BaseCarousel from '@/components/base/BaseCarousel.vue'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

interface CarouselItem {
  id: number
  image: string
  alt: string
}

type FrequencyCardValue = number | string

const searchQuery = ref('')

const handleSearchSelect = (suggestion: any) => {
  console.log('選擇了:', suggestion)
}

const { data: statsItems } = await useAsyncData('home-stats', () =>
  Promise.resolve([
    { value: '-', label: '-', color: '#6B3F2E', maxValue: 100 },
    { value: '-', label: '-', color: '#D95847', maxValue: 100 },
    { value: '-', label: '-', color: '#F2A74B', maxValue: 100 },
    { value: '-', label: '-', color: '#3E7871', maxValue: 100 }
  ])
)

const { data: courses } = await useAsyncData('home-courses', () =>
  Promise.resolve([
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
  ])
)

const { data: carouselItems } = await useAsyncData('home-carousel', () =>
  Promise.resolve([
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
  ] as CarouselItem[])
)

// 搜尋建議假資料（含 url/type/selectable 欄位）
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
    title: '日文會話不可選',
    url: '/courses/disabled',
    type: '課程',
    badge: '聚樂部',
    badgeColor: 'secondary',
    selectable: false
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
</script>
