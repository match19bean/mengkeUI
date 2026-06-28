<template>
  <div class="flex h-full flex-col overflow-hidden bg-cream">

    <!-- 頂部搜尋列 -->
    <div class="flex shrink-0 items-center gap-4 border-b border-brown-8/40 px-8 py-4">
      <div class="relative flex h-[44px] max-w-[440px] flex-1 items-center rounded-full border border-brown-8 bg-white/80 px-4">
        <svg class="mr-2 h-4 w-4 shrink-0 text-brown-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋課程、學員等等"
          class="flex-1 bg-transparent text-sm text-brown-2 outline-none placeholder:text-brown-6"
        />
      </div>
      <div class="ml-auto flex items-center gap-3">
        <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-brown-9">
          <img src="/images/bell.svg" alt="通知" class="h-5 w-5" />
        </button>
        <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-brown-9" @click="handleLogout">
          <img src="/images/sign.svg" alt="登出" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- 主體 -->
    <div class="flex min-h-0 flex-1 overflow-hidden">

      <!-- 左欄 -->
      <div class="flex min-w-0 flex-1 flex-col overflow-hidden px-8 py-5">

        <!-- 公告標題 + 行動按鈕 -->
        <div class="mb-5 flex items-start gap-4">
          <div class="min-w-0 flex-1">
            <h1 class="font-genyogothic text-2xl font-black leading-tight text-brown-1">最新公告</h1>
            <p class="mt-1 text-xs leading-relaxed text-brown-5">反轉負責學員、聚樂部課程參與度、教學滿意度現狀與教學評比。</p>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            <button type="button" class="flex items-center gap-2 rounded-xl bg-brown-1 px-4 py-2.5 text-sm font-bold text-cream transition hover:opacity-85">
              新增學員
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button type="button" class="flex items-center gap-2 rounded-xl border border-brown-7 bg-cream px-4 py-2.5 text-sm font-bold text-brown-2 transition hover:bg-brown-9">
              我的學員
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 統計面板 -->
        <div class="mb-5 flex overflow-hidden rounded-2xl bg-brown-1 text-cream">
          <!-- 學員數 + 進度條 -->
          <div class="flex-1 p-5">
            <div class="mb-3 flex items-end gap-3">
              <div>
                <div class="mb-0.5 text-[10px] text-cream/60">學員數</div>
                <div class="flex items-baseline gap-1">
                  <span class="font-genyogothic text-3xl font-black">51</span>
                  <span class="text-sm text-cream/50">/ 80</span>
                </div>
              </div>
              <div class="mb-1 text-[11px] text-cream/60">距進階考核尚缺 <span class="font-bold text-cream">29</span> 人</div>
            </div>
            <div class="mb-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div class="h-full rounded-full bg-primary-1" style="width: 64%" />
            </div>
            <div class="space-y-2.5">
              <div v-for="m in statsMetrics" :key="m.label">
                <div class="mb-1 flex justify-between text-[11px]">
                  <span class="text-cream/70">{{ m.label }}</span>
                  <span class="text-cream/50">{{ m.current }} / {{ m.total }}</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div class="h-full rounded-full bg-cream/60" :style="`width: ${Math.round(m.current / m.total * 100)}%`" />
                </div>
              </div>
            </div>
          </div>

          <div class="w-[1px] bg-white/10" />

          <!-- 教學指標 -->
          <div class="w-[180px] shrink-0 space-y-4 p-5">
            <div v-for="s in satisfactionMetrics" :key="s.label">
              <div class="mb-1.5 flex justify-between text-[11px]">
                <span class="text-cream/70">{{ s.label }}</span>
                <span class="font-bold text-cream">{{ s.value }}{{ s.unit }}</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div class="h-full rounded-full bg-secondary-2" :style="`width: ${s.percent}%`" />
              </div>
            </div>
          </div>

          <div class="w-[1px] bg-white/10" />

          <!-- 教學評比 -->
          <div class="flex w-[160px] shrink-0 flex-col items-center justify-center gap-3 p-5">
            <div class="text-[11px] text-cream/60">上期教學評比</div>
            <div class="flex h-[80px] w-[80px] items-center justify-center rounded-full border-2 border-cream/25 bg-white/5">
              <span class="font-genyogothic text-4xl font-black text-cream">S</span>
            </div>
          </div>
        </div>

        <!-- 篩選 Tabs -->
        <div class="mb-4 flex border-b border-brown-8/60">
          <button
            v-for="tab in filterTabs"
            :key="tab.label"
            type="button"
            class="relative flex items-center gap-1.5 px-4 py-2 text-sm transition"
            :class="activeTab === tab.label
              ? 'font-bold text-brown-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-brown-1 after:content-[\'\']'
              : 'text-brown-5 hover:text-brown-3'"
            @click="activeTab = tab.label"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="rounded-full bg-brown-9 px-1.5 py-0.5 text-[10px] font-bold text-brown-4">{{ tab.count }}</span>
          </button>
        </div>

        <!-- 學員列表 -->
        <div class="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="flex items-center gap-0 border-b border-brown-8/30 py-3.5 last:border-b-0"
          >
            <!-- 學員狀態 -->
            <div class="w-[68px] shrink-0 text-center">
              <span
                class="inline-block whitespace-pre-line rounded-lg px-1.5 py-1 text-center text-[10px] font-bold leading-tight"
                :class="statusClass(student.status)"
              >{{ student.status }}</span>
            </div>

            <!-- 學員資訊 -->
            <div class="w-[185px] shrink-0 px-3">
              <div class="mb-1.5 flex items-center gap-2">
                <div class="h-6 w-6 shrink-0 rounded-full bg-brown-8" />
                <div>
                  <div class="text-[10px] leading-none text-brown-6">{{ student.studentId }}</div>
                  <div class="mt-0.5 text-sm font-bold leading-tight text-brown-1">{{ student.name }}</div>
                </div>
              </div>
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in student.tags" :key="tag" class="rounded-full bg-brown-9 px-2 py-0.5 text-[10px] text-brown-4">{{ tag }}</span>
              </div>
            </div>

            <!-- 分隔線 -->
            <div class="mx-2 w-[1px] self-stretch bg-brown-8/60" />

            <!-- 任務進度 -->
            <div class="min-w-0 flex-1 px-3">
              <div class="mb-2 flex items-center justify-between gap-2">
                <p class="text-xs leading-tight text-brown-4">
                  {{ student.taskNote }}
                  <span v-if="student.taskHighlight" class="font-bold text-brown-2">{{ student.taskHighlight }}</span>
                  <span v-if="student.taskSuffix"> {{ student.taskSuffix }}</span>
                </p>
                <button
                  v-if="student.actionLabel"
                  type="button"
                  class="shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold transition"
                  :class="actionClass(student.actionType)"
                >
                  {{ student.actionLabel }}
                </button>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-brown-9">
                <div
                  class="h-full rounded-full transition-all"
                  :class="progressColor(student.actionType)"
                  :style="`width: ${student.progress}%`"
                />
              </div>
              <div class="mt-1 flex justify-between text-[10px] text-brown-6">
                <span>{{ student.startDate }}</span>
                <span>{{ student.endDate }}</span>
              </div>
            </div>

            <!-- 回報率 -->
            <div class="ml-3 flex shrink-0 flex-col items-center">
              <div class="relative h-12 w-12">
                <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CDC7BE" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#EE7959" stroke-width="3"
                    stroke-dasharray="100 100"
                    :stroke-dashoffset="100 - student.reportRate"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-brown-2">{{ student.reportRate }}</span>
              </div>
            </div>

            <!-- 跳轉箭頭 -->
            <button type="button" class="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brown-5 transition hover:bg-brown-9 hover:text-brown-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 垂直分隔線 -->
      <div class="w-[1px] shrink-0 opacity-40" style="background: linear-gradient(to bottom, #50201000, #362010 30%, #362010 70%, #50201000);" />

      <!-- 右欄：行程 + 日曆 + 時間軸 -->
      <div class="flex w-[380px] shrink-0 flex-col overflow-y-auto px-6 py-5 [scrollbar-gutter:stable]">

        <!-- 行程標題 -->
        <div class="mb-5">
          <h2 class="font-genyogothic text-xl font-black leading-tight text-brown-1">課程即將開始</h2>
          <p class="mt-0.5 text-xs text-brown-5">精準掌握教學行程！</p>
          <div class="mt-3 flex gap-2">
            <button type="button" class="flex items-center gap-1.5 rounded-xl border border-brown-7 px-3 py-2 text-xs font-bold text-brown-2 transition hover:bg-brown-9">
              綁定Google日曆
            </button>
            <button type="button" class="flex items-center gap-1.5 rounded-xl border border-brown-7 px-3 py-2 text-xs font-bold text-brown-2 transition hover:bg-brown-9">
              預約管理
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-primary-1 text-[10px] font-bold text-cream">3</span>
            </button>
          </div>
        </div>

        <!-- 日曆 -->
        <div class="mb-5 rounded-2xl bg-white p-4 shadow-sm">
          <!-- 月份導航 -->
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm font-bold text-brown-1">{{ calendarYear }}年{{ calendarMonth }}月</span>
            <div class="flex gap-1">
              <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full text-brown-5 transition hover:bg-brown-9" @click="prevMonth">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full text-brown-5 transition hover:bg-brown-9" @click="nextMonth">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
          <!-- 星期標題 -->
          <div class="mb-1 grid grid-cols-7 text-center text-[11px] text-brown-6">
            <span v-for="d in weekDays" :key="d">{{ d }}</span>
          </div>
          <!-- 日期格 -->
          <div class="grid grid-cols-7">
            <button
              v-for="day in calendarDays"
              :key="day.key"
              type="button"
              class="relative flex h-9 w-full items-center justify-center rounded-full text-sm transition"
              :class="[
                day.isCurrentMonth ? 'text-brown-2 hover:bg-brown-9' : 'text-brown-7',
                day.isToday ? '!bg-primary-1 font-bold !text-cream hover:opacity-90' : '',
              ]"
            >
              {{ day.date }}
              <span
                v-if="day.hasEvent && !day.isToday"
                class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-1"
              />
            </button>
          </div>
        </div>

        <!-- 時間軸 -->
        <div class="flex flex-col">
          <div v-for="slot in scheduleSlots" :key="slot.time" class="flex gap-3">
            <div class="w-10 shrink-0 pt-1 text-[11px] text-brown-6">{{ slot.time }}</div>
            <div class="flex-1 border-t border-brown-8/40 pt-1 pb-4">
              <div
                v-for="event in slot.events"
                :key="event.id"
                class="mb-1.5 flex items-center justify-between rounded-xl px-3 py-2"
                :class="event.bgClass"
              >
                <div class="min-w-0 flex-1">
                  <span class="text-xs font-bold text-brown-1">{{ event.studentName }}</span>
                  <span class="mx-1 text-xs text-brown-5">·</span>
                  <span class="text-xs text-brown-4">{{ event.type }}</span>
                </div>
                <div class="ml-2 flex shrink-0 items-center gap-1.5">
                  <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="event.modeClass">{{ event.mode }}</span>
                  <svg class="h-3 w-3 text-brown-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { logout } = useAuth()

