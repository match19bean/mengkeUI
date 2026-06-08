<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue && post"
        class="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
        @click.self="$emit('update:modelValue', false)"
        @wheel.self.prevent
        @touchmove.self.prevent
      >
        <div class="flex h-[96vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-t-[28px] bg-cream shadow-2xl sm:rounded-[28px]">
          <!-- ── 頂部固定 Header（關閉 + 標題 + 標籤） ── -->
          <div class="flex shrink-0 items-center gap-2 border-b border-brown-8/40 px-4 py-3">
            <span class="font-genyogothic text-xl font-black text-brown-1 shrink-0">{{ post.title }}</span>
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-cream"
                :class="tagColor(tag)"
              >
                {{ tag }}
              </span>
            </div>
            <button
              type="button"
              class="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brown-3 transition hover:bg-brown-9"
              @click="$emit('update:modelValue', false)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4l8 8" />
                <path d="M12 4l-8 8" />
              </svg>
            </button>
          </div>

          <!-- ── 捲動區 ── -->
          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <!-- 作者 -->
            <div class="flex items-center gap-2.5 px-6 pt-4 pb-3">
              <div class="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brown-7">
                <img v-if="post.avatar" :src="post.avatar" :alt="post.author" class="h-full w-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-bold text-brown-2">{{ post.author ?? '使用者暱稱' }}</p>
                <p class="text-xs text-brown-5">{{ post.date }}</p>
              </div>
            </div>

            <!-- 文章圖片 -->
            <div v-if="post.image" class="flex w-full justify-center">
              <img :src="post.image" :alt="post.title" class="h-[420px] w-[80%] rounded-2xl object-cover" />
            </div>
            <div v-else class="mx-6 h-[180px] rounded-2xl bg-brown-8 flex items-center justify-center">
              <span class="text-sm text-brown-5">文章圖片</span>
            </div>

            <!-- 內文 + 互動列 -->
            <div class="px-6 pt-5 pb-4">
              <!-- 內文 -->
              <div class="text-sm leading-7 text-brown-3 whitespace-pre-line">{{ post.body ?? post.summary }}</div>

              <!-- 互動列 -->
              <div class="mt-5 flex items-center gap-5 border-t border-brown-8/60 pt-4">
                <button type="button" class="flex items-center gap-1.5 text-xs text-brown-5 transition hover:text-primary-1" @click="$emit('like', post.id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="post.liked ? 'text-primary-1' : ''">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span :class="post.liked ? 'text-primary-1 font-bold' : ''">{{ post.likes + (post.liked ? 1 : 0) }}</span>
                </button>
                <button type="button" class="flex items-center gap-1.5 text-xs text-brown-5 transition hover:text-brown-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {{ comments.length }} 則留言
                </button>
                <button type="button" class="flex items-center gap-1.5 text-xs text-brown-5 transition hover:text-brown-2" @click="$emit('bookmark', post.id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" :fill="post.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  收藏
                </button>
              </div>
            </div>

            <!-- ── 留言區 ── -->
            <div class="border-t border-brown-8/60 px-6 pt-4 pb-6">
              <!-- 排序 tabs -->
              <div class="mb-4 flex items-center gap-2">
                <button
                  v-for="sort in ['熱門', '最新', '最舊']"
                  :key="sort"
                  type="button"
                  class="rounded-full px-3 py-1 text-xs font-bold transition"
                  :class="activeSort === sort ? 'bg-brown-1 text-cream' : 'bg-brown-9 text-brown-3 hover:bg-brown-8'"
                  @click="activeSort = sort"
                >
                  {{ sort }}
                </button>
              </div>

              <!-- 留言輸入 -->
              <div class="mb-5 flex items-start gap-3">
                <div class="h-8 w-8 shrink-0 rounded-full bg-brown-7" />
                <div class="flex-1 overflow-hidden rounded-xl border border-brown-8 bg-white px-3 py-2">
                  <input
                    v-model="newComment"
                    type="text"
                    placeholder="留言..."
                    class="w-full bg-transparent text-sm text-brown-2 outline-none placeholder:text-brown-6"
                    @keydown.enter="submitComment"
                  />
                </div>
                <button
                  type="button"
                  class="shrink-0 rounded-xl bg-primary-1 px-3 py-2 text-xs font-bold text-cream transition hover:opacity-85 disabled:opacity-40"
                  :disabled="!newComment.trim()"
                  @click="submitComment"
                >
                  送出
                </button>
              </div>

              <!-- 留言列表 -->
              <div class="space-y-5">
                <div v-for="comment in sortedComments" :key="comment.id" class="flex gap-3">
                  <!-- 頭像 -->
                  <div class="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-brown-7">
                    <img v-if="comment.avatar" :src="comment.avatar" :alt="comment.author" class="h-full w-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-xs font-bold text-brown-2">{{ comment.author }}</span>
                      <span
                        v-if="comment.role"
                        class="rounded-full px-2 py-0.5 text-[10px] font-bold text-cream"
                        :class="comment.role === '教師' ? 'bg-complementary-1' : 'bg-secondary-1'"
                      >
                        {{ comment.role }}
                      </span>
                      <span class="text-[11px] text-brown-6">{{ comment.date }}</span>
                    </div>
                    <p class="mt-1 text-sm leading-relaxed text-brown-3">{{ comment.text }}</p>
                    <div class="mt-1.5 flex items-center gap-3">
                      <button
                        type="button"
                        class="flex items-center gap-1 text-[11px] transition"
                        :class="comment.liked ? 'text-primary-1 font-bold' : 'text-brown-5 hover:text-primary-1'"
                        @click="comment.liked = !comment.liked"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" :fill="comment.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {{ comment.likes + (comment.liked ? 1 : 0) }}
                      </button>
                      <button type="button" class="text-[11px] text-brown-5 transition hover:text-brown-2">回覆</button>
                    </div>

                    <!-- 巢狀回覆 -->
                    <div v-if="comment.replies?.length" class="mt-3 space-y-3 border-l-2 border-brown-8 pl-3">
                      <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-2">
                        <div class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-brown-7">
                          <img v-if="reply.avatar" :src="reply.avatar" :alt="reply.author" class="h-full w-full object-cover" />
                        </div>
                        <div class="min-w-0 flex-1">
                          <div class="flex flex-wrap items-center gap-1.5">
                            <span class="text-[11px] font-bold text-brown-2">{{ reply.author }}</span>
                            <span
                              v-if="reply.role"
                              class="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-cream"
                              :class="reply.role === '教師' ? 'bg-complementary-1' : 'bg-secondary-1'"
                            >
                              {{ reply.role }}
                            </span>
                            <span class="text-[10px] text-brown-6">{{ reply.date }}</span>
                          </div>
                          <p class="mt-0.5 text-xs leading-relaxed text-brown-3">{{ reply.text }}</p>
                          <button
                            type="button"
                            class="mt-1 flex items-center gap-1 text-[11px] transition"
                            :class="reply.liked ? 'text-primary-1 font-bold' : 'text-brown-5 hover:text-primary-1'"
                            @click="reply.liked = !reply.liked"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" :fill="reply.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {{ reply.likes + (reply.liked ? 1 : 0) }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'

interface Reply {
  id: string
  author: string
  avatar?: string
  role?: string
  date: string
  text: string
  likes: number
  liked: boolean
}

interface Comment {
  id: string
  author: string
  avatar?: string
  role?: string
  date: string
  text: string
  likes: number
  liked: boolean
  replies?: Reply[]
}

interface PostDetail {
  id: string
  title: string
  summary: string
  body?: string
  image?: string
  author?: string
  avatar?: string
  date: string
  tags: string[]
  likes: number
  liked: boolean
  bookmarked: boolean
}

const props = defineProps<{
  modelValue: boolean
  post: PostDetail | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'like': [id: string]
  'bookmark': [id: string]
}>()

let previousBodyOverflow = ''
let previousMainOverflowY = ''

const lockBackgroundScroll = (locked: boolean) => {
  if (typeof document === 'undefined') return

  const mainEl = document.querySelector('main') as HTMLElement | null

  if (locked) {
    previousBodyOverflow = document.body.style.overflow
    previousMainOverflowY = mainEl?.style.overflowY ?? ''

    document.body.style.overflow = 'hidden'
    if (mainEl) {
      mainEl.style.overflowY = 'hidden'
    }
    return
  }

  document.body.style.overflow = previousBodyOverflow
  if (mainEl) {
    mainEl.style.overflowY = previousMainOverflowY
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    lockBackgroundScroll(isOpen)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  lockBackgroundScroll(false)
})

const activeSort = ref<'熱門' | '最新' | '最舊'>('熱門')
const newComment = ref('')

// Mock 留言資料
const comments = ref<Comment[]>([
  {
    id: 'c1',
    author: '小魚不能翻譯',
    avatar: 'https://placehold.co/40x40/4285F4/FFFFFF?text=魚',
    date: '2025年12月31日 14:00',
    text: '謝謝分享！這次的課程變動對我影響很大，因為我周三下午都有其他行程⋯⋯ 希望下次可以提前一個月通知！',
    likes: 3,
    liked: false,
    replies: [
      {
        id: 'r1',
        author: 'MK技務外語+',
        avatar: 'https://placehold.co/40x40/E8996D/FFFFFF?text=MK',
        role: '教師',
        date: '2025年12月31日 15:30',
        text: '我們會盡力提前公告，感謝您的反饋！',
        likes: 2,
        liked: false,
      }
    ]
  },
  {
    id: 'c2',
    author: '阿音學英文',
    avatar: 'https://placehold.co/40x40/3E7871/FFFFFF?text=音',
    role: '學員',
    date: '2025年12月31日 16:00',
    text: '日文時間的調整對我很方便，謝謝老師體諒我們工作族！那補課的部分可以線上嗎？',
    likes: 5,
    liked: false,
    replies: []
  },
  {
    id: 'c3',
    author: 'Miller',
    avatar: 'https://placehold.co/40x40/6B3F2E/FFFFFF?text=Mi',
    date: '2025年12月31日 18:00',
    text: '課程安排很用心，感謝老師❤️ 期待下個月的進度！',
    likes: 3,
    liked: false,
    replies: []
  },
])

const sortedComments = computed(() => {
  const list = [...comments.value]
  if (activeSort.value === '熱門') return list.sort((a, b) => b.likes - a.likes)
  if (activeSort.value === '最新') return list
  return [...list].reverse()
})

const submitComment = () => {
  if (!newComment.value.trim()) return
  comments.value.push({
    id: `c${Date.now()}`,
    author: '我',
    date: '剛剛',
    text: newComment.value.trim(),
    likes: 0,
    liked: false,
    replies: []
  })
  newComment.value = ''
}

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
