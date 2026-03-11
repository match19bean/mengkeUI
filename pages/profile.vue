<template>
  <div class="min-h-screen bg-cream px-4 py-6 mx-2">
    <div class="mx-auto w-full max-w-[1440px] space-y-6">
      <!-- 頂部：個人資料卡 -->
      <section class="py-4">
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

            <div class="space-y-2 text-sm text-brown-4">
              <div class="flex items-center gap-3">
                <p class="text-xs font-semibold tracking-[0.2em] text-brown-5">學習狀態</p>
                <span class="rounded-full bg-secondary-1/15 px-3 py-0.5 text-xs font-semibold text-secondary-1">穩定</span>
              </div>
              <p>持續在 N5/N4 課程維持參與度，記得每月完成一次練習！</p>
            </div>

            <div class="grid gap-3 text-sm sm:grid-cols-2">
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-full border border-brown-4/80 bg-white/40 px-4 py-2 font-semibold text-brown-2 shadow-sm transition hover:bg-white/70"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5V14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M3 6.5L8 1.5L13 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                師資更換
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
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 11.5V14H4.5L12.8733 5.62667L10.3733 3.12667L2 11.5Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                資料更新
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 規劃標籤備註 -->
      <section class="py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BaseTypography variant="h2" tag="h2" class="font-secondary text-brown-1">
              規劃標籤備註
            </BaseTypography>
            <BaseTypography variant="subtitle" class="text-brown-4">
              快速掌握老師及顧問留下的重點標籤
            </BaseTypography>
          </div>
          <BaseButton variant="outline-rounded" size="small">新增標籤</BaseButton>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in planningTags"
            :key="tag.label"
            :class="[
              'rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
              tag.class
            ]"
          >
            {{ tag.label }}
          </span>
        </div>

        <div class="mt-5 border border-dashed border-brown-8 p-5 text-sm text-brown-4">
          {{ planningNote }}
        </div>
      </section>

      <!-- 帳號記錄 -->
      <section class="py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BaseTypography variant="h2" class="font-secondary text-brown-1">帳號記錄</BaseTypography>
            <BaseTypography variant="subtitle" class="text-brown-4">近期的申請、審核與系統動作</BaseTypography>
          </div>
          <BaseButton variant="secondary" size="small">特權提醒</BaseButton>
        </div>

        <div class="mt-5 space-y-3">
          <article
            v-for="record in accountLogs"
            :key="record.id"
            class="p-4 border-b border-brown-8 last:border-b-0"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-1 items-start gap-3">
                <span :class="['rounded-full px-3 py-1 text-xs font-semibold shadow-sm', record.tagClass]">
                  {{ record.category }}
                </span>
                <div>
                  <p class="text-base font-semibold text-brown-1">{{ record.title }}</p>
                  <p class="text-sm text-brown-4">{{ record.description }}</p>
                </div>
              </div>
              <div class="text-sm text-brown-4">
                <p>{{ record.date }}</p>
                <p class="font-semibold text-brown-2">{{ record.status }}</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
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

interface AccountRecord {
  id: number
  category: string
  title: string
  description: string
  date: string
  status: string
  tagClass: string
}

const profile = {
  name: '姜小文',
  studentId: '20170100001'
}

const learningStats: LearningStat[] = [
  {
    label: '學習評分',
    value: 62,
    max: 100,
    unit: '分',
    caption: '維持穩定出席與作業提交。',
    color: '#EE7959'
  },
  {
    label: '學習平均到期',
    value: 324,
    max: 400,
    unit: '天',
    caption: '課程剩餘天數，請保持進度。',
    color: '#8C8074'
  },
  {
    label: '優惠期倒數',
    value: 30,
    max: 60,
    unit: '天',
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
      { label: '專業科系', value: '教育心理學', fullWidth: true }
    ]
  },
  {
    title: '聯絡資訊',
    items: [
      { label: '地址', value: '桃園市 中壢區 中山路185巷6樓', fullWidth: true },
      { label: '手機號碼', value: '0912-345-678', badge: { text: '未綁定', class: 'bg-brown-9 text-brown-3 border border-brown-8' } },
      { label: 'E-mail', value: 'mkreversal@gmail.com', badge: { text: '已驗證', class: 'bg-primary-1/15 text-primary-1' } },
      { label: 'LINE 綁定', value: '已綁定', badge: { text: '同步', class: 'bg-secondary-1/15 text-secondary-1' } }
    ]
  },
  {
    title: '學習資訊',
    items: [
      { label: '欲學習的語言別', value: '日文' },
      { label: '學習語言的目的', value: '興趣、工作需求' },
      { label: '聯絡時間', value: '0912-345-678' },
      { label: '目前的程度', value: 'A1', badge: { text: '語言測評', class: 'bg-complementary-1/15 text-complementary-1' } }
    ]
  }
]

const planningTags = [
  { label: '規劃顧問：雅惠', class: 'bg-brown-9 text-brown-2' },
  { label: '日文', class: 'bg-primary-1/15 text-primary-1' },
  { label: '韓文預備', class: 'bg-secondary-1/15 text-secondary-1' },
  { label: '東京交換參訪', class: 'bg-complementary-2/15 text-complementary-2' },
  { label: '英文', class: 'bg-brown-9 text-brown-3' },
  { label: '學生', class: 'bg-brown-9 text-brown-3' },
  { label: '學期目標：一年級', class: 'bg-brown-9 text-brown-3' }
]

const planningNote = '顧問提醒：維持 N2 目標，建議每週至少參與 3 堂課程與一次語言交換，若有海外留學需求提前兩週告知。'

const accountLogs: AccountRecord[] = [
  {
    id: 1,
    category: '補課申請',
    title: '申請補課',
    description: '等待顧問回覆與排課',
    date: '2023/11/13 07:00',
    status: '待確認',
    tagClass: 'bg-complementary-2/15 text-complementary-2'
  },
  {
    id: 2,
    category: '備註 CAT',
    title: '備註 CAT',
    description: '錄入顧問建議：發音練習',
    date: '2023/11/05 09:00',
    status: '完成',
    tagClass: 'bg-primary-1/15 text-primary-1'
  },
  {
    id: 3,
    category: '繳費單',
    title: '繳費單',
    description: '本期學費合約已匯款',
    date: '2023/11/05 08:00',
    status: '完成',
    tagClass: 'bg-secondary-1/15 text-secondary-1'
  },
  {
    id: 4,
    category: '已報備',
    title: '已報備',
    description: '上課異動已記錄，請留意',
    date: '2023/11/03 17:35',
    status: '完成',
    tagClass: 'bg-primary-3/30 text-primary-1'
  },
  {
    id: 5,
    category: '帳號登錄',
    title: '帳號登入',
    description: '使用桌機登入成功',
    date: '2023/11/01 13:31',
    status: '完成',
    tagClass: 'bg-brown-9 text-brown-3'
  }
]

const getProgressWidth = (value: number, max: number) => {
  if (max <= 0) return '0%'
  const pct = Math.min(100, Math.round((value / max) * 100))
  return `${pct}%`
}
</script>