const searchQuery = ref('')
const activeTab = ref('全部學員')

const handleLogout = () => {
  logout()
  router.push('/login')
}

// ── 統計面板 ──────────────────────────────────────────────

const statsMetrics = [
  { label: '諮商', current: 45, total: 70 },
  { label: '分析', current: 6, total: 10 },
  { label: '規劃', current: 0, total: 10 },
]

const satisfactionMetrics = [
  { label: '教學回饋', value: '8.4', unit: '', percent: 84 },
  { label: '課程參與度', value: '71', unit: '%', percent: 71 },
  { label: '團隊支援度', value: '92', unit: '%', percent: 92 },
]

// ── 篩選 Tabs ─────────────────────────────────────────────

const filterTabs = [
  { label: '全部學員' },
  { label: '進行中', count: 18 },
  { label: '請假中', count: 2 },
  { label: '新進學員', count: 1 },
  { label: '處方箋', count: 3 },
  { label: '分析書', count: 0 },
]

// ── 學員資料 ──────────────────────────────────────────────

interface Student {
  id: string
  status: string
  studentId: string
  name: string
  tags: string[]
  taskNote: string
  taskHighlight?: string
  taskSuffix?: string
  actionLabel?: string
  actionType: string
  progress: number
  startDate: string
  endDate: string
  reportRate: number
  category: string
}

