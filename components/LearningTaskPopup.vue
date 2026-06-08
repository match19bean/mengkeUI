<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] bg-black/40 p-2 backdrop-blur-sm md:p-4 lg:p-6"
      >
        <div class="mx-auto flex h-[95vh] w-full max-w-[1540px] flex-col overflow-hidden rounded-[28px] border border-brown-8 bg-cream shadow-[0_12px_30px_rgba(54,32,16,0.14)]">
          <div class="flex shrink-0 items-center justify-between px-4 pt-4 md:px-6">
            <button
              v-if="currentView === 'recording'"
              type="button"
              class="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-brown-2 transition hover:bg-brown-9"
              @click="currentView = 'detail'"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M10 3L5 8l5 5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              返回
            </button>
            <div v-else />
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full text-brown-2 transition hover:bg-brown-9"
              aria-label="關閉"
              @click="closePopup"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="popup-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-6 lg:px-8 lg:pb-8">
            <template v-if="currentView === 'detail'">
            <section class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
                <div class="h-[160px] w-[268px] rounded-[24px] bg-brown-7/70" />
                <h1 class="font-genyogothic text-[44px] font-black leading-none text-brown-1">{{ taskTitle }}</h1>
              </div>

              <div class="w-full max-w-[230px]">
                <div class="mb-3 flex items-center justify-between gap-3 px-1">
                  <p class="text-right font-genyogothic text-[16px] font-black leading-[22px] tracking-[0px] text-brown-1">任務難度</p>
                  <div class="flex gap-1">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-[25px]"
                      :class="star <= filledTaskStars ? 'text-[#f5c44a]' : 'text-brown-7'"
                    >
                      ★
                    </span>
                  </div>
                </div>

                <div class="rounded-2xl bg-brown-1 p-4 text-cream shadow-lg">
                  <div class="my-5 flex items-end justify-center gap-2 leading-none">
                    <span class="inline-block min-w-[64px] text-right font-genyogothic text-[64px] font-black leading-[40px] tracking-[0px]">{{ taskProgress.current }}</span>
                    <span class="self-end text-[22px] font-black leading-none text-brown-8">/ {{ taskProgress.total }}</span>
                    <span class="self-end text-[13px] font-semibold leading-none text-brown-8">篇</span>
                  </div>

                  <p class="mt-1 text-center text-[12px] font-semibold text-brown-8">{{ taskProgress.label }}</p>

                  <div class="mt-3 h-[7px] w-full overflow-hidden rounded-full bg-brown-8">
                    <div class="h-full rounded-full bg-secondary-1" :style="{ width: `${taskProgress.percent}%` }" />
                  </div>
                </div>
              </div>
            </section>

            <section class="mt-4 grid grid-cols-12 gap-2 md:gap-4">
              <BaseButton variant="secondary" size="small" class="col-span-12 !h-11 !rounded-xl !text-sm md:col-span-8" @click="currentView = 'recording'">
                學習回報
              </BaseButton>
              <BaseButton variant="secondary" size="small" class="col-span-8 !h-11 !rounded-xl !text-sm md:col-span-3" @click="downloadMaterial(taskMaterialUrl, taskTitle + '教材')">
                教材下載
              </BaseButton>
              <button
                type="button"
                class="col-span-4 inline-flex h-11 items-center justify-center gap-1 rounded-xl bg-complementary-1 px-3 text-sm font-black text-cream transition hover:opacity-85 md:col-span-1"
                @click="handleShare"
              >
                分享
                <img src="/images/share.png" alt="分享" class="h-[14px] w-[14px] object-contain" />
              </button>
            </section>

            <section class="mt-6 border-t border-brown-8/70 pt-6">
              <h2 class="font-secondary text-[40px] font-black text-brown-1">目的與效用</h2>
              <p class="mt-3 max-w-[1180px] text-[16px] leading-8 text-brown-3">
                {{ purposeText }}
              </p>
            </section>

            <section class="mt-7 border-t border-brown-8/70 pt-6">
              <div class="mb-4 flex items-center justify-between gap-3">
                <h2 class="font-secondary text-[40px] font-black text-brown-1">操作教學</h2>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-brown-2 px-3 py-1 text-[13px] font-bold text-brown-2 hover:bg-white/60"
                >
                  示範影片
                  <IconsChevronRight :size="14" :stroke-width="2" />
                </button>
              </div>

              <div class="grid gap-4 lg:grid-cols-4">
                <article
                  v-for="item in teachSteps"
                  :key="item.title"
                  class="rounded-xl border border-brown-8/60 bg-white/75 p-4 shadow-sm"
                >
                  <h3 class="text-[30px] font-black text-brown-4">{{ item.title }}</h3>
                  <p class="mt-2 text-[15px] leading-7 text-brown-3">{{ item.content }}</p>
                </article>
              </div>
            </section>

            <section class="mt-7 border-t border-brown-8/70 pt-6">
              <div class="mb-4 flex items-center justify-between gap-3">
                <h2 class="font-secondary text-[40px] font-black text-brown-1">討論區相關文章</h2>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-brown-2 px-3 py-1 text-[13px] font-bold text-brown-2 hover:bg-white/60"
                >
                  前往討論區
                  <IconsChevronRight :size="14" :stroke-width="2" />
                </button>
              </div>

              <BasePaginatedGrid :items="discussionCards" :page-size="2" grid-class="grid gap-4 md:grid-cols-2">
                <template #default="{ item }">
                  <article class="rounded-xl border border-brown-8/70 bg-white/70 p-4">
                    <p class="mb-2 text-xs font-semibold tracking-wide text-brown-6">使用者暱稱 {{ item.date }}</p>
                    <h4 class="line-clamp-1 text-lg font-bold text-brown-1">{{ item.title }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-brown-3">{{ item.summary }}</p>
                  </article>
                </template>
              </BasePaginatedGrid>
            </section>

            <section class="mt-7 border-t border-brown-8/70 pt-6">
              <div class="mb-4 flex items-center justify-between gap-3">
                <h2 class="font-secondary text-[40px] font-black text-brown-1">學習歷程</h2>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-brown-2 px-3 py-1 text-[13px] font-bold text-brown-2 hover:bg-white/60"
                >
                  過往課程列表
                  <IconsChevronRight :size="14" :stroke-width="2" />
                </button>
              </div>

              <article class="rounded-xl border border-brown-8/60 bg-white/75 p-4">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex w-full flex-col gap-2 text-brown-5 lg:flex-1 lg:flex-row lg:items-end lg:justify-between">
                    <div class="flex items-end gap-4 lg:min-w-[260px] lg:justify-start">
                      <p class="text-[30px] font-black">{{ historySummary.title }}</p>
                      <p class="text-[16px] font-semibold">{{ historySummary.date }}</p>
                    </div>
                    <div class="flex w-full flex-wrap items-end gap-3 lg:flex-1 lg:justify-center lg:gap-10">
                      <p class="text-[16px] font-semibold">尋求協助 <span class="text-[45px] font-black leading-none">{{ historySummary.helpCount }}</span> 次</p>
                      <p class="text-[16px] font-semibold">嘗試次數 <span class="text-[45px] font-black leading-none">{{ historySummary.attemptCount }}</span> 次</p>
                      <p class="text-[16px] font-semibold">快朗秒數 <span class="font-genyogothic text-[60px] font-black leading-none">{{ historySummary.seconds }}</span> 秒</p>
                    </div>
                  </div>

                  <div class="flex shrink-0 gap-4">
                    <BaseButton variant="brown-soft" size="small" class="!h-11 !rounded-xl !px-14 !text-sm">音檔回放</BaseButton>
                    <BaseButton variant="brown-soft" size="small" class="!h-11 !rounded-xl !px-14 !text-sm" @click="downloadMaterial(taskMaterialUrl, historySummary.title + '教材')">教材下載</BaseButton>
                  </div>
                </div>
              </article>
            </section>
            </template>

            <template v-else>
              <h1 class="mt-4 font-genyogothic text-[32px] font-black text-brown-1">任務列表</h1>

              <div class="mt-4 space-y-2">
                <div v-for="(practice, index) in practiceSessions" :key="practice.id">
                  <div
                    class="flex items-center gap-3 rounded-2xl border border-brown-8/60 bg-white/75 px-5 py-4"
                    :class="{ 'rounded-b-none border-b-0': expandedPracticeId === practice.id }"
                  >
                    <span class="w-5 shrink-0 text-sm font-semibold text-brown-4">{{ index + 1 }}.</span>

                    <div class="flex min-w-0 flex-1 items-center gap-3">
                      <span class="text-[17px] font-bold text-brown-5">{{ practice.articleTitle }}</span>
                      <span class="text-sm text-brown-5">{{ practice.date }}</span>
                      <span class="text-sm text-brown-5">{{ practice.time }}</span>
                    </div>

                    <div class="flex shrink-0 items-end gap-1">
                      <span class="text-[13px] font-semibold text-brown-4">限制時數</span>
                      <span class="font-genyogothic text-[36px] font-black leading-none text-brown-1">{{ practice.limitSeconds }}</span>
                      <span class="mb-0.5 text-[13px] font-semibold text-brown-4">秒</span>
                    </div>

                    <button
                      v-if="recordingPracticeId !== practice.id"
                      type="button"
                      :disabled="!!practice.reported || recordingPracticeId !== null"
                      :class="[
                        'shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition',
                        !practice.reported && recordingPracticeId === null
                          ? 'bg-[#e05c3a] text-white hover:opacity-90'
                          : 'cursor-not-allowed bg-brown-8 text-brown-6'
                      ]"
                      @click="startRecording(practice)"
                    >
                      錄音｜練習 <span :class="!practice.reported ? 'text-red-300' : ''">●</span>
                    </button>

                    <button
                      v-else
                      type="button"
                      class="shrink-0 animate-pulse rounded-lg bg-[#e05c3a] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                      @click="stopRecording"
                    >
                      停止 {{ elapsedSeconds }}s ■
                    </button>

                    <button
                      type="button"
                      class="shrink-0 rounded-lg bg-brown-5 px-4 py-2 text-sm font-bold text-cream transition hover:opacity-85"
                      @click="downloadMaterial(practice.materialUrl, practice.articleTitle + '教材')"
                    >
                      教材下載
                    </button>

                    <button
                      v-if="practice.recordings.length > 0"
                      type="button"
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brown-4 transition hover:bg-brown-9"
                      @click="expandedPracticeId = expandedPracticeId === practice.id ? null : practice.id"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        class="transition-transform"
                        :class="{ 'rotate-180': expandedPracticeId === practice.id }"
                      >
                        <path d="M2 4l5 5 5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <div v-else class="w-7 shrink-0" />
                  </div>

                  <!-- 展開後顯示該練習的所有錄音，從中選一個回報 -->
                  <div
                    v-if="expandedPracticeId === practice.id && practice.recordings.length"
                    class="rounded-b-2xl border border-t-0 border-brown-8/60 bg-white/40"
                  >
                    <div
                      v-for="recording in practice.recordings"
                      :key="recording.ordinal"
                      class="flex items-center gap-3 border-t border-brown-9 px-5 py-3"
                    >
                      <button
                        type="button"
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brown-4 text-brown-4 transition hover:bg-brown-9"
                        @click="playAudio(recording.audioUrl)"
                      >
                        <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor">
                          <path d="M1 1.5v6l6-3-6-3z" />
                        </svg>
                      </button>

                      <span class="w-8 shrink-0 text-sm font-bold text-brown-3 px-7">{{ recording.ordinal }}</span>
                      <span class="text-sm text-brown-5">{{ recording.date }}</span>
                      <span class="text-sm text-brown-5">{{ recording.time }}</span>

                      <div class="flex-1" />

                      <div class="flex shrink-0 items-end gap-1">
                        <span class="text-[13px] font-semibold text-brown-5">練習時數</span>
                        <span class="font-semibold text-brown-5 text-[28px] font-black leading-none">{{ recording.seconds.toFixed(2) }}</span>
                        <span class="mb-0.5 text-[13px] font-semibold text-brown-5">秒</span>
                      </div>

                      <button
                        v-if="!practice.reported"
                        type="button"
                        class="shrink-0 rounded-lg bg-secondary-1 px-4 py-2 text-sm font-bold text-cream transition hover:opacity-85"
                        @click="openReportConfirm(practice, recording)"
                      >
                        回報本次學習 ›
                      </button>
                      <span
                        v-else
                        class="shrink-0 rounded-lg bg-brown-8 px-4 py-2 text-sm font-bold text-brown-5"
                      >
                        已回報 ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 回報確認對話框 -->
    <Transition name="fade">
      <div
        v-if="reportConfirm.show"
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="mx-4 w-full max-w-sm rounded-2xl border border-brown-8 bg-cream p-6 shadow-xl">
          <h3 class="font-genyogothic text-[22px] font-black text-brown-1">確定回報本次學習？</h3>
          <p class="mt-2 text-sm leading-6 text-brown-3">
            將以 <span class="font-bold text-brown-1">{{ reportConfirm.recording?.ordinal }}</span> 次練習（{{ reportConfirm.recording?.seconds?.toFixed(2) }} 秒）作為本回合的學習回報，送出後將無法更改。
          </p>
          <div class="mt-5 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-brown-7 px-5 py-2 text-sm font-bold text-brown-3 transition hover:bg-brown-9"
              @click="reportConfirm.show = false"
            >
              取消
            </button>
            <button
              type="button"
              class="rounded-lg bg-secondary-1 px-5 py-2 text-sm font-bold text-cream transition hover:opacity-85"
              @click="submitReport"
            >
              確定回報
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface StepItem {
  title: string
  content: string
}

