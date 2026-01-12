<template>
  <div class="relative w-full">
   
    <div class="relative">
      <!-- 搜尋圖示 -->
      <div class="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- 輸入框 -->
      <input
        ref="inputRef"
        :value="modelValue"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="showDropdown = true"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-[460px] h-[50px] pl-16 pr-6 bg-white',
          'text-body text-brown-1 placeholder:text-brown-5',
          'border-2 rounded-[50px] transition-all duration-200',
          disabled 
            ? 'border-transparent text-brown-6 cursor-not-allowed opacity-60'
            : 'border-transparent hover:border-brown-8 focus:border-brown-2 focus:outline-none'
        ]"
      />

      <!-- Disable 鎖頭圖示 -->
      <div 
        v-if="disabled"
        class="absolute right-6 top-1/2 -translate-y-1/2 text-brown-6"
      >
        <img src="/images/lock.svg" alt="locked" width="16" height="20" class="text-brown-6" />
      </div>
    </div>

    <!-- 下拉建議列表 -->
    <div
      v-if="showDropdown && filteredSuggestions.length > 0"
      class="absolute w-[460px] bg-white rounded-[16px] shadow-lg overflow-hidden z-10"
    >
      <div class="max-h-[280px] w-[460px] overflow-y-auto">
        <button
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          @mousedown.prevent="selectSuggestion(suggestion)"
          :disabled="suggestion.disabled"
          :class="[
            'w-full px-6 py-4 text-left flex items-center justify-between transition-colors',
            suggestion.disabled
              ? 'text-brown-6 cursor-not-allowed opacity-60'
              : 'text-brown-1 hover:bg-brown-9 focus:bg-brown-8 cursor-pointer'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="text-base">
              <template v-if="props.modelValue">
                <template v-for="(part, i) in highlightMatch(suggestion.title, props.modelValue)">
                  <span v-if="part.match" class="font-bold text-brown-1">{{ part.text }}</span>
                  <span v-else>{{ part.text }}</span>
                </template>
              </template>
              <template v-else>
                {{ suggestion.title }}
              </template>
            </span>
            <span 
              v-if="suggestion.badge"
              :class=" [
                'px-2.5 py-0.5 rounded-full text-xs font-medium',
                suggestion.badgeColor === 'primary' ? 'bg-brown-1 text-cream' :
                suggestion.badgeColor === 'secondary' ? 'bg-complementary-2 text-cream' :
                'bg-primary-1 text-cream'
              ]"
            >
              {{ suggestion.badge }}
            </span>
          </div>
          
          <!-- Disable 鎖頭圖示 -->
          <img 
            v-if="suggestion.disabled"
            src="/images/lock.svg" 
            alt="locked" 
            width="16" 
            height="20" 
            class="text-brown-6"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SearchSuggestion {
  title: string
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'alert'
  disabled?: boolean
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  suggestions?: SearchSuggestion[]
  useApi?: boolean
  searchDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜尋',
  disabled: false,
  suggestions: () => [],
  useApi: false,
  searchDelay: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [suggestion: SearchSuggestion]
  'search': [query: string]
}>()

const inputRef = ref<HTMLInputElement>()
const showDropdown = ref(false)
const apiSuggestions = ref<string[]>([])
const searchTimeout = ref<ReturnType<typeof setTimeout>>()

// 如果使用 API，初始化 searchStore
const searchStore = props.useApi ? useSearchStore() : null

// Debug: 在組件掛載時輸出 props
onMounted(() => {
  console.log('BaseSearchInput mounted, useApi:', props.useApi)
  console.log('searchStore:', searchStore)
})

const filteredSuggestions = computed(() => {
  console.log('計算 filteredSuggestions, modelValue:', props.modelValue)
  console.log('useApi:', props.useApi)
  console.log('apiSuggestions:', apiSuggestions.value)
  
  if (!props.modelValue) return []
  
  // 如果使用 API 且有 API 建議
  if (props.useApi && apiSuggestions.value.length > 0) {
    const result = apiSuggestions.value.map(title => ({ 
      title,
      badge: undefined,
      badgeColor: undefined,
      disabled: false
    } as SearchSuggestion))
    console.log('返回 API 建議:', result)
    return result
  }
  
  // 否則使用本地建議
  const localResult = props.suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(props.modelValue.toLowerCase())
  )
  console.log('返回本地建議:', localResult)
  return localResult
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  showDropdown.value = true

  console.log('handleInput 被觸發, value:', value, 'useApi:', props.useApi)

  // 如果使用 API，延遲獲取建議
  if (props.useApi && value.trim().length >= 2) {
    console.log('準備呼叫 API...')
    
    // 清除之前的計時器
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    // 設置新的計時器
    searchTimeout.value = setTimeout(async () => {
      console.log('開始呼叫 API, searchStore:', searchStore)
      
      if (!searchStore) {
        console.error('searchStore 未初始化')
        return
      }
      
      try {
        const response = await searchStore.getSearchSuggestions({
          query: value,
          limit: 5
        })
        
        console.log('API 回應:', response)
        
        if (response.success) {
          apiSuggestions.value = response.data
          console.log('設定 apiSuggestions:', apiSuggestions.value)
        }
      } catch (error) {
        console.error('獲取搜尋建議失敗:', error)
        apiSuggestions.value = []
      }
    }, props.searchDelay)
  } else if (value.trim().length < 2) {
    console.log('輸入長度不足 2，清空建議')
    // 清空 API 建議
    apiSuggestions.value = []
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search', props.modelValue)
    showDropdown.value = false
    inputRef.value?.blur()
  }
}

const handleBlur = () => {
  // 延遲關閉，讓點擊事件能夠觸發
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectSuggestion = async (suggestion: SearchSuggestion) => {
  if (suggestion.disabled) return
  
  emit('update:modelValue', suggestion.title)
  emit('select', suggestion)
  emit('search', suggestion.title)
  
  // 如果使用 API，选择后重新查询
  if (props.useApi && searchStore && suggestion.title.trim().length >= 2) {
    try {
      const response = await searchStore.getSearchSuggestions({
        query: suggestion.title,
        limit: 5
      })
      
      if (response.success) {
        apiSuggestions.value = response.data
        showDropdown.value = true
        return
      }
    } catch (error) {
      console.error('重新获取搜索建议失败:', error)
    }
  }
  
  showDropdown.value = false
  inputRef.value?.blur()
}

function highlightMatch(text: string, keyword: string) {
  if (!keyword) return [{ text, match: false }]
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part => ({ text: part, match: part.toLowerCase() === keyword.toLowerCase() }))
}

// 清理計時器
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
