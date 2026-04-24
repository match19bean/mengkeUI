<template>
  <header class="flex items-center justify-between gap-4">
    <BaseSearchInput 
      v-model="searchQuery" 
      placeholder="搜尋課程標籤、話題、教材、學習方法或教導等等" 
      :suggestions="displaySuggestions"
      @select="handleSearchSelect"
    />
    <div class="flex items-center gap-4">
      <button type="button" class="flex h-6 w-6 items-center justify-center rounded-full">
        <img src="/images/bell.svg" alt="通知" class="h-5 w-5" />
      </button>
      <NuxtLink 
        v-if="!isAuthenticated" 
        to="/login" 
        class="flex h-[18px] w-[18px] items-center justify-center rounded-full"
      >
        <img src="/images/sign.svg" alt="登入" class="h-6 w-6" />
      </NuxtLink>
      <button 
        v-else
        @click="handleLogout"
        type="button" 
        class="flex h-[18px] w-[18px] items-center justify-center rounded-full hover:opacity-80 transition-opacity"
      >
        <img src="/images/sign.svg" alt="登出" class="h-6 w-6" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { getSearchSuggestions, suggestions, pending } = useSearchStore()

// 內部管理搜尋輸入
const searchQuery = ref('')

// 格式化建議以符合 BaseSearchInput 的格式
const displaySuggestions = computed(() => {
  return suggestions.value.map(text => ({
    title: text,
    url: `/search?q=${encodeURIComponent(text)}`,
    type: '搜尋結果',
    badge: '課程',
    badgeColor: 'primary',
    selectable: true
  }))
})

// 簡單的 debounce 實作
let debounceTimer: NodeJS.Timeout | null = null
const debouncedSearch = (query: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(async () => {
    if (query.trim().length >= 2) {
      await getSearchSuggestions({ query, limit: 5 })
    } else {
      suggestions.value = []
    }
  }, 300)
}

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

// 清理定時器
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleSearchSelect = (suggestion: any) => {
  if (suggestion && suggestion.url && suggestion.selectable !== false) {
    router.push(suggestion.url)
  }
}
</script>