const students = ref<Student[]>([
  {
    id: '1',
    status: '新進\n學員',
    studentId: '2023010003',
    name: '楊承諭',
    tags: ['反轉養成', '一年期', '日文'],
    taskNote: '需要進行諮商預約',
    taskHighlight: '7',
    taskSuffix: '天內',
    actionLabel: '提醒學員',
    actionType: 'remind',
    progress: 11,
    startDate: '11/22',
    endDate: '11/29',
    reportRate: 0,
    category: '新進學員',
  },
  {
    id: '2',
    status: '等待\n諮商中',
    studentId: '2023070003',
    name: '蔡興誠',
    tags: ['反轉養成', '三階段', '日文'],
    taskNote: '距離諮商預約',
    taskHighlight: '11/23',
    taskSuffix: '尚有 1 天',
    actionLabel: '進行諮商',
    actionType: 'consult',
    progress: 86,
    startDate: '11/17',
    endDate: '11/23',
    reportRate: 0,
    category: '進行中',
  },
  {
    id: '3',
    status: '等待\n處方箋',
    studentId: '2023080003',
    name: '郭阜陽',
    tags: ['反轉目標', '一年期', '日文'],
    taskNote: '需開立處方箋',
    taskHighlight: '7',
    taskSuffix: '天內',
    actionLabel: '開立處方箋',
    actionType: 'prescription',
    progress: 13,
    startDate: '11/22',
    endDate: '11/29',
    reportRate: 87,
    category: '處方箋',
  },
  {
    id: '4',
    status: '學習\n進行中',
    studentId: '2017010001',
    name: '姜小文',
    tags: ['反轉目標', '日檢N1', '日文'],
    taskNote: '本期剩餘',
    taskHighlight: '6',
    taskSuffix: '天',
    actionLabel: '查看學習狀態',
    actionType: 'view',
    progress: 85,
    startDate: '11/01',
    endDate: '11/28',
    reportRate: 62,
    category: '進行中',
  },
  {
    id: '5',
    status: '等待\n分析中',
    studentId: '2020080019',
    name: '林辰漢',
    tags: ['反轉養成', '一年期', '日文'],
    taskNote: '需開立分析書',
    taskHighlight: '1',
    taskSuffix: '天內',
    actionLabel: '執行測驗',
    actionType: 'test',
    progress: 94,
    startDate: '10/27',
    endDate: '11/23',
    reportRate: 32,
    category: '分析書',
  },
  {
    id: '6',
    status: '請假\n休息中',
    studentId: '2023110035',
    name: '王椷陽',
    tags: ['反轉養成', '一年期', '日文'],
    taskNote: '請假剩餘',
    taskHighlight: '3',
    taskSuffix: '天',
    actionLabel: '查看學習狀態',
    actionType: 'view',
    progress: 13,
    startDate: '11/1',
    endDate: '11/28',
    reportRate: 62,
    category: '請假中',
  },
])

