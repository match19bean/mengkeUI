<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="closePopup"
      >
       <div class="mx-auto flex h-[95vh] w-full max-w-[1540px] flex-col overflow-hidden rounded-[28px] border border-brown-8 bg-cream shadow-[0_12px_30px_rgba(54,32,16,0.14)]">
        <div class="flex shrink-0 items-center justify-end px-4 pt-4 lg:px-8">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-brown-2 transition hover:bg-brown-9"
            @click="closePopup"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="popup-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
          <div class="space-y-6">
           
            <section class="p-6">
              <div class="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div class="h-[140px] w-full shrink-0 overflow-hidden rounded-2xl bg-white lg:w-[260px]">
                  <img
                    :src="courseHero.image || '/images/logo.png'"
                    :alt="courseHero.title"
                    class="h-full w-full object-contain"
                  />
                </div>

                <div class="min-w-0 flex-1 space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="font-genyogothic text-3xl font-black text-brown-1">{{ courseHero.title }}</h2>
                    <span class="rounded-full bg-primary-1 px-3 py-1 text-xs font-bold text-cream px-[35px] mx-2">{{ courseHero.status }}</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      v-for="tag in courseHero.tags"
                      :key="tag"
                      class="inline-flex h-[30px] min-w-[53px] items-center justify-center whitespace-nowrap rounded-[24px] border border-[1px] border-brown-1 px-4 py-1 font-primary text-[16px] font-normal leading-[22px] tracking-[0px] text-brown-3"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <p class="pt-2 h-[30px] w-auto font-genyogothic text-[16px] font-black leading-[22px] tracking-[2px] text-left text-brown-1 opacity-100">
                    {{ courseHero.schedule }}
                  </p>
                </div>

                <div class="flex shrink-0 flex-col items-end justify-between gap-3 lg:min-w-[130px]">
                  <BaseButton variant="outline-rounded" size="small" class="!h-9 !px-4 !text-[14px]">
                    <span class="inline-flex items-center gap-1">
                      評價課程
                      <img src="/images/star.png" alt="星號" width="14" height="14" class="mx-1 h-[14px] w-[14px] flex-shrink-0" />
                    </span>
                  </BaseButton>

                  <div class="text-right">
                    <p class="font-black leading-none text-brown-1">
                      <span class="text-6xl">{{ Math.floor(courseHero.rating) }}</span><span class="text-[32px]">.{{ (courseHero.rating % 1).toFixed(1).slice(2) }}</span>
                    </p>
                    <div class="mt-1 flex justify-end gap-1">
                      <span
                        v-for="star in 5"
                        :key="star"
                         class="text-[25px]"
                        :class="star <= filledStars ? 'text-[#f5c44a]' : 'text-brown-7'"
                      >
                        ★
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex gap-3">
                <BaseButton variant="secondary" size="small" class="!h-11 !rounded-xl !text-sm basis-[60%] !px-0">進入課堂</BaseButton>
                <BaseButton variant="secondary" size="small" class="!h-11 !rounded-xl !text-sm basis-[30%] !px-0" @click="downloadMaterial(courseHero.materialUrl, courseHero.title + ' 教材')">今日教材</BaseButton>
                <button
                  type="button"
                  class="inline-flex h-11 basis-[10%] items-center justify-center gap-1 rounded-xl border border-complementary-1 bg-complementary-1 px-0 text-sm text-cream transition hover:opacity-80"
                  @click="openLineShare"
                >
                  分享
                  <img src="/images/share.png" alt="分享" class="mx-1 h-[14px] w-[14px] flex-shrink-0 object-contain" />
                </button>
              </div>
            </section>

            <section class="px-6 py-5">
              <button
                type="button"
                class="flex w-full items-center justify-between text-left"
                @click="goalOpen = !goalOpen"
              >
                <h3 class="font-secondary text-[28px] font-black text-brown-1">課程目標</h3>
                <span class="inline-flex h-6 w-6 items-center justify-center text-brown-3">
                  <IconsChevronRight
                    :size="18"
                    :stroke-width="2"
                    class="transition-transform duration-200"
                    :class="goalOpen ? 'rotate-90' : '-rotate-90'"
                  />
                </span>
              </button>
              <div v-if="goalOpen" class="mt-4 border-t border-brown-8/60 pt-4 text-sm leading-7 text-brown-2">
                <div v-html="courseHero.goal"></div>
              </div>
            </section>

            <section class="px-6 py-5">
              <button
                type="button"
                class="flex w-full items-center justify-between text-left"
                @click="introOpen = !introOpen"
              >
                <h3 class="font-secondary text-[28px] font-black text-brown-1">課程介紹與規劃</h3>
                <span class="inline-flex h-6 w-6 items-center justify-center text-brown-3">
                  <IconsChevronRight
                    :size="18"
                    :stroke-width="2"
                    class="transition-transform duration-200"
                    :class="introOpen ? 'rotate-90' : '-rotate-90'"
                  />
                </span>
              </button>
              <div v-if="introOpen" class="mt-4 border-t border-brown-8/60 pt-4 text-sm leading-7 text-brown-2">
                <div v-html="courseHero.intro"></div>
              </div>
            </section>

            <section class="space-y-4 px-6 py-5">
              <header class="flex items-center justify-between gap-3">
                <h3 class="font-secondary text-[30px] font-black text-brown-1">討論區相關文章</h3>
                <BaseButton variant="outline-rounded" size="small" class="!h-9 !px-4 !text-xs">
                  <span class="inline-flex items-center gap-1">前往討論區<IconsChevronRight /></span>
                </BaseButton>
              </header>
              <BasePaginatedGrid :items="discussionArticles" :page-size="2" grid-class="grid gap-4 md:grid-cols-2">
                <template #default="{ item }">
                  <article class="rounded-xl border border-brown-8/70 bg-white/70 p-4">
                    <p class="mb-2 text-xs font-semibold tracking-wide text-brown-6">使用者暱稱 {{ item.date }}</p>
                    <h4 class="line-clamp-1 text-lg font-bold text-brown-1">{{ item.title }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-brown-3">{{ item.summary }}</p>
                  </article>
                </template>
              </BasePaginatedGrid>
            </section>

            <section class="space-y-4 px-6 py-5">
              <header class="flex items-center justify-between gap-3">
                <h3 class="font-secondary text-[30px] font-black text-brown-1">課程推薦</h3>
                <BaseButton variant="outline-rounded" size="small" class="!h-9 !px-4 !text-xs">
                  <span class="inline-flex items-center gap-1">更多推薦內容<IconsChevronRight /></span>
                </BaseButton>
              </header>
              <BasePaginatedGrid :items="recommendedArticles" :page-size="4" grid-class="grid gap-3 lg:grid-cols-4">
                <template #default="{ item }">
                  <article class="rounded-xl border border-brown-8/60 bg-white/70 p-4">
                    <p class="mb-2 text-xs font-semibold tracking-wide text-brown-6">{{ item.date }}</p>
                    <h4 class="line-clamp-1 text-base font-bold text-brown-1">{{ item.title }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-brown-3">{{ item.summary }}</p>
                  </article>
                </template>
              </BasePaginatedGrid>
            </section>

            <section class="space-y-4 px-6 py-5">
              <header class="flex items-center justify-between gap-3">
                <h3 class="font-secondary text-[30px] font-black text-brown-1">過往課程</h3>
                <BaseButton variant="outline-rounded" size="small" class="!h-9 !px-4 !text-xs">
                  <span class="inline-flex items-center gap-1">過往課程列表<IconsChevronRight /></span>
                </BaseButton>
              </header>

              <div class="space-y-3">
                <article
                  v-for="item in pastCourses"
                  :key="item.id"
                  class="flex flex-col gap-3 rounded-xl border border-brown-8/60 bg-white/70 p-4 lg:flex-row lg:items-center"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h4 class="text-xl font-black text-brown-5">{{ item.title }}</h4>
                      <span class="text-sm font-semibold text-brown-5">{{ item.date }}</span>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="rounded-full bg-brown-9 px-2 py-1 text-xs font-semibold text-brown-3"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <p class="text-lg font-black text-brown-5">
                    課程時長
                    <span class="inline-block font-geny ogothic text-[36px] leading-[36px] tracking-[0px]">{{ item.duration }}</span>
                    分鐘
                  </p>

                  <div class="flex gap-2">
                    <BaseButton variant="brown-soft" size="small" class="!h-10 !rounded-xl !px-10 !text-sm">課程回放</BaseButton>
                    <BaseButton variant="brown-soft" size="small" class="!h-10 !rounded-xl !px-10 !text-sm">教材下載</BaseButton>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>

        <div class="h-4 shrink-0" aria-hidden="true"></div>
      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CourseHeroData {
  title: string
  status: string
  tags: string[]
  schedule: string
  rating: number
  image?: string
  goal?: string
  intro?: string
  materialUrl?: string
}

interface ArticleItem {
  id: string
  title: string
  date: string
  summary: string
}

interface PastCourseItem {
  id: string
  title: string
  date: string
  duration: number
  tags: string[]
}

interface Props {
  modelValue: boolean
  courseId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

useOverlayScrollLock(() => props.modelValue)

// TODO: 當 API 就緒後，改為 watch(props.courseId, fetchCourseData)
const courseHero = ref<CourseHeroData>({
  title: 'JLPT N5 文法精修班',
  status: '進行中',
  tags: ['日文', 'N5', '文法'],
  schedule: '每週三 上午10:00 - 中午12:30',
  rating: 4.3,
  image: '/images/logo.png',
  goal: '<p>協助學習者準備日文能力測驗（JLPT）N5 文法理解，建立完整句型骨架與題型判讀邏輯。</p>',
  intro: '<p>這堂課包含：文法講解、題型練習、web 測驗與課後回饵。</p><p>建議每週固定學習節奏：課前複習 20 分鐘，課後整理 15 分鐘。</p>',
})

const discussionArticles = ref<ArticleItem[]>([
  { id: '1', title: '關於日文學習......', date: 'YYYY.MM.DD', summary: '哈囉，小弟是最近成為學員的初學者，想問同一些問題，不知道大家是怎麼想的⋯⋯' },
  { id: '2', title: '關於日文學習......', date: 'YYYY.MM.DD', summary: '哈囉，小弟是最近成為學員的初學者，想問同一些問題，不知道大家是怎麼想的⋯⋯' },
  { id: '3', title: 'N5 文法第三回後心得', date: 'YYYY.MM.DD', summary: '上完這週的課後，感覺對て型文法的理解清晰多了。' },
  { id: '4', title: '推薦給初學者的記憶法', date: 'YYYY.MM.DD', summary: '分享我用的學单記憶小技巧，希望對大家有幫助。' },
  { id: '5', title: 'JLPT 考試心得分享', date: 'YYYY.MM.DD', summary: '第一次報名時真的很紧張，幸好有老師和同學給我建議。' },
  { id: '6', title: '每天 30 分鐘日文的方法', date: 'YYYY.MM.DD', summary: '用差不多一年的時間，就能看懂日劇不用字幕。' },
  { id: '7', title: '討論區真的很有用！', date: 'YYYY.MM.DD', summary: '在這裡問問題，大家都很熱心回答，讓我空昆很快就踏實了。' },
  { id: '8', title: '對於助詞的困惑', date: 'YYYY.MM.DD', summary: '「ni」和「de」到底怎麼區分？求大家解惑。' },
  { id: '9', title: '推薦這本學山用的寫字職', date: 'YYYY.MM.DD', summary: '實體寫真的很有效，分享我每天的練寫方式。' },
  { id: '10', title: '課後作業分享', date: 'YYYY.MM.DD', summary: '這週的作業感覺比上週難一點，大家有沒有好的解法？' },
  { id: '11', title: '關於發音的問題', date: 'YYYY.MM.DD', summary: '對於漁音字的發音一直不太準確，課後請老師給了很它的建議。' },
  { id: '12', title: 'N5 單字彙快記小技巧', date: 'YYYY.MM.DD', summary: '用語場記忆法對我幫助很大，希望對大家也有幫助。' },
])

const recommendedArticles = ref<ArticleItem[]>([
  { id: '1', title: 'JLPT N4 進階課程', date: '2025.01.10', summary: '銜接 N5 之後的下一步，強化聽解與閱讀能力。' },
  { id: '2', title: '日語會話入門', date: '2025.02.15', summary: '日常對話情境練習，快速提升口說自信。' },
  { id: '3', title: '漢字記憶技巧', date: '2025.03.05', summary: '以故事聯想法輕鬆記住 300 個基礎漢字。' },
  { id: '4', title: '敬語完全攻略', date: '2025.04.20', summary: '職場與正式場合必備的敬語使用指南。' },
  { id: '5', title: 'JLPT N3 文法第一步', date: '2025.05.01', summary: '從 N4 抜高到 N3，建立中級文法基礎。' },
  { id: '6', title: '日文聽力訓練營', date: '2025.05.10', summary: '透過大量聆力素材精進聽解能力。' },
  { id: '7', title: '日本文化跟語言', date: '2025.06.01', summary: '結合文化背景學習日文，加深理解。' },
  { id: '8', title: 'JLPT 擬真題演練營', date: '2025.06.15', summary: '系統性刷題，掌握考試技巧與時間控制。' },
])

const pastCourses = ref<PastCourseItem[]>([
  { id: '1', title: 'JLPT N5 文法精修班 第一期', date: '2024.09.04', duration: 90, tags: ['日文', 'N5'] },
  { id: '2', title: 'JLPT N5 文法精修班 第二期', date: '2024.12.11', duration: 90, tags: ['日文', 'N5'] },
])

const goalOpen = ref(true)
const introOpen = ref(true)

const filledStars = computed(() => Math.max(0, Math.min(5, Math.round(courseHero.value.rating))))

const shareUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return props.courseId
    ? `${window.location.origin}/course/${props.courseId}`
    : window.location.href
})

const downloadMaterial = (url?: string, filename?: string) => {
  if (!url) { alert('目前無可下載的教材'); return }
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? '今日教材'
  a.click()
}

const openLineShare = () => {
  const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, 'line-share', 'width=600,height=600,resizable=yes')
}

const closePopup = () => {
  emit('update:modelValue', false)
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