interface DiscussionItem {
  id: string
  date: string
  title: string
  summary: string
}

interface TaskProgress {
  current: number
  total: number
  label: string
  percent: number
  stars: number
}

interface HistorySummary {
  title: string
  date: string
  helpCount: number
  attemptCount: number
  seconds: number
}

interface TaskPayload {
  id: string
  title: string
  purpose: string
  progress: TaskProgress
  teachSteps: StepItem[]
  discussionCards: DiscussionItem[]
  historySummary: HistorySummary
  materialUrl?: string
}

interface Props {
  modelValue: boolean
  taskId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

useOverlayScrollLock(() => props.modelValue)

type PopupView = 'detail' | 'recording'
const currentView = ref<PopupView>('detail')

// 每次錄音（一個練習下可以有多次錄音，從中挑一個回報）
interface Recording {
  ordinal: string
  date: string
  time: string
  seconds: number
  audioUrl?: string  // 錄音完成後的 Blob URL
}

// 一次練習（對應一篇文章，包含多次錄音）
interface PracticeSession {
  id: string
  articleTitle: string  // 這次練習所用的文章標題
  date: string          // 最新練習日期
  time: string          // 最新練習時間
  limitSeconds: number  // 該文章的限制秒數
  active: boolean       // 是否可錄音
  reported?: boolean      // 是否已完成回報
  materialUrl?: string    // 教材下載連結
  recordings: Recording[]  // 該練習下的所有錄音
}

const expandedPracticeId = ref<string | null>('edo')

// ---- 回報確認 ----
const reportConfirm = ref<{
  show: boolean
  practice: PracticeSession | null
  recording: Recording | null
}>({ show: false, practice: null, recording: null })

const openReportConfirm = (practice: PracticeSession, recording: Recording) => {
  reportConfirm.value = { show: true, practice, recording }
}

const submitReport = () => {
  // TODO: 呼叫後端 API 送出回報
  if (reportConfirm.value.practice) {
    reportConfirm.value.practice.reported = true
    reportConfirm.value.practice.active = false
  }
  reportConfirm.value.show = false
}

// ---- 錄音狀態 ----
const recordingPracticeId = ref<string | null>(null)  // 目前正在錄音的練習 id
const elapsedSeconds = ref(0)                          // 已錄製秒數
let mediaRecorder: MediaRecorder | null = null
let recordedChunks: Blob[] = []
let timerHandle: ReturnType<typeof setInterval> | null = null

const ordinalLabel = (n: number) => {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  switch (v % 10) {
    case 1: return `${n}st`
    case 2: return `${n}nd`
    case 3: return `${n}rd`
    default: return `${n}th`
  }
}

const startRecording = async (practice: PracticeSession) => {
  if (recordingPracticeId.value) return  // 防止重複開始

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    alert('無法取得麥克風權限，請確認瀏覽器設定。')
    return
  }