const filteredStudents = computed(() => {
  if (activeTab.value === '全部學員') return students.value
  return students.value.filter(s => s.category === activeTab.value)
})

const statusClass = (status: string) => {
  if (status.includes('新進')) return 'bg-brown-8 text-brown-4'
  if (status.includes('諮商')) return 'border border-complementary-2/50 bg-complementary-2/10 text-complementary-2'
  if (status.includes('處方箋')) return 'border border-complementary-1/50 bg-complementary-1/15 text-brown-3'
  if (status.includes('進行中')) return 'border border-secondary-1/50 bg-secondary-1/10 text-secondary-1'
  if (status.includes('分析')) return 'border border-brown-7 bg-brown-9 text-brown-3'
  if (status.includes('休息')) return 'border border-brown-8 bg-brown-9/60 text-brown-5'
  return 'bg-brown-9 text-brown-5'
}

const actionClass = (actionType: string) => {
  if (actionType === 'remind') return 'border-complementary-1/60 bg-complementary-1/15 text-brown-3'
  if (actionType === 'consult') return 'border-secondary-1/50 bg-secondary-1/10 text-secondary-1'
  if (actionType === 'prescription') return 'border-primary-1/50 bg-primary-1/10 text-primary-1'
  if (actionType === 'view') return 'border-complementary-2/50 bg-complementary-2/10 text-complementary-2'
  if (actionType === 'test') return 'border-complementary-1/60 bg-complementary-1/15 text-brown-3'
  return 'border-brown-8 bg-brown-9 text-brown-4'
}

