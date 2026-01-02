<template>
  <div class="bg-cream rounded-[24px] p-4 shadow-card border border-brown-8 min-w-[340px] max-w-[420px] w-auto h-auto relative flex flex-col">
    <!-- 月份選擇器 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <button @click="toggleMonthPicker" class="flex items-center gap-1 hover:bg-white/60 px-2 py-1 rounded-lg transition-colors">
          <span class="text-base font-semibold text-brown-1">{{ currentYear }}年 {{ currentMonth }}月</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" class="text-brown-5" :class="{ 'rotate-180': showMonthPicker }">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button @click="previousMonth" class="p-1 hover:bg-brown-9 rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button @click="nextMonth" class="p-1 hover:bg-brown-9 rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 遮罩層 -->
    <div v-if="showMonthPicker" @click="showMonthPicker = false" class="fixed inset-0 z-[5]"></div>

    <!-- 月份選擇器下拉 (懸浮) -->
    <div v-if="showMonthPicker" class="absolute top-12 left-4 right-4 z-10 bg-white rounded-lg p-3 border border-brown-8 shadow-xl">
      <div class="flex items-center justify-between gap-1 mb-2 pb-2 border-b border-brown-8">
        <button @click="previousYear" class="p-1 hover:bg-brown-9 rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="text-sm font-semibold text-brown-1">{{ tempYear }}年</span>
        <button @click="nextYear" class="p-1 hover:bg-brown-9 rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="m in 12"
          :key="m"
          @click="selectMonth(m)"
          :class="[
            'py-1.5 px-2 rounded-lg text-xs font-medium transition-colors',
            tempMonth === m ? 'bg-secondary-1 text-white' : 'bg-brown-9 text-brown-1 hover:bg-brown-8'
          ]"
        >
          {{ m }}月
        </button>
      </div>
    </div>

    <!-- 星期標題 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-xs text-brown-5 font-medium py-1">
        {{ day }}
      </div>
    </div>

    <!-- 日期網格 -->
    <div class="grid grid-cols-7 grid-rows-6 gap-3 flex-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="relative"
      >
        <div
          :class="getDayClasses(day)"
          @click="handleDayClick(day)"
        >
          <span v-if="day.date">{{ day.isHoliday ? '休' : day.date }}</span>
        </div>
        <!-- 課程標記點點 -->
        <div v-if="day.hasCourse && day.isCurrentMonth" class="absolute top-0 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div class="w-1 h-1 rounded-full bg-complementary-1"></div>
          <div class="w-1 h-1 rounded-full bg-secondary-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalendarDay {
  date: number | null
  isCurrentMonth: boolean
  isToday: boolean
  isHoliday: boolean
  isSelected: boolean
  hasCourse: boolean
}

interface Props {
  modelValue?: Date
  holidays?: Date[] // 休息日的完整日期陣列
  today?: Date // 當天日期（綠色背景）
  courseDates?: Date[] // 有課程的日期陣列
  readonly?: boolean // 是否為唯讀模式（純顯示）
}

const props = withDefaults(defineProps<Props>(), {
  holidays: () => [],
  today: () => new Date(),
  courseDates: () => [],
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [date: Date]
  'update:holidays': [holidays: number[]]
}>()

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const currentDate = ref(new Date(props.today))
const showMonthPicker = ref(false)
const tempYear = ref(new Date(props.today).getFullYear())
const tempMonth = ref(new Date(props.today).getMonth() + 1)

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 當月第一天
  const firstDay = new Date(year, month, 1)
  // 當月最後一天
  const lastDay = new Date(year, month + 1, 0)
  
  // getDay() 返回 0(日) - 6(六)，轉換為 0(一) - 6(日)
  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  const daysInMonth = lastDay.getDate()
  
  const days: CalendarDay[] = []
  
  // 填充上個月的日期
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isHoliday: false,
      isSelected: false,
      hasCourse: false
    })
  }
  
  // 填充當月日期
  const todayDate = props.today.getDate()
  const todayMonth = props.today.getMonth()
  const todayYear = props.today.getFullYear()
  
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === todayDate && month === todayMonth && year === todayYear
    const isHoliday = props.holidays.some(holiday => {
      return holiday.getDate() === i && 
             holiday.getMonth() === month && 
             holiday.getFullYear() === year
    })
    const hasCourse = props.courseDates.some(courseDate => {
      return courseDate.getDate() === i && 
             courseDate.getMonth() === month && 
             courseDate.getFullYear() === year
    })    
    // 判斷是否為選中的日期
    const isSelected = !!(props.modelValue &&
      props.modelValue.getDate() === i &&
      props.modelValue.getMonth() === month &&
      props.modelValue.getFullYear() === year)
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      isHoliday,
      isSelected,
      hasCourse
    })
  }
  
  // 填充下個月的日期
  const remainingDays = 42 - days.length // 6週 × 7天
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      isHoliday: false,
      isSelected: false,
      hasCourse: false
    })
  }
  
  return days
})

const getDayClasses = (day: CalendarDay) => {
 const baseClasses = 'w-10 h-8 flex items-center justify-center text-xs rounded-full transition-all duration-200 font-medium'
  if (props.readonly) {
    // 全部 cursor-default，移除 cursor-not-allowed
    return `${baseClasses} cursor-default ${!day.date || !day.isCurrentMonth ? 'text-brown-7' : day.isHoliday ? 'text-brown-5' : day.isToday ? 'bg-secondary-1 text-white font-semibold' : 'text-brown-1'}`
  }
  if (!day.date || !day.isCurrentMonth) {
    return `${baseClasses} text-brown-7 cursor-default`
  }
  // 選擇模式：有選中時只顯示選中樣式
  if (day.isSelected) {
    return `${baseClasses} bg-secondary-1 text-white font-semibold cursor-pointer`
  }
  // 只有在沒有選擇任何日期時才顯示 today 樣式
  if (day.isToday && !props.modelValue) {
    return `${baseClasses} bg-secondary-1 text-white font-semibold cursor-pointer hover:bg-secondary-2`
  }
  if (day.isHoliday) {
    return `${baseClasses} text-brown-5 cursor-default`
  }
  return `${baseClasses} text-brown-1 cursor-pointer hover:bg-brown-9`
}

const handleDayClick = (day: CalendarDay) => {
  if (props.readonly) return // 唯讀模式不允許選擇
  if (!day.isCurrentMonth || !day.date || day.isHoliday) return
  
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date)
  emit('update:modelValue', newDate)
}

const toggleMonthPicker = () => {
  if (!showMonthPicker.value) {
    tempYear.value = currentDate.value.getFullYear()
    tempMonth.value = currentDate.value.getMonth() + 1
  }
  showMonthPicker.value = !showMonthPicker.value
}

const selectMonth = (month: number) => {
  tempMonth.value = month
  currentDate.value = new Date(tempYear.value, month - 1, 1)
  showMonthPicker.value = false
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const previousYear = () => {
  tempYear.value -= 1
}

const nextYear = () => {
  tempYear.value += 1
}
</script>