  recordedChunks = []
  elapsedSeconds.value = 0
  recordingPracticeId.value = practice.id
  expandedPracticeId.value = practice.id

  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data)
  }
  mediaRecorder.onstop = () => {
    stream.getTracks().forEach(t => t.stop())
    const blob = new Blob(recordedChunks, { type: 'audio/webm' })
    const audioUrl = URL.createObjectURL(blob)
    const now = new Date()
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const n = practice.recordings.length + 1
    practice.recordings.push({
      ordinal: ordinalLabel(n),
      date: dateStr,
      time: timeStr,
      seconds: elapsedSeconds.value,
      audioUrl
    })
    practice.date = dateStr.replace(/\//g, '.')
    practice.time = timeStr
    recordingPracticeId.value = null
  }

  mediaRecorder.start()
  timerHandle = setInterval(() => { elapsedSeconds.value++ }, 1000)
}

const stopRecording = () => {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
  mediaRecorder?.stop()
}

const playAudio = (url: string | undefined) => {
  if (!url) {
    alert('此筆錄音尚無音檔可播放。')
    return
  }
  const audio = new Audio(url)
  audio.play()
}

const practiceSessions = ref<PracticeSession[]>([
  {
    id: 'edo',
    articleTitle: '江戸時代',
    date: '2026.05.13',
    time: '21:34',
    limitSeconds: 43,
    active: true,
    recordings: [
      { ordinal: '1st', date: '2026/05/13', time: '07:00', seconds: 48.69 },
      { ordinal: '2nd', date: '2026/05/13', time: '07:03', seconds: 47.80 },
      { ordinal: '3rd', date: '2026/05/13', time: '07:08', seconds: 42.21 },
      { ordinal: '4th', date: '2026/05/13', time: '07:53', seconds: 43.55 },
      { ordinal: '5th', date: '2026/05/13', time: '08:11', seconds: 43.26 }
    ]
  },
  {
    id: 'vending1',
    articleTitle: '自動販賣機',
    date: '2026.05.10',
    time: '19:22',
    limitSeconds: 50,
    active: false,
    recordings: [
      { ordinal: '1st', date: '2026/05/10', time: '19:22', seconds: 55.40 },
      { ordinal: '2nd', date: '2026/05/10', time: '19:27', seconds: 51.83 },
      { ordinal: '3rd', date: '2026/05/10', time: '19:31', seconds: 49.07 }
    ]
  },
  {
    id: 'vending2',
    articleTitle: '東京スカイツリー',
    date: '2026.05.08',
    time: '10:15',
    limitSeconds: 61,
    active: false,
    recordings: [
      { ordinal: '1st', date: '2026/05/08', time: '10:15', seconds: 70.22 },
      { ordinal: '2nd', date: '2026/05/08', time: '10:20', seconds: 65.88 }
    ]
  },
  {
    id: 'vending3',
    articleTitle: '桜の季節',
    date: '2026.05.05',
    time: '08:47',
    limitSeconds: 85,
    active: false,
    recordings: [
      { ordinal: '1st', date: '2026/05/05', time: '08:47', seconds: 92.11 },
      { ordinal: '2nd', date: '2026/05/05', time: '08:53', seconds: 88.34 },
      { ordinal: '3rd', date: '2026/05/05', time: '09:01', seconds: 84.60 },
      { ordinal: '4th', date: '2026/05/05', time: '09:06', seconds: 82.95 }
    ]
  },
  { id: 'vending4', articleTitle: '日本の伝統文化', date: '—', time: '—:—', limitSeconds: 103, active: false, recordings: [] },
  { id: 'vending5', articleTitle: '新幹線の歴史', date: '—', time: '—:—', limitSeconds: 78, active: false, recordings: [] },
  { id: 'vending6', articleTitle: '四季の食べ物', date: '—', time: '—:—', limitSeconds: 55, active: false, recordings: [] }
])

