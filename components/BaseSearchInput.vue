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
        @focus="showDropdown = true"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-[460px] h-[50px] pl-16 pr-6 bg-white',
          'text-body text-brown-1 placeholder:text-brown-5',
          'border-2 transition-all duration-200',
          disabled 
            ? 'border-transparent text-brown-6 cursor-not-allowed opacity-60'
            : showDropdown && filteredSuggestions.length > 0
              ? 'rounded-t-[50px] border-transparent hover:border-brown-8 focus:border-brown-2 focus:outline-none'
              : 'rounded-[50px] border-transparent hover:border-brown-8 focus:border-brown-2 focus:outline-none'
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
      class="absolute w-full bg-cream rounded-b-[16px] border-2 border-t-0 border-brown-2 shadow-lg overflow-hidden z-10"
    >
      <div class="max-h-[280px] overflow-y-auto">
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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜尋',
  disabled: false,
  suggestions: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [suggestion: SearchSuggestion]
}>()

const inputRef = ref<HTMLInputElement>()
const showDropdown = ref(false)

const filteredSuggestions = computed(() => {
  if (!props.modelValue) return []
  
  return props.suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(props.modelValue.toLowerCase())
  )
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  showDropdown.value = true
}

const handleBlur = () => {
  // 延遲關閉，讓點擊事件能夠觸發
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectSuggestion = (suggestion: SearchSuggestion) => {
  if (suggestion.disabled) return
  
  emit('update:modelValue', suggestion.title)
  emit('select', suggestion)
  showDropdown.value = false
  inputRef.value?.blur()
}

function highlightMatch(text: string, keyword: string) {
  if (!keyword) return [{ text, match: false }]
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part => ({ text: part, match: part.toLowerCase() === keyword.toLowerCase() }))
}
</script>
