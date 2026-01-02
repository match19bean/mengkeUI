<template>
  <div class="bg-cream rounded-[24px] overflow-hidden w-[256px] shadow-card">
    <!-- 課程圖片 -->
    <div class="mx-4 mt-[17px] bg-brown-8 rounded-[24px] overflow-hidden h-[160px]" style="box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);">
      <img v-if="image" :src="image" :alt="title" class="w-full h-full object-contain" />
      <img v-else src="/images/default-course.png" alt="預設課程圖片" class="w-full h-full object-contain" />
    </div>

    <!-- 課程內容 -->
    <div class="pt-[17px] pr-4 pb-[17px] pl-4 space-y-2">
      <!-- 標題和狀態標籤 -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-base font-bold text-brown-1 flex-1">{{ title }}</h3>
        <span 
          v-if="status"
          :class="statusClasses"
          :style="statusStyle"
          class="w-[112px] h-[22px] rounded-[24px] text-xs font-semibold whitespace-nowrap flex items-center justify-center"
        >
          {{ status }}
        </span>
      </div>

      <!-- 標籤列表 -->
      <div v-if="tags && tags.length" class="flex flex-wrap gap-1">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2.5 py-1 border border-brown-1 rounded-full text-xs font-medium text-brown-1"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 進度條 -->
      <div v-if="showProgress" class="space-y-1">
        <div class="h-1.5 bg-brown-9 rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary-2 rounded-full transition-all duration-300"
            :style="{ width: `${computedProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- 時間資訊 -->
      <div v-if="timeInfo" class="flex items-center gap-2 text-brown-1">       
        <span class="text-[10px] font-black leading-[22px] tracking-[2px]">{{ displayTimeInfo }}</span>
        <button 
          @click="$emit('toggle-bookmark')"
          class="ml-auto p-1 transition-colors"
        >
          <svg v-if="bookmarked" width="12" height="15" viewBox="0 0 12 15" fill="currentColor" class="text-brown-1">
            <path d="M0.75 11.1375V5.75989C0.75 3.39821 0.75 2.21736 1.48223 1.48368C2.21447 0.75 3.39298 0.75 5.75 0.75C8.10702 0.75 9.28553 0.75 10.0178 1.48368C10.75 2.21736 10.75 3.39821 10.75 5.75989V11.1375C10.75 12.6363 10.75 13.3857 10.267 13.654C9.33158 14.1734 7.577 12.4404 6.74375 11.9186C6.2605 11.6159 6.01887 11.4646 5.75 11.4646C5.48113 11.4646 5.2395 11.6159 4.75625 11.9186C3.923 12.4404 2.16842 14.1734 1.23303 13.654C0.75 13.3857 0.75 12.6363 0.75 11.1375Z"/>
          </svg>
          <svg v-else width="12" height="15" viewBox="0 0 12 15" fill="none" class="text-brown-1">
            <path d="M0.75 11.1375V5.75989C0.75 3.39821 0.75 2.21736 1.48223 1.48368C2.21447 0.75 3.39298 0.75 5.75 0.75C8.10702 0.75 9.28553 0.75 10.0178 1.48368C10.75 2.21736 10.75 3.39821 10.75 5.75989V11.1375C10.75 12.6363 10.75 13.3857 10.267 13.654C9.33158 14.1734 7.577 12.4404 6.74375 11.9186C6.2605 11.6159 6.01887 11.4646 5.75 11.4646C5.48113 11.4646 5.2395 11.6159 4.75625 11.9186C3.923 12.4404 2.16842 14.1734 1.23303 13.654C0.75 13.3857 0.75 12.6363 0.75 11.1375Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 按鈕區 -->
      <div class="grid grid-cols-2 gap-2.5 pt-2">
        <BaseButton 
          variant="outline" 
          size="medium"
          class="!rounded-[12px] !pt-[9px] !pb-[9px] !bg-brown-1/50 !text-cream !border-transparent"
          @click="$emit('view-detail')"
        >
          課程頁面
        </BaseButton>
        <BaseButton 
          variant="primary" 
          size="medium"
          :disabled="!canEnterCourse"
          @click="$emit('enter-course')"
        >
          {{ enterButtonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  title: string
  image?: string
  status?: string
  statusType?: 'ongoing' | 'today' | 'other'
  tags?: string[]
  progress?: number
  showProgress?: boolean
  timeInfo?: string
  bookmarked?: boolean
  canEnterCourse?: boolean
  enterButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  showProgress: false,
  bookmarked: false,
  canEnterCourse: true,
  enterButtonText: '進入課堂',
  tags: () => []
})

