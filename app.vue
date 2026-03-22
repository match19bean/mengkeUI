<template>
  <div class="flex min-h-screen max-h-screen bg-brown-10">
    <!-- 左側功能列 -->
    <BaseSidebar 
      v-if="!hideSidebar"
      :user-name="displayName"
      :current-path="currentPath"
        :user-avatar="user?.value?.avatar || ''"
      :menu-items="sidebarMenuItems"
      :cat-lesson-locked="catLessonLocked"
      :learning-task-locked="learningTaskLocked"
      @navigate="handleNavigate"
      class="flex-shrink-0"
      style="flex-basis: clamp(270px, 15%, 400px);"
    />
    
    <!-- 漸層分隔線 -->
    <div v-if="!hideSidebar" class="w-[1px] opacity-50" style="background: linear-gradient(to bottom, #501C1C00, #432C2C 50%, #501C1C00);"></div>

    <!-- 主要內容區 -->
    <main class="flex-1 overflow-y-auto h-screen">
      <NuxtPage />
    </main>
    
    <!-- 個人資料彈窗 -->
    <ProfilePopup v-model="isProfilePopupOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ProfilePopup from '@/components/ProfilePopup.vue'
import { useProfilePopup } from '@/composables/useProfilePopup'

const route = useRoute()
const router = useRouter()
const { isOpen: isProfilePopupOpen, open: openProfilePopup } = useProfilePopup()
// call useAuth() safely — if it's unavailable during init (e.g. SSR),
// provide fallbacks so `.value` access won't throw
const _auth = (typeof useAuth === 'function' ? useAuth() : null) ?? { user: ref(null), isAuthenticated: ref(false), initAuth: () => {} }
const { user, isAuthenticated, initAuth } = _auth

const currentPath = computed(() => route.path)
const hideSidebar = computed(() => ['/login', '/signup'].includes(route.path))

const displayName = computed(() => {
  if (isAuthenticated?.value && user?.value) {
    return user.value.nickname || user.value.account
  }
  return '訪客模式'
})

// 初始化認證狀態
onMounted(() => {
  initAuth()
})

const catLessonLocked = computed(() => {
  return !isAuthenticated.value
})

const learningTaskLocked = computed(() => {
  return !isAuthenticated.value
})

const sidebarMenuItems = computed(() => {
  const logged = !!isAuthenticated?.value
  return [
    {
      name: '主界面',
      path: '/',
      expandable: true,
      children: [
        { name: '聚樂部', path: '/club', locked: false },
        { name: '反轉學習', path: '/flipped-learning', locked: !logged },
        { name: 'MK大廳', path: '/mk-lobby', locked: false }
      ]
    },
    { name: '個人資料', path: '/profile', icon: '/images/file.svg', locked: !logged },
    { name: '學習諮商室', path: '/consultation', icon: '/images/user-group.svg', locked: !logged },
    { name: '設定', path: '/settings', icon: '/images/setting-01.svg' }
  ]
})

const handleNavigate = (path: string) => {
  if (path === '/profile') {
    openProfilePopup()
  } else {
    router.push(path)
  }
}
</script>
