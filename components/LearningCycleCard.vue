<template>
  <div class="w-full min-w-[340px] max-w-[430px] space-y-4">
    <div class="rounded-[32px] bg-[#4b2408] px-8 py-7 text-white shadow-lg">
      <!-- 標題 -->
      <h2 class="mb-8 text-[24px] font-extrabold tracking-wide">
        {{ title }}
      </h2>

      <!-- 中間內容 -->
      <div class="mb-8 flex items-center gap-6">
        <!-- 圓環 -->
        <div class="relative h-[110px] w-[110px] shrink-0">
          <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">
            <!-- 底圈 -->
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#f0ede7"
              stroke-width="14"
              stroke-linecap="round"
            />

            <!-- 進度圈 -->
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#f8c344"
              stroke-width="14"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
            />
          </svg>

          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[24px] font-extrabold text-white">
              {{ score }}
            </span>
          </div>
        </div>

        <!-- 右側資訊 -->
        <div class="flex min-w-0  flex-1 flex-col">
          <div class="mb-4">
            <div
              class="inline-flex items-center gap-6 rounded-full bg-[#f4f0ea] px-4 py-2 text-[16px] font-extrabold text-[#4b2408]"
            >
              <span>{{ displayPhaseLabel }}</span>
              <span
                class="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#4b2408] text-[16px] leading-none font-extrabold text-white"
              >
                {{ phaseNumber }}
              </span>
            </div>
          </div>

          <div class="text-[18px] font-extrabold tracking-wide text-white">
            {{ displayStatusText }}
          </div>
        </div>
      </div>

      <!-- 剩餘天數 -->
      <div class="mb-2 flex items-end justify-end gap-2">
        <span class="text-[10px] font-bold text-white/90">剩餘</span>
        <span class="text-[32px] font-extrabold leading-none text-white">
          {{ remainingDays }}
        </span>
        <span class="pb-1 text-[10px] font-bold text-white/90">天</span>
      </div>

      <!-- 進度條 -->
      <div class="mb-2">
        <div class="h-[16px] w-full overflow-hidden rounded-full bg-[#d9d0c8]/70">
          <div
            class="h-full rounded-full bg-[#f4f0ea]"
            :style="{ width: `${safeProgress}%` }"
          />
        </div>
      </div>

      <!-- 日期 -->
      <div class="flex items-center justify-between text-[10px] font-medium tracking-wide text-white">
        <span>{{ startDate }}</span>
        <span>{{ endDate }}</span>
      </div>
    </div>

    <div
      class="grid gap-3"
      :class="actionButtons.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
    >
      <BaseButton
        v-for="button in actionButtons"
        :key="button.key"
        variant="outline"
        size="medium"
        :class="button.className"
        @click="handleActionClick(button)"
      >
        <span>{{ button.label }}</span>
        <img
          v-if="button.iconSrc"
          :src="button.iconSrc"
          :alt="button.iconAlt"
          width="14"
          height="14"
          class="h-[14px] w-[14px] flex-shrink-0"
        />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type LearningCycleState = 'waiting-test-start' | 'taking-test' | 'waiting-analysis' | 'booking-consultation'
type LearningCycleScenario = '等待測驗開始' | '請進行測驗' | '等待分析結束' | '請進行諮商預約'

interface CycleStateConfig {
  phaseLabel: string
  statusText: string
  label: string
  disabled: boolean
  className: string
}

interface ActionButtonConfig {
  key: string
  label: string
  className: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  targetState: LearningCycleState
}

const props = withDefaults(
  defineProps<{
    title?: string
    score?: number
    maxScore?: number
    phaseLabel?: string
    phaseNumber?: number | string
    statusText?: string
    cycleState?: LearningCycleState
    scenarioStatus?: LearningCycleScenario
    remainingDays?: number
    progress?: number
    startDate?: string
    endDate?: string
  }>(),
  {
    title: '學習週期',
    score: 62,
    maxScore: 100,
    phaseNumber: 1,
    cycleState: 'waiting-test-start',
    remainingDays: 6,
    progress: 85,
    startDate: '11/1',
    endDate: '11/28'
  }
)

const scenarioToCycleStateMap: Record<LearningCycleScenario, LearningCycleState> = {
  '等待測驗開始': 'waiting-test-start',
  '請進行測驗': 'taking-test',
  '等待分析結束': 'waiting-analysis',
  '請進行諮商預約': 'booking-consultation'
}

