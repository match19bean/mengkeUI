<template>
  <div class="relative inline-block w-full" ref="datePickerRef">
    <div
      :class="selectClasses"
      @click="togglePicker"
    >
      <span :class="displayTextClasses">{{ displayValue }}</span>
      <svg
        class="text-brown-6"
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M3 7h10M6 3v2M10 3v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    
    <div v-if="isOpen" class="absolute top-full mt-2 left-0 bg-[#F8F7F0] rounded-2xl shadow-lg z-50 p-4 w-[320px]">
      <!-- 年月選擇 -->
      <div class="flex items-center justify-between mb-4 gap-2">
        <button @click="previousMonth" type="button" class="p-1 hover:bg-[#36201019] rounded-lg transition-colors flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 flex-1">
          <!-- 年份選擇 -->
          <div class="relative flex-1" ref="yearDropdownRef">
            <div
              @click="toggleYearDropdown"
              class="h-[28px] px-2 text-xs font-black text-[#36201080] bg-[#36201019] rounded-full border-0 cursor-pointer tracking-[2px] text-center flex items-center justify-center"
              @mousedown.stop
            >
              {{ selectedYear }}年
            </div>
            <div v-if="isYearOpen" class="absolute top-full mt-1 left-0 right-0 bg-[#F8F7F0] rounded-2xl shadow-lg max-h-40 overflow-y-auto z-50 py-2" @mousedown.stop>
              <div
                v-for="y in years"
                :key="y"
                @mousedown.prevent="selectYear(y)"
                class="px-4 py-2 text-xs text-center tracking-[2px] cursor-pointer hover:bg-[#36201019] transition-colors"
                :class="y === selectedYear ? 'text-brown-1 font-black' : 'text-brown-5'"
              >
                {{ y }}年
              </div>
            </div>
          </div>
          
          <!-- 月份選擇 -->
          <div class="relative flex-1" ref="monthDropdownRef">
            <div
              @click="toggleMonthDropdown"
              class="h-[28px] px-2 text-xs font-black text-[#36201080] bg-[#36201019] rounded-full border-0 cursor-pointer tracking-[2px] text-center flex items-center justify-center"
              @mousedown.stop
            >
              {{ selectedMonth }}月
            </div>
            <div v-if="isMonthOpen" class="absolute top-full mt-1 left-0 right-0 bg-[#F8F7F0] rounded-2xl shadow-lg max-h-40 overflow-y-auto z-50 py-2" @mousedown.stop>
              <div
                v-for="m in 12"
                :key="m"
                @mousedown.prevent="selectMonth(m)"
                class="px-4 py-2 text-xs text-center tracking-[2px] cursor-pointer hover:bg-[#36201019] transition-colors"
                :class="m === selectedMonth ? 'text-brown-1 font-black' : 'text-brown-5'"
              >
                {{ m }}月
              </div>
            </div>
          </div>
        </div>
        <button @click="nextMonth" type="button" class="p-1 hover:bg-[#36201019] rounded-lg transition-colors flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="text-brown-5">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 星期標題 -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" 
             class="text-center text-[10px] text-brown-5 font-black tracking-[2px]">
          {{ day }}
        </div>
      </div>

      <!-- 日期網格 -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          type="button"
          :disabled="!day.isCurrentMonth"
          @click="selectDate(day)"
          :class="[
            'h-8 rounded-lg text-xs font-medium transition-colors',
            day.isCurrentMonth ? 'text-brown-1' : 'text-brown-6 opacity-30',
            day.isSelected ? 'bg-[#36201080] text-white font-black' : 'hover:bg-[#36201019]',
            !day.isCurrentMonth && 'cursor-not-allowed'
          ]"
        >
          {{ day.date }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '請選擇日期',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const isYearOpen = ref(false)
const isMonthOpen = ref(false)
const datePickerRef = ref<HTMLElement | null>(null)
const yearDropdownRef = ref<HTMLElement | null>(null)
const monthDropdownRef = ref<HTMLElement | null>(null)

// 初始化年月
const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)

// 如果有初始值，解析它
if (props.modelValue) {
  const date = new Date(props.modelValue)
  if (!isNaN(date.getTime())) {
    selectedYear.value = date.getFullYear()
    selectedMonth.value = date.getMonth() + 1
  }
}

// 年份選項（往前100年）
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearList = []
  for (let i = 0; i < 100; i++) {
    yearList.push(currentYear - i)
  }
  return yearList
})

const displayValue = computed(() => {
  return props.modelValue || props.placeholder
})

const displayTextClasses = computed(() => {
  const hasValue = !!props.modelValue
  return hasValue ? 'text-xs text-brown-1 tracking-[2px]' : 'text-xs text-[#36201080] font-black tracking-[2px]'
})

const selectClasses = computed(() => {
  const baseClasses = 'flex items-center justify-between h-[32px] px-4 bg-[#36201019] rounded-[32px] cursor-pointer transition-all duration-250'
  const normalClasses = 'hover:bg-[#36201026] border-0'
  const openClasses = 'bg-[#36201026] border-0'
  const errorClasses = 'border border-alert-1'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60 border-0'
  
  return [
    baseClasses,
    props.disabled ? disabledClasses : props.error ? errorClasses : (isOpen.value ? openClasses : normalClasses)
  ].filter(Boolean).join(' ')
})

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isSelected: boolean
  fullDate: string
}

const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  
  // 當月第一天是星期幾
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 當月有幾天
  const daysInMonth = new Date(year, month, 0).getDate()
  // 上個月有幾天
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
  
  const days: CalendarDay[] = []
  
  // 上個月的日期
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i
    const fullDate = `${year}-${String(month - 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    days.push({
      date,
      isCurrentMonth: false,
      isSelected: props.modelValue === fullDate,
      fullDate
    })
  }
  
  // 當月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      date: i,
      isCurrentMonth: true,
      isSelected: props.modelValue === fullDate,
      fullDate
    })
  }
  
  // 下個月的日期（補足42格）
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      date: i,
      isCurrentMonth: false,
      isSelected: props.modelValue === fullDate,
      fullDate
    })
  }
  
  return days
})

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectDate = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return
  emit('update:modelValue', day.fullDate)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (datePickerRef.value && !datePickerRef.value.contains(target)) {
    isOpen.value = false
  }
}

const previousMonth = () => {
  selectedMonth.value--
  if (selectedMonth.value < 1) {
    selectedMonth.value = 12
    selectedYear.value--
  }
}

const nextMonth = () => {
  selectedMonth.value++
  if (selectedMonth.value > 12) {
    selectedMonth.value = 1
    selectedYear.value++
  }
}

const toggleYearDropdown = () => {
  isYearOpen.value = !isYearOpen.value
  isMonthOpen.value = false
}

const toggleMonthDropdown = () => {
  isMonthOpen.value = !isMonthOpen.value
  isYearOpen.value = false
}

const selectYear = (year: number) => {
  selectedYear.value = year
  isYearOpen.value = false
}

const selectMonth = (month: number) => {
  selectedMonth.value = month
  isMonthOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