defineEmits<{
  'view-detail': []
  'enter-course': []
  'toggle-bookmark': []
}>()

const statusClasses = computed(() => {
  switch (props.statusType) {
    case 'ongoing':
      return 'text-white'
    case 'today':
      return 'text-white'
    case 'other':
      return 'text-white'
    default:
      return 'text-white'
  }
})

const statusStyle = computed(() => {
  switch (props.statusType) {
    case 'ongoing':
      return { backgroundColor: '#EE7959' }
    case 'today':
      return { backgroundColor: '#597AEE' }
    case 'other':
      return { backgroundColor: '#362010' }
    default:
      return { backgroundColor: '#362010' }
  }
})

function parseTimeRange(timeInfo: string) {
  // 僅支援 24 小時制格式：09:00 - 21:00
  const match = timeInfo.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  let [ , startHourStr, startMinuteStr, endHourStr, endMinuteStr ] = match
  if (
    startHourStr === undefined || startMinuteStr === undefined ||
    endHourStr === undefined || endMinuteStr === undefined
  ) return null
  let startHour = Number(startHourStr)
  let endHour = Number(endHourStr)
  let startMinute = Number(startMinuteStr)
  let endMinute = Number(endMinuteStr)
  return {
    start: startHour * 60 + startMinute,
    end: endHour * 60 + endMinute
  }
}

function getCurrentMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function formatTimeDisplay(timeInfo: string) {
  const match = timeInfo.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) return timeInfo
  
  const [, startHourStr, startMinuteStr, endHourStr, endMinuteStr] = match
  if (!startHourStr || !startMinuteStr || !endHourStr || !endMinuteStr) return timeInfo
  
  const startHour = Number(startHourStr)
  const endHour = Number(endHourStr)
  
  const getPeriod = (hour: number) => {
    if (hour >= 0 && hour < 6) return '凌晨'
    if (hour >= 6 && hour < 12) return '上午'
    if (hour === 12) return '中午'
    if (hour > 12 && hour < 18) return '下午'
    return '晚上'
  }
  
  const formatTime = (hour: number, minute: string) => {
    const period = getPeriod(hour)
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${period}${displayHour}:${minute}`
  }
  
  return `${formatTime(startHour, startMinuteStr)} - ${formatTime(endHour, endMinuteStr)}`
}

const displayTimeInfo = computed(() => {
  return props.timeInfo ? formatTimeDisplay(props.timeInfo) : ''
})

const progressTick = ref(Date.now())

onMounted(() => {
  const timer = setInterval(() => {
    progressTick.value = Date.now()
  }, 60000)
  // 立即刷新一次
  progressTick.value = Date.now()
  onUnmounted(() => clearInterval(timer))
})

const computedProgress = computed(() => {
  progressTick.value // 依賴刷新
  if (!props.timeInfo) return props.progress
  const range = parseTimeRange(props.timeInfo)
  if (!range) return props.progress
  const now = getCurrentMinutes()
  if (typeof range.start !== 'number' || typeof range.end !== 'number') return props.progress
  if (now < range.start) return 0
  if (now > range.end) return 100
  return Math.round(((now - range.start) / (range.end - range.start)) * 100)
})
</script>
