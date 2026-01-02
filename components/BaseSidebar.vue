<template>
  <aside class="w-auto bg-cream border-r border-brown-8 flex flex-col h-screen">
    <!-- 產品 LOGO -->
    <div class="pt-6">
      <button @click="$emit('navigate', '/')" class="flex items-center justify-center w-full hover:opacity-80 transition-opacity">
        <img 
          src="/images/logo.png" 
          alt="Product Logo" 
          class="h-auto w-full max-w-[163px] object-contain"
          style="aspect-ratio: 6.87;"
        />
      </button>
    </div>

    <!-- 用戶資訊區 -->
    <div class="p-6 flex items-center gap-4">
      <div class="w-16 h-16 rounded-full overflow-hidden bg-brown-8 flex-shrink-0">
        <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-brown-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h2 class="text-h4 font-bold text-brown-1 truncate">{{ displayName }}</h2>
          <p class="text-title font-bold text-brown-1">{{ greeting }}</p>
        </div>
      </div>
    </div>

    <!-- 選單區 -->
    <nav class="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <!-- 動態選單項目 -->
        <template v-for="item in menuItems" :key="item.name">
            <!-- 可展開的選單 -->
            <div v-if="item.expandable && item.children" class="mb-2">
            <button
                @click="toggleMenu(item.name)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brown-1 hover:bg-brown-9 transition-colors caption"
                :class="{ 'bg-brown-9': isMenuExpanded(item.name) }"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="flex-1 text-left font-semibold text-subtitle">{{ item.name }}</span>
                <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': isMenuExpanded(item.name) }"
                >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <!-- 子選單 -->
            <transition name="submenu">
                <div v-if="isMenuExpanded(item.name)" class="ml-4 mt-1 space-y-1">
                <button
                    v-for="child in item.children"
                    :key="child.name"
                    @click="$emit('navigate', child.path)"
                    class="relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-brown-9/50 transition-colors"
                    :class="[
                      { 'pointer-events-none': child.locked },
                      child.path === currentPath ? 'bg-brown-1/10 text-brown-1 font-bold' : ''
                    ]"
                    :style="child.path !== currentPath ? 'color: #2422208F' : ''"
                >
                    <span class="flex-1 text-left text-caption">{{ child.name }}</span>
                    <img v-if="child.locked" src="/images/sidebar-lock.svg" alt="locked" width="16" height="16" class="flex-shrink-0" />
                </button>
                </div>
            </transition>
            </div>

            <!-- 一般選單項目 -->
            <button
            v-else
            @click="$emit('navigate', item.path)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brown-9 transition-colors mb-2"
            :class="[
              { 'pointer-events-none': item.locked },
              item.path === currentPath ? 'bg-brown-1/10 text-brown-1 font-bold' : 'text-brown-1'
            ]"
            :style="item.path !== currentPath ? 'color: #2422208F' : ''"
            >
            <img v-if="item.icon" :src="item.icon" :alt="item.name" width="24" height="24" class="flex-shrink-0" />
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span class="flex-1 text-left font-semibold text-subtitle">{{ item.name }}</span>
            <img v-if="item.locked" src="/images/sidebar-lock.svg" alt="locked" width="20" height="20" class="flex-shrink-0" />
            </button>
        </template>
        
        <!-- 與專屬CAT聯繫按鈕 -->
        <div class="px-4 py-4 border-t border-brown-8">
        <button
            @click="$emit('navigate', '/cat-lesson')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:text-brown-1 hover:bg-brown-9 transition-colors"
            :class="{ 'pointer-events-none': catLessonLocked }"
            style="color: #2422208F"
        >
            <span class="flex-1 text-left text-subtitle">與專屬CAT聯繫</span>
            <img v-if="catLessonLocked" src="/images/sidebar-lock.svg" alt="locked" width="20" height="20" class="flex-shrink-0" />
        </button>
        </div>
    </nav>    

    <!-- 底部區塊：進行學習任務 -->
    <div class="px-4 pb-6 flex-shrink-0">

       <!-- 插圖 -->
      <ClientOnly>
        <div class="">
          <img src="/images/Layer_4.png" alt="學習插圖" class="w-full h-auto object-contain" />
        </div>
      </ClientOnly>
      <div class="bg-gradient-to-br bg-[#FF9B7A] to-[#FF7A5C] rounded-[24px] p-6 relative overflow-hidden">               
        <!-- 按鈕 -->
        <button
          @click="$emit('navigate', '/learning-task')"
          :disabled="learningTaskLocked"
          class="w-full bg-white text-brown-1 font-bold text-base py-4 px-6 rounded-[16px] transition-colors flex items-center justify-center gap-2"
          :class="learningTaskLocked ? 'opacity-75' : 'hover:bg-brown-9'"
        >
          <span class="text-center text-subtitle">進行學習任務</span>
          <img v-if="learningTaskLocked" src="/images/sidebar-lock.svg" alt="locked" width="14" height="16" class="flex-shrink-0" />
        </button>
      </div>
    </div>
  </aside>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'

interface MenuItem {
  name: string
  path: string
  icon?: string
  locked?: boolean
  children?: MenuItem[]
  expandable?: boolean
}

interface Props {
  userName?: string
  userAvatar?: string
  menuItems?: MenuItem[]
  catLessonLocked?: boolean
  learningTaskLocked?: boolean
  currentPath?: string
}

const props = withDefaults(defineProps<Props>(), {
  userName: '',
  userAvatar: '',
  currentPath: '',
  menuItems: () => [
    {
      name: '主界面',
      path: '/main',
      expandable: true,
      children: [
        { name: '聚樂部', path: '/club', locked: true },
        { name: '反轉學習', path: '/flipped-learning', locked: true },
        { name: 'MK大廳', path: '/mk-lobby', locked: true }
      ]
    },
    { name: '個人資料', path: '/profile', icon: '/images/file.svg' },
    { name: '學習諮商室', path: '/consultation', icon: '/images/user-group.svg', locked: true },
    { name: '設定', path: '/settings', icon: '/images/setting-01.svg' }
  ],
  catLessonLocked: true,
  learningTaskLocked: true
})

defineEmits<{
  navigate: [path: string]
}>()

const expandedMenus = ref<Set<string>>(new Set(['主界面']))

const displayName = computed(() => {
  return props.userName || '訪客模式'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '哈囉！'
  if (hour >= 12 && hour < 18) return '午安！'
  if (hour >= 18 && hour < 22) return '晚安！'
  return '哈囉！'
})

const toggleMenu = (menuName: string) => {
  if (expandedMenus.value.has(menuName)) {
    expandedMenus.value.delete(menuName)
  } else {
    expandedMenus.value.add(menuName)
  }
}

const isMenuExpanded = (menuName: string) => {
  return expandedMenus.value.has(menuName)
}
</script>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