const defaultTeachSteps: StepItem[] = [
  {
    title: '步驟一 閱讀文章',
    content: '雖然說是閱讀文章，但主要是看看是否有自己不會唸的詞彙，在大致閱讀完文章後，就請不用文章的主旨也沒有關係，因為我們主要是透過這個練習去訓練速度，而非理解能力。'
  },
  {
    title: '步驟二 朗讀文章',
    content: '嘗試唸讀一次文章，並且確認自己大致了解大部分的詞彙的發音，但別太拘泥發音要跟母語者一樣。'
  },
  {
    title: '步驟三 加快朗讀速度',
    content: '每當快朗文章都有根據其難度固定的秒數限制，在剛剛嘗試唸過並知道朗讀速度之後，這次可以嘗試看看能快一點，看看能否在秒數內唸完。'
  },
  {
    title: '步驟四 適時求助',
    content: '在這邊要先拋棄自己的完美主義，我們要的是「盡力」，在秒速內唸完，但如果練習的次數超過10次，那代表快朗的過程有問題產生，你需要把快朗的練習至少暫停CAT，諮詢師會根據你的狀況給予相對應的解決方式。'
  }
]

const defaultDiscussionCards: DiscussionItem[] = [
  {
    id: '1',
    date: 'YYYY.MM.DD',
    title: '關於日文學習......',
    summary: '哈囉，小弟是最近成為學員的初學者，想問問一些問題，不知道大家是怎麼想的......'
  },
  {
    id: '2',
    date: 'YYYY.MM.DD',
    title: '關於日文學習......',
    summary: '哈囉，小弟是最近成為學員的初學者，想問問一些問題，不知道大家是怎麼想的......'
  },
  {
    id: '3',
    date: '2026.05.03',
    title: '快朗第三週心得',
    summary: '這週開始有抓到節奏，發音速度和穩定度都有明顯提升。'
  },
  {
    id: '4',
    date: '2026.05.04',
    title: '想請教停頓點怎麼抓',
    summary: '有些長句會卡住，大家都怎麼分段練習？'
  },
  {
    id: '5',
    date: '2026.05.06',
    title: '推薦朗讀練習工具',
    summary: '分享我用來計時和回聽的工具，練習效率提高很多。'
  },
  {
    id: '6',
    date: '2026.05.08',
    title: '第一次達標分享',
    summary: '今天終於在目標秒數內完成，想謝謝社群提供的方法。'
  }
]

