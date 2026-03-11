<template>
  <header class="flex items-center justify-between gap-4">
    <BaseSearchInput 
      v-model="searchQuery" 
      placeholder="搜尋課程標籤、話題、教材、學習方法或教導等等" 
      :suggestions="suggestions"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

interface Props {
  suggestions?: any[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  suggestions: () => [],
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
  'select': [suggestion: any]
}>()

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleSearchSelect = (suggestion: any) => {
  emit('select', suggestion)
  if (suggestion && suggestion.url && suggestion.selectable !== false) {
    router.push(suggestion.url)
  }
}
</script>
