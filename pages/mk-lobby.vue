<template>
  <BasePageShell>
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">

      <!-- 分類 Tabs + 操作按鈕（同一行） -->
      <div class="flex shrink-0 items-center gap-3 px-6 pb-3">
        <!-- Tabs（可左右捲動） -->
        <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          <BaseButton
            v-for="tab in tabs"
            :key="tab"
            variant="outline"
            size="medium"
            class="!rounded-xl !px-5 !py-2.5 !border-transparent !shadow-lg !transition shrink-0"
            :class="activeTab === tab
              ? '!bg-brown-1 !text-cream'
              : '!bg-white/70 !text-brown-1'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </BaseButton>
        </div>
        <!-- 操作按鈕（固定右側） -->
        <button
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary-1 px-5 py-2.5 text-sm font-bold text-cream transition hover:opacity-85"
          @click="composeOpen = true"
        >
          發文
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brown-7 bg-cream px-5 py-2.5 text-sm font-bold text-brown-2 transition hover:bg-brown-9"
        >
          我的發文
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </button>
      </div>

      <!-- 內容行（輪播 + 文章 + 廣告欄） -->
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <!-- 左側主內容 -->
        <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <!-- 置頂 Banner -->
          <div class="shrink-0 px-6 pb-4">
            <BaseCarousel :items="carouselItems" :autoplay="true" :interval="6000" />
          </div>

          <!-- 文章列表 -->
          <div class="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] px-6 pb-6">
            <!-- 文章卡片 -->
            <div class="space-y-3">
              <article
                v-for="post in filteredPosts"
                :key="post.id"
                class="rounded-2xl border border-brown-8/60 bg-cream p-4 transition hover:shadow-sm"
              >
                <div class="flex items-start gap-3">
                  <!-- 文章縮圖 -->
                  <div class="h-[72px] w-[108px] shrink-0 overflow-hidden rounded-xl bg-brown-8">
                    <img v-if="post.image" :src="post.image" :alt="post.title" class="h-full w-full object-cover" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <!-- 使用者 + 日期 + 標籤 -->
                    <div class="flex flex-wrap items-center gap-3">
                      <div class="h-6 w-6 shrink-0 rounded-full bg-brown-7 overflow-hidden">
                        <img v-if="post.avatar" :src="post.avatar" :alt="post.author" class="h-full w-full object-cover" />
                      </div>
                      <span class="text-xs font-semibold text-brown-5">{{ post.author ?? '使用者暱稱' }}</span>
                      <span class="text-xs text-brown-6">{{ post.date }}</span>
                      <span
                        v-for="tag in post.tags"
                        :key="tag"
                        class="rounded-full px-2 py-0.5 text-[11px] font-bold text-cream"
                        :class="tagColor(tag)"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <!-- 標題 -->
                    <h3 class="mt-1 text-[16px] font-bold text-brown-1 leading-snug">{{ post.title }}</h3>

                    <!-- 摘要 -->
                    <p class="mt-1 line-clamp-2 text-sm text-brown-4 leading-relaxed">{{ post.summary }}</p>

                    <!-- 互動列 -->
                    <div class="mt-3 flex items-center gap-4">
                      <button type="button" class="flex items-center gap-1 text-xs text-brown-5 transition hover:text-brown-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {{ post.comments }}
                      </button>
                      <button type="button" class="flex items-center gap-1 text-xs text-brown-5 transition hover:text-primary-1" @click="post.liked = !post.liked">
                        <svg width="14" height="14" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="post.liked ? 'text-primary-1' : ''">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {{ post.likes + (post.liked ? 1 : 0) }}
                      </button>
                      <button type="button" class="flex items-center gap-1 text-xs text-brown-5 transition hover:text-brown-2" @click="post.bookmarked = !post.bookmarked">
                        <svg width="14" height="14" viewBox="0 0 24 24" :fill="post.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        收藏
                      </button>
                      <div class="flex-1" />
                      <button type="button" class="flex items-center gap-0.5 text-xs font-bold text-brown-3 transition hover:text-brown-1" @click="openPost(post)">
                        詳看全文
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 3l5 5-5 5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <!-- 分隔線 -->
        <div class="w-[1px] shrink-0 opacity-40" style="background: linear-gradient(to bottom, #501C1C00, #432C2C 50%, #501C1C00);" />

        <!-- 廣告欄 -->
        <div class="flex w-[350px] shrink-0 flex-col gap-4 overflow-y-auto [scrollbar-gutter:stable] px-4 py-5">
          <h3 class="font-genyogothic text-[14px] font-black text-brown-4">活動／廣告</h3>
          <div class="h-[220px] rounded-2xl bg-brown-8 flex items-center justify-center">
            <span class="text-sm font-semibold text-brown-5">廣告版位 1</span>
          </div>
          <div class="h-[220px] rounded-2xl bg-brown-8 flex items-center justify-center">
            <span class="text-sm font-semibold text-brown-5">廣告版位 2</span>
          </div>
          <div class="h-[160px] rounded-2xl bg-brown-8 flex items-center justify-center">
            <span class="text-sm font-semibold text-brown-5">廣告版位 3</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 詳看全文 Popup -->
    <MkPostPopup
      v-model="postPopupOpen"
      :post="activePost"
      @like="toggleLike"
      @bookmark="toggleBookmark"
    />
  </BasePageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ── 輪播 ──
