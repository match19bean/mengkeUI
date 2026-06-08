<template>
  <Transition name="fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closePopup"
    >
      <div class="bg-[#F8F7F0] rounded-3xl shadow-popup w-full max-w-[75vw] max-h-[90vh] overflow-hidden relative flex flex-col">
        <!-- 關閉按鈕 -->
        <button 
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-brown-9 text-brown-3 cursor-pointer transition z-10" 
          @click="closePopup"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- 內容區域 (可滾動) -->
        <div class="flex-1 overflow-y-auto px-12 p-4">
          <div class="py-8">
            <div class="flex flex-col gap-8 lg:flex-row lg:gap-12">
              <!-- 左側：頭像 + 學習統計 -->
              <div class="w-full max-w-sm self-start space-y-6">
                <div class="flex flex-col items-center gap-4 text-center">
                  <button
                    type="button"
                    class="group relative h-[200px] w-[200px] cursor-pointer rounded-full border-4 border-white bg-white shadow-inner overflow-hidden"
                    @click="openAvatarPicker"
                  >
                    <img :src="profile.avatar || '/images/logo.png'" alt="會員頭像" class="h-full w-full object-contain" />
                    <span class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span class="flex h-10 w-10 items-center justify-center rounded-full">
                        <img src="/images/updateIcon.png" alt="更換頭像" width="18" height="18" />
                      </span>
                    </span>
                  </button>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarChange"
                  />
                  <div>
                    <BaseTypography variant="h2" tag="h2" class="font-secondary text-brown-5">
                      {{ profile.name }}
                    </BaseTypography>
                    <p class="mt-4 text-body font-semibold text-brown-5">{{ profile.studentId }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div v-for="stat in learningStats" :key="stat.label" class="space-y-1">
                    <div class="flex items-center justify-between text-sm font-semibold">
                      <p class="font-primary text-stat-label font-stat-label tracking-stat-label text-brown-3">{{ stat.label }} <span class="font-secondary text-stat-value font-stat-value tracking-stat-value text-brown-4">{{ stat.value }}</span>{{ stat.unit }}</p>    
                    </div>
                    <div class="h-3 overflow-hidden rounded-full bg-[#D9D9D9]">
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
                    class="flex items-center justify-center gap-[10px] rounded-md bg-brown-7 px-md py-sm font-semibold text-cream shadow-sm transition"
                  >                    
                    師資更換
                    <img src="/images/changeTeacher.png" alt="師資更換" width="16" height="16" />
                  </button>
                  <button
                    type="button"
                    class="flex items-center justify-center gap-[10px] rounded-md border border-brown-4/80 bg-brown-5 px-md py-sm font-semibold text-cream shadow-sm transition"
                  >                    
                    報價單與契約
                    <img src="/images/contractIcon.png" alt="報價單與契約" width="16" height="16" />
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
                    <BaseTypography variant="h4" tag="h3" class="font-secondary text-brown-5">
                      {{ block.title }}
                    </BaseTypography>

                    <div v-if="block.layout === 'inline'" class="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-brown-4">
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        :class="['flex items-center gap-2 text-base font-semibold text-brown-5', item.inlineAction ? 'ml-auto' : '']"
                      >
                        <span class="text-xs font-semibold tracking-[0.3em] text-brown-5">{{ item.label }}</span>
                        <span class="text-xs font-semibold text-brown-5">：</span>
                        <span v-if="item.value && !item.inlineAction" class="font-primary text-section-content font-section-content tracking-section-content">{{ item.value }}</span>
                        <button
                          v-if="item.inlineAction"
                          type="button"
                           class="flex items-center justify-center gap-[10px] rounded-md border border-brown-4/80 bg-brown-5 px-md py-sm text-sm font-semibold text-cream shadow-sm transition"
                        >
                          {{ item.inlineAction.label }}
                          <img src="/images/mail.png" alt="密碼更改" width="16" height="16" />   
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
                      class="grid gap-y-5 text-xs font-semibold text-brown-5 xl:grid-cols-4"
                    >
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        class="flex items-center gap-3"
                      >
                        <span class="text-xs font-semibold tracking-[0.3em] text-brown-5">{{ item.label }}</span>
                        <span class="text-xs font-semibold text-brown-5">：</span>
                        <span v-if="item.value" class="font-primary text-section-content font-section-content tracking-section-content">{{ item.value }}</span>
                      </div>
                    </div>

                    <dl v-else class="grid gap-x-8 gap-y-6 text-sm text-brown-4 md:grid-cols-2">
                      <div
                        v-for="item in block.items"
                        :key="item.label"
                        :class="['flex items-center gap-3', item.fullWidth ? 'md:col-span-2' : '']"
                      >
                        <dt class="text-xs font-semibold tracking-[0.2em] text-brown-5 whitespace-nowrap">{{ item.label }}</dt>
                        <span class="text-xs font-semibold text-brown-5">：</span>
                        <dd class="flex flex-wrap items-center gap-2 text-base font-semibold text-brown-5">
                          <span v-if="item.value" class="font-primary text-section-content font-section-content tracking-section-content">{{ item.value }}</span>
                          <span
                            v-if="item.badge"
                            :class="['rounded-full px-2.5 py-0.5 text-xs font-semibold', item.badge.class]"
                          >
                            {{ item.badge.text }}
                          </span>
                          <button
                            v-if="item.inlineAction"
                            type="button"
                            class="inline-flex items-center rounded-full border border-brown-4/80 px-3 py-1 text-xs font-semibold text-brown-2 transition"
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
                    class="flex items-center justify-center gap-[10px] rounded-md border border-brown-4/80 bg-brown-5 px-md py-sm font-semibold text-cream shadow-sm transition"
                    @click="handleProfileUpdate"
                  >                    
                    資料更新
                    <img src="/images/updateIcon.png" alt="資料更新" width="16" height="16" />                    
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
import { onBeforeUnmount, ref } from 'vue'

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

useOverlayScrollLock(() => props.modelValue)

const closePopup = () => {
  emit('update:modelValue', false)
}

const getProgressWidth = (value: number, max: number) => {
  if (max <= 0) return '0%'
  const pct = Math.min(100, Math.round((value / max) * 100))
  return `${pct}%`
}

// 個人資料資料
const profile = ref({
  name: 'User',
  studentId: '2017010001',
  avatar: '' // API 串接後填入頭像 URL
})

const avatarInputRef = ref<HTMLInputElement | null>(null)
let previewAvatarUrl: string | null = null

const openAvatarPicker = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  if (previewAvatarUrl) {
    URL.revokeObjectURL(previewAvatarUrl)
  }

  previewAvatarUrl = URL.createObjectURL(file)
  profile.value.avatar = previewAvatarUrl
}