const taskMaterialUrl = ref<string | undefined>(undefined)
const taskTitle = ref('快朗')
const purposeText = ref('快朗練習旨在提高學習者的語言閱讀速度及發音品質，在練習的過程中，學習者不需要過份去理解文章內容。透過練習，學習者可以更快掌握新詞彙的語感，增進語感，並在未來的學習中更有效率地吸收語言知識。')
const taskProgress = ref<TaskProgress>({
  current: 1,
  total: 5,
  label: '任務狀態',
  percent: 24,
  stars: 4
})
const teachSteps = ref<StepItem[]>(defaultTeachSteps)
const discussionCards = ref<DiscussionItem[]>(defaultDiscussionCards)
const historySummary = ref<HistorySummary>({
  title: '江戸時代',
  date: '2023.11.15',
  helpCount: 1,
  attemptCount: 1,
  seconds: 43
})

const defaultTaskData: TaskPayload = {
  id: 'fast-reading',
  title: '快朗',
  purpose: '快朗練習旨在提高學習者的語言閱讀速度及發音品質，在練習的過程中，學習者不需要過份去理解文章內容。透過練習，學習者可以更快掌握新詞彙的語感，增進語感，並在未來的學習中更有效率地吸收語言知識。',
  progress: { current: 1, total: 5, label: '任務狀態', percent: 24, stars: 4 },
  teachSteps: defaultTeachSteps,
  discussionCards: defaultDiscussionCards,
  historySummary: { title: '江戸時代', date: '2023.11.15', helpCount: 1, attemptCount: 1, seconds: 43 }
}