const progressColor = (actionType: string) => {
  if (actionType === 'consult') return 'bg-complementary-2'
  if (actionType === 'prescription') return 'bg-complementary-1'
  if (actionType === 'view') return 'bg-secondary-2'
  if (actionType === 'test') return 'bg-primary-1'
  return 'bg-primary-1'
}

// ── 日曆 ──────────────────────────────────────────────────

const today = new Date()
const calendarYear = ref(today.getFullYear())
const calendarMonth = ref(today.getMonth() + 1)

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const eventDates = [17, 22, 23, 28]

const prevMonth = () => {
  if (calendarMonth.value === 1) { calendarMonth.value = 12; calendarYear.value-- }
  else calendarMonth.value--
}

const nextMonth = () => {
  if (calendarMonth.value === 12) { calendarMonth.value = 1; calendarYear.value++ }
  else calendarMonth.value++
}

const calendarDays = computed(() => {
  const year = calendarYear.value
  const month = calendarMonth.value
  const firstDow = new Date(year, month - 1, 1).getDay() // 0=Sun
  const startPad = firstDow === 0 ? 6 : firstDow - 1    // Mon-first
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrev = new Date(year, month - 1, 0).getDate()

  const days = []

  for (let i = startPad - 1; i >= 0; i--) {
    days.push({ key: `p${i}`, date: daysInPrev - i, isCurrentMonth: false, isToday: false, hasEvent: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear()
    days.push({ key: `c${d}`, date: d, isCurrentMonth: true, isToday, hasEvent: eventDates.includes(d) })
  }
  const fill = 42 - days.length
  for (let d = 1; d <= fill; d++) {
    days.push({ key: `n${d}`, date: d, isCurrentMonth: false, isToday: false, hasEvent: false })
  }
  return days
})

// ── 時間軸 ────────────────────────────────────────────────

const scheduleSlots = [
  { time: '10:00', events: [] },
  {
    time: '11:00',
    events: [
      { id: 'e1', studentName: '姜小文', type: '學習諮商', mode: '線上', bgClass: 'bg-secondary-1/10', modeClass: 'bg-secondary-1/20 text-secondary-1' },
    ],
  },
  {
    time: '12:00',
    events: [
      { id: 'e2', studentName: '郭阜陽', type: '快朗', mode: '現場', bgClass: 'bg-primary-1/10', modeClass: 'bg-primary-1/20 text-primary-1' },
    ],
  },
  { time: '13:00', events: [] },
  {
    time: '14:00',
    events: [
      { id: 'e3', studentName: '聚樂部', type: 'N5綜合養成', mode: '線上', bgClass: 'bg-complementary-1/15', modeClass: 'bg-complementary-1/25 text-brown-3' },
    ],
  },
  { time: '15:00', events: [] },
  { time: '16:00', events: [] },
  {
    time: '17:00',
    events: [
      { id: 'e4', studentName: '林辰漢', type: '學習諮商', mode: '現場', bgClass: 'bg-primary-1/10', modeClass: 'bg-primary-1/20 text-primary-1' },
    ],
  },
  { time: '18:00', events: [] },
]
</script>
