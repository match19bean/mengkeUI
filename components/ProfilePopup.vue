<template>
  <Transition name="fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closePopup"
    >
      <div class="bg-[#F8F7F0] rounded-3xl shadow-popup w-full max-w-[90vw] max-h-[90vh] overflow-hidden relative flex flex-col">
        <!-- 關閉按鈕 -->
        <button 
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-brown-9 text-brown-3 cursor-pointer transition z-10" 
          @click="closePopup"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Logo -->
        <div class="pt-8 pb-4 px-8 flex-shrink-0">
          <div class="flex justify-center mb-4">
            <img src="/images/logo.png" alt="反轉外語" class="h-12 object-contain">
          </div>
          <h2 class="text-2xl font-genyogothic font-black text-center text-brown-1 tracking-wider">帳號資訊</h2>
        </div>

        <!-- 漸淡分隔線 -->
        <div class="h-[1px] mx-8 mb-4 opacity-50" style="background: linear-gradient(to right, #501C1C00, #432C2C 50%, #501C1C00);"></div>

        <!-- 內容區域 (可滾動) -->
        <div class="flex-1 overflow-y-auto px-8 pb-8">
          <div class="py-4">
            <div class="flex flex-col gap-8 lg:flex-row lg:gap-12">
              <!-- 左側：頭像 + 學習統計 -->
              <div class="w-full max-w-sm self-start space-y-6">
                <div class="flex flex-col items-center gap-4 text-center">
                  <div class="h-36 w-36 rounded-full border-4 border-white bg-gradient-to-b from-brown-8 to-brown-9 shadow-inner"></div>
                  <div>
                    <BaseTypography variant="h2" tag="h2" class="font-secondary text-brown-1">
                      {{ profile.name }}
                    </BaseTypography>
                    <p class="text-sm font-semibold text-brown-4">{{ profile.studentId }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div v-for="stat in learningStats" :key="stat.label" class="space-y-1">
                    <div class="flex items-center justify-between text-sm font-semibold">
                      <p class="text-brown-3">{{ stat.label }}</p>
                      <p class="text-brown-1">
                        {{ stat.value }}<span class="text-xs text-brown-4">{{ stat.unit }}</span>
                      </p>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-white/80">
                      <div
                        class="h-full rounded-full"
                        :style="{ width: getProgressWidth(stat.value, stat.max), backgroundColor: stat.color }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="grid gap-3 text-sm sm:grid-cols-2">
                  <button
                    type="button"
                    class="flex items-center justify-center gap-2 rounded-full border border-brown-4/80 bg-white/40 px-4 py-2 font-semibold text-brown-2 shadow-sm transition hover:bg-white/70"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
                      <path d="M8 5v3M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    師資查詢
                  </button>
                  <button
                    type="button"
                    class="flex items-center justify-center gap-2 rounded-full border border-brown-4/80 bg-white/40 px-4 py-2 font-semibold text-brown-2 shadow-sm transition hover:bg-white/70"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 2.5H10.5L12.5 4.5V13.5H3.5V2.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M10.5 2.5V4.5H12.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    報價單與契約
                  </button>
                </div>
              </div>

              <!-- 右側：詳細資訊 -->
              <div class="flex-1">
                <div class="space-y-8">
                  <div
                    v-for="(block, index) in infoBlocks"
                    :key="block.title"
                    :class="['space-y-4', index < infoBlocks.length - 1 ? 'border-b border-brown-8/60 pb-6' : '']"
                  >
                    <BaseTypography variant="h4" tag="h3" class="font-secondary text-brown-2">
                      {{ block.title }}
                    </BaseTypography>

                    <div v-if="block.layout === 'inline'" class="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-brown-4">
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        class="flex items-center gap-2 text-base font-semibold text-brown-2"
                      >
                        <span class="text-xs font-semibold tracking-[0.3em] text-brown-5">{{ item.label }}</span>
                        <span class="text-xs font-semibold text-brown-5">：</span>
                        <span v-if="item.value && !item.inlineAction" class="text-brown-2">{{ item.value }}</span>
                        <button
                          v-if="item.inlineAction"
                          type="button"
                          class="inline-flex items-center gap-2 rounded-full bg-brown-4/30 px-4 py-1.5 text-sm font-semibold text-brown-2 shadow-sm transition hover:bg-brown-4/40"
                        >
                          {{ item.inlineAction.label }}
                          <svg
                            v-if="item.inlineAction.icon === 'mail'"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            class="text-brown-2"
                          >
                            <path
                              d="M2.5 4.5C2.5 3.67157 3.17157 3 4 3H12C12.8284 3 13.5 3.67157 13.5 4.5V11.5C13.5 12.3284 12.8284 13 12 13H4C3.17157 13 2.5 12.3284 2.5 11.5V4.5Z"
                              stroke="currentColor"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2.5 5L8 8.5L13.5 5"
                              stroke="currentColor"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                        <span
                          v-if="item.badge"
                          :class="['rounded-full text-xs font-semibold', item.badge.class]"
                        >
                          {{ item.badge.text }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-else-if="block.layout === 'stacked'"
                      class="grid gap-y-3 text-xs font-semibold text-brown-2 xl:grid-cols-3"
                    >
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        class="flex items-center gap-3"
                      >
                        <span class="text-xs font-semibold tracking-[0.3em] text-brown-5">{{ item.label }}</span>
                        <span class="text-xs font-semibold text-brown-5">：</span>
                        <span v-if="item.value" class="text-xs font-semibold text-brown-2">{{ item.value }}</span>
                      </div>
                    </div>

                    <dl v-else class="grid gap-x-8 gap-y-3 text-sm text-brown-4 md:grid-cols-2">
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        :class="['space-y-1', item.fullWidth ? 'md:col-span-2' : '']"
                      >
                        <dt class="text-xs font-semibold tracking-[0.2em] text-brown-5">{{ item.label }}</dt>
                        <dd class="flex flex-wrap items-center gap-2 text-base font-semibold text-brown-2">
                          <span v-if="item.value">{{ item.value }}</span>
                          <span
                            v-if="item.badge"
                            :class="['rounded-full px-2.5 py-0.5 text-xs font-semibold', item.badge.class]"
                          >
                            {{ item.badge.text }}
                          </span>
                          <button
                            v-if="item.inlineAction"
                            type="button"
                            class="inline-flex items-center rounded-full border border-brown-4/80 px-3 py-1 text-xs font-semibold text-brown-2 transition hover:bg-white/70"
                          >
                            {{ item.inlineAction.label }}
                          </button>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-brown-4/80 bg-white/60 px-5 py-2 text-sm font-semibold text-brown-2 shadow-sm transition hover:bg-white/80"
                    @click="handleProfileUpdate"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 11.5V14H4.5L12.8733 5.62667L10.3733 3.12667L2 11.5Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    資料更新
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface LearningStat {
  label: string
  value: number
  max: number
  unit: string
  caption: string
  color: string
}

interface InfoBadge {
  text: string
  class: string
}

interface InlineAction {
  label: string
  icon?: 'mail'
}

interface InfoItem {
  label: string
  value: string
  badge?: InfoBadge
  fullWidth?: boolean
  inlineAction?: InlineAction
}

type InfoLayout = 'grid' | 'inline' | 'stacked'

interface InfoBlock {
  title: string
  items: InfoItem[]
  layout?: InfoLayout
}

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const closePopup = () => {
  emit('update:modelValue', false)
}

const getProgressWidth = (value: number, max: number) => {
  if (max <= 0) return '0%'
  const pct = Math.min(100, Math.round((value / max) * 100))
  return `${pct}%`
}

// 個人資料資料
const profile = {
  name: '姜小文',
  studentId: '2017010001'
}

const learningStats: LearningStat[] = [
  {
    label: '學習評分',
    value: 62,
    max: 100,
    unit: ' 分',
    caption: '維持穩定出席與作業提交。',
    color: '#EE7959'
  },
  {
    label: '學習契約剩餘',
    value: 324,
    max: 400,
    unit: ' 天',
    caption: '課程剩餘天數，請保持進度。',
    color: '#8C8074'
  },
  {
    label: '假期剩餘',
    value: 30,
    max: 60,
    unit: ' 天',
    caption: '即將到期，可聯繫顧問續課。',
    color: '#F2A74B'
  }
]

const infoBlocks: InfoBlock[] = [
  {
    title: '帳號資訊',
    layout: 'inline',
    items: [
      { label: '使用者名稱', value: 'Maaku' },
      { label: '登入密碼', value: '', inlineAction: { label: '密碼更改', icon: 'mail' } },
      { label: '帳號權限', value: '學員 - 0' }
    ]
  },
  {
    title: '個人資訊',
    layout: 'stacked',
    items: [
      { label: '姓名', value: '姜小文' },
      { label: '生理性別', value: '男' },
      { label: '生日', value: '1981/03/02' },
      { label: '職業別', value: '教育業' },
      { label: '學歷', value: '碩士' },
      { label: '畢業學校', value: '廣島大學' },
      { label: '畢業科系', value: '教育心理學' }
    ]
  },
  {
    title: '聯絡資訊',
    items: [
      { label: '地址', value: '桃園市 中壢區 320 中山路185號6樓', fullWidth: true },
      { label: '手機號碼', value: '0912-345-678', badge: { text: '未綁定', class: 'bg-brown-9 text-brown-3 border border-brown-8' } },
      { label: 'E-mail', value: 'mkreversal@gmail.com', badge: { text: '已驗證', class: 'bg-primary-1/15 text-primary-1' } },
      { label: 'LINE綁定', value: '', badge: { text: '已綁定', class: 'bg-secondary-1/15 text-secondary-1' } }
    ]
  },
  {
    title: '學習資訊',
    items: [
      { label: '欲學習的語言別', value: '日文' },
      { label: '學習語言的目的', value: '興趣、工作需求' },
      { label: '欲達到的目標', value: '0912-345-678' },
      { label: '目前的程度', value: 'A1' }
    ]
  }
]

const handleProfileUpdate = () => {
  console.log('資料更新')
  // TODO: 實作資料更新邏輯
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