const taskDatabase: Record<string, TaskPayload> = {
  'fast-reading': defaultTaskData,
  keyword: {
    id: 'keyword',
    title: '關鍵字',
    purpose: '關鍵字任務著重於擷取文章中高頻與核心語彙，透過重複辨識與造句應用，建立長期記憶與語意連結。',
    progress: { current: 2, total: 8, label: '任務進度', percent: 30, stars: 3 },
    teachSteps: [
      { title: '步驟一 先找高頻詞', content: '先快速掃描段落，標記重複出現的詞彙並分類主題。' },
      { title: '步驟二 對照語境', content: '將詞彙放回原文句子，理解語境和語氣差異。' },
      { title: '步驟三 主動造句', content: '用新詞彙完成 3 到 5 個情境句，提升實際應用能力。' },
      { title: '步驟四 週期複習', content: '隔天、三天、一週做快速回顧，鞏固記憶曲線。' }
    ],
    discussionCards: [
      { id: 'k1', date: '2026.05.05', title: '關鍵字怎麼記最快？', summary: '大家都怎麼做關鍵字卡片？我目前是主題分類。' },
      { id: 'k2', date: '2026.05.07', title: '推薦詞彙複習節奏', summary: '我用 1-3-7 天的複習節奏，成效比每天背更穩。' },
      { id: 'k3', date: '2026.05.08', title: '如何建立主題字庫', summary: '先用主題分類再補同義詞，記憶會更快串起來。' },
      { id: 'k4', date: '2026.05.09', title: '關鍵字筆記格式分享', summary: '我會固定記詞性、例句和情境，回顧時很好用。' }
    ],
    historySummary: { title: '食文化', date: '2024.01.06', helpCount: 2, attemptCount: 3, seconds: 58 }
  }
}

