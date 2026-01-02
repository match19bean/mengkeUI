<template>
  <div class="flex min-h-screen max-h-screen bg-brown-10">
    <!-- 左側功能列 -->
    <BaseSidebar 
      v-if="!hideSidebar"
      user-name="訪客模式"
      :current-path="currentPath"
      user-avatar=""
      :menu-items="sidebarMenuItems"
      @navigate="handleNavigate"
      class="flex-shrink-0"
      style="flex-basis: clamp(270px, 15%, 400px);"
    />

    <!-- 主要內容區 -->
    <main class="flex-1 overflow-y-auto h-screen">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)
const hideSidebar = computed(() => ['/login', '/signup'].includes(route.path))

const sidebarMenuItems = [
  {
    name: '主界面',
    path: '/',
    expandable: true,
    children: [
      { name: '聚樂部', path: '/club', locked: false },
      { name: '反轉學習', path: '/flipped-learning', locked: true },
      { name: 'MK大廳', path: '/mk-lobby', locked: false }
    ]
  },
  { name: '個人資料', path: '/profile', icon: '/images/file.svg' },
  { name: '學習諮商室', path: '/consultation', icon: '/images/user-group.svg', locked: true },
  { name: '設定', path: '/settings', icon: '/images/setting-01.svg' }
]

const handleNavigate = (path: string) => {
  router.push(path)
}
</script>