const cycleStateMap: Record<LearningCycleState, CycleStateConfig> = {
  'waiting-test-start': {
    phaseLabel: '待進行測驗',
    statusText: '等待測驗開始',
    label: '測驗尚未開啟',
    disabled: true,
    className: '!w-full !bg-brown-9 !text-white/60 !border-transparent disabled:!cursor-not-allowed'
  },
  'taking-test': {
    phaseLabel: '待進行測驗',
    statusText: '請進行測驗',
    label: '進行測驗',
    disabled: false,
    className: '!w-full !bg-primary-2 !text-cream !border-transparent'
  },
  'waiting-analysis': {
    phaseLabel: '分析進行中',
    statusText: '等待分析結束',
    label: '本期分析中',
    disabled: true,
    className: '!w-full !bg-brown-9 !text-white/60 !border-transparent disabled:!cursor-not-allowed'
  },
  'booking-consultation': {
    phaseLabel: '分析結束',
    statusText: '請進行諮商預約',
    label: '諮商預約',
    disabled: false,
    className: '!w-full !bg-alert-1 !text-cream !border-transparent'
  }
}

const resolvedCycleState = computed<LearningCycleState>(() => {
  if (props.scenarioStatus) {
    return scenarioToCycleStateMap[props.scenarioStatus]
  }

  return props.cycleState
})

const actionState = computed(() => cycleStateMap[resolvedCycleState.value])

const actionButtons = computed<ActionButtonConfig[]>(() => {
  switch (resolvedCycleState.value) {
    case 'waiting-test-start':
      return [
        {
          key: 'test-not-open',
          label: '測驗尚未開始',
          className: '!w-full !bg-brown-9 !text-white/60 !border-transparent !cursor-not-allowed',
          disabled: true,
          targetState: 'waiting-test-start'
        }
      ]
    case 'taking-test':
      return [
        {
          key: 'go-test',
          label: '進行測驗',
          className: '!w-full !bg-primary-2 !text-cream !border-transparent',
          iconSrc: '/images/gotest.png',
          iconAlt: 'go test',
          targetState: 'taking-test'
        }
      ]
    case 'waiting-analysis':
      return [
        {
          key: 'report-disabled',
          label: '本期分析書',
          className: '!w-full !bg-brown-9 !text-white/60 !border-transparent !cursor-not-allowed',
          iconSrc: '/images/lock.svg',
          iconAlt: 'locked',
          disabled: true,
          targetState: 'waiting-analysis'
        },
        {
          key: 'book-consultation',
          label: '諮商預約',
          className: '!w-full !bg-alert-1 !text-cream !border-transparent',
          iconSrc: '/images/calendar.png',
          iconAlt: 'calendar',
          targetState: 'booking-consultation'
        }
      ]
    case 'booking-consultation':
      return [
        {
          key: 'view-report',
          label: '本期分析書',
          className: '!w-full !bg-primary-2 !text-cream !border-transparent',
          iconSrc: '/images/goreport.png',
          iconAlt: 'go report',
          targetState: 'waiting-analysis'
        },
        {
          key: 'book-consultation',
          label: '諮商預約',
          className: '!w-full !bg-alert-1 !text-cream !border-transparent',
          iconSrc: '/images/calendar.png',
          iconAlt: 'calendar',
          targetState: 'booking-consultation'
        }
      ]
    default:
      return [
        {
          key: 'default',
          label: actionState.value.label,
          className: actionState.value.className,
          disabled: actionState.value.disabled,
          targetState: resolvedCycleState.value
        }
      ]
  }
})

const displayPhaseLabel = computed(() => props.phaseLabel ?? actionState.value.phaseLabel)

const displayStatusText = computed(() => props.statusText ?? actionState.value.statusText)

const safeScore = computed(() =>
  Math.max(0, Math.min(props.score, props.maxScore))
)

const safeProgress = computed(() =>
  Math.max(0, Math.min(props.progress, 100))
)

const radius = 46
const circumference = 2 * Math.PI * radius

const progressOffset = computed(() => {
  const percent = safeScore.value / props.maxScore
  return circumference * (1 - percent)
})

const handleActionClick = (button: ActionButtonConfig) => {
  if (button.disabled)
    return

  if (button.key === 'view-report') {
    return
  }

  const routeByActionKey: Partial<Record<ActionButtonConfig['key'], string>> = {
    'go-test': '/learning-task',
    'book-consultation': '/consultation'
  }

  const targetPath = routeByActionKey[button.key]
  if (!targetPath)
    return

  navigateTo(targetPath)
}
</script>