const fetchTaskDataById = async (taskId: string): Promise<TaskPayload> => {
  // TODO: Replace with real API call once backend is ready.
  const normalizedId = taskId.trim() || 'fast-reading'
  return taskDatabase[normalizedId] ?? defaultTaskData
}

const downloadMaterial = (url?: string, filename = '教材') => {
  if (!url) {
    alert('教材尚未上傳，請稍後再試。')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

const applyTaskData = (data: TaskPayload) => {
  taskTitle.value = data.title
  purposeText.value = data.purpose
  taskProgress.value = data.progress
  teachSteps.value = data.teachSteps
  discussionCards.value = data.discussionCards
  historySummary.value = data.historySummary
  taskMaterialUrl.value = data.materialUrl
}

const loadTaskData = async (taskId?: string) => {
  const data = await fetchTaskDataById(taskId || 'fast-reading')
  applyTaskData(data)
}

watch(
  () => props.taskId,
  (taskId) => {
    currentView.value = 'detail'
    void loadTaskData(taskId)
  },
  { immediate: true }
)

const filledTaskStars = computed(() => Math.max(0, Math.min(5, Math.round(taskProgress.value.stars))))

const closePopup = () => {
  currentView.value = 'detail'
  emit('update:modelValue', false)
}

const shareUrl = computed(() => {
  if (typeof window === 'undefined') return ''

  return props.taskId
    ? `${window.location.origin}/learning-task/${encodeURIComponent(props.taskId)}`
    : `${window.location.origin}/learning-task`
})

const openLineShare = () => {
  const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, 'line-share', 'width=600,height=600,resizable=yes')
}

const handleShare = () => {
  if (!shareUrl.value) return

  openLineShare()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-scroll {
  scrollbar-gutter: stable both-edges;
}
</style>