onBeforeUnmount(() => {
  if (previewAvatarUrl) {
    URL.revokeObjectURL(previewAvatarUrl)
  }
})

const learningStats: LearningStat[] = [
  {
    label: '學習評分',
    value: 62,
    max: 100,
    unit: ' 分',
    caption: '維持穩定出席與作業提交。',
    color: '#FFC649'
  },
  {
    label: '學習契約剩餘',
    value: 324,
    max: 400,
    unit: ' 天',
    caption: '課程剩餘天數，請保持進度。',
    color: '#21A07D'
  },
  {
    label: '假期剩餘',
    value: 30,
    max: 60,
    unit: ' 天',
    caption: '即將到期，可聯繫顧問續課。',
    color: '#A4A4A4'
  }
]

const infoBlocks: InfoBlock[] = [
  {
    title: '帳號資訊',
    layout: 'inline',
    items: [
      { label: '使用者名稱', value: 'Maaku' },
      { label: '登入密碼', value: '', inlineAction: { label: '密碼更改', icon: 'mail' } }
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
      { label: '手機號碼', value: '0912-345-678', badge: { text: '未驗證', class: 'bg-brown-9 text-brown-3 border border-brown-8' } },
      { label: 'E-mail', value: 'mkreversal@gmail.com', badge: { text: '已驗證', class: 'bg-primary-1 text-cream' } },
      { label: 'LINE綁定', value: '', badge: { text: '已綁定', class: 'bg-line text-cream' } }
    ]
  },
  {
    title: '學習資訊',
    items: [
      { label: '欲學習的語言別', value: '日文' },
      { label: '學習語言的目的', value: '興趣、工作需求' },
      { label: '欲達到的目標', value: 'C1' },
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