const carouselItems = ref([
  { id: 1, image: '/images/Carousel1.png', alt: 'MK大廳活動' },
  { id: 2, image: 'https://placehold.co/800x400/3E7871/FFFFFF?text=Slide1', alt: '11月課程異動' },
  { id: 3, image: 'https://placehold.co/800x400/F2A74B/FFFFFF?text=Slide2', alt: 'MK大廳活動特輯' },
])

// ── 搜尋 ──
const searchQuery = ref('')

// ── 分類 Tabs ──
const tabs = ['全部主題', '課程公告', '學習討論', '旅遊分享', '學習方式', '疑難困惑', '投票'] as const
type Tab = typeof tabs[number]
const activeTab = ref<Tab>('全部主題')

// ── 發文 ──
const composeOpen = ref(false)

// ── 文章詳頁 Popup ──
const postPopupOpen = ref(false)
const activePost = ref<Post | null>(null)

const openPost = (post: Post) => {
  activePost.value = post
  postPopupOpen.value = true
}

const toggleLike = (id: string) => {
  const post = posts.value.find(p => p.id === id)
  if (post) post.liked = !post.liked
}

const toggleBookmark = (id: string) => {
  const post = posts.value.find(p => p.id === id)
  if (post) post.bookmarked = !post.bookmarked
}

// ── 文章資料 ──
interface Post {
  id: string
  author?: string
  avatar?: string
  date: string
  tags: string[]
  title: string
  summary: string
  image?: string
  comments: number
  likes: number
  liked: boolean
  bookmarked: boolean
}

const posts = ref<Post[]>([
  {
    id: '1',
    date: 'YYYY.MM.DD',
    tags: ['課程公告', '聚樂部'],
    title: '【11月課程異動】',
    summary: '各位學員晚安，這是11月份的聚樂部相關課程異動，請請學員注意相關的課程時間。',
    image: 'https://placehold.co/120x80/E8996D/FFFFFF?text=Demo',
    comments: 11,
    likes: 120,
    liked: false,
    bookmarked: false
  },
  {
    id: '2',
    date: 'YYYY.MM.DD',
    tags: ['疑難困惑'],
    title: '關於日文學習......',
    summary: '哈囉，小弟是最近成為學員的初學者，想問問一些問題，不知道大家是怎麼想的．．．．',
    image: 'https://placehold.co/120x80/4285F4/FFFFFF?text=Demo',
    comments: 23,
    likes: 26,
    liked: false,
    bookmarked: false
  },
  {
    id: '3',
    date: 'YYYY.MM.DD',
    tags: ['學習方式', '疑難困惑'],
    title: '快朗有效嗎？',
    summary: '今天開始第一篇的快朗，這樣真的有效嗎？......',
    image: 'https://placehold.co/120x80/3E7871/FFFFFF?text=Demo',
    comments: 8,
    likes: 15,
    liked: false,
    bookmarked: false
  },
  {
    id: '4',
    date: 'YYYY.MM.DD',
    tags: ['學習討論'],
    title: '分享我的日文學習心得',
    summary: '學了半年終於感覺到有點進步，跟大家分享一些心路歷程和方法。',
    image: 'https://placehold.co/120x80/F2A74B/FFFFFF?text=Demo',
    comments: 34,
    likes: 88,
    liked: false,
    bookmarked: false
  },
  {
    id: '5',
    date: 'YYYY.MM.DD',
    tags: ['旅遊分享'],
    title: '東京自助旅遊分享',
    summary: '趁著連假去了東京五天，語言能力真的有幫到我！分享一些實戰心得。',
    comments: 17,
    likes: 55,
    liked: false,
    bookmarked: false
  },
  {
    id: '6',
    date: 'YYYY.MM.DD',
    tags: ['投票'],
    title: '【投票】下期遊學團目的地',
    summary: '請大家投票選擇下期遊學團的目的地！選項包括：東京、大阪、京都、福岡。',
    comments: 42,
    likes: 97,
    liked: false,
    bookmarked: false
  },
])

const tagCategoryMap: Record<string, Tab> = {
  '課程公告': '課程公告',
  '學習討論': '學習討論',
  '旅遊分享': '旅遊分享',
  '學習方式': '學習方式',
  '疑難困惑': '疑難困惑',
  '投票': '投票',
}

const filteredPosts = computed(() => {
  if (activeTab.value === '全部主題') return posts.value
  return posts.value.filter(p => p.tags.some(t => tagCategoryMap[t] === activeTab.value))
})

const tagColorMap: Record<string, string> = {
  '課程公告': 'bg-complementary-2',
  '聚樂部':   'bg-secondary-2',
  '疑難困惑': 'bg-primary-1',
  '學習方式': 'bg-secondary-1',
  '學習討論': 'bg-complementary-1',
  '旅遊分享': 'bg-brown-4',
  '投票':     'bg-brown-3',
}

const tagColor = (tag: string) => tagColorMap[tag] ?? 'bg-brown-6'
</script>
