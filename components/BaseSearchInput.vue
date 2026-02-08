<template>
  <div class="relative w-full">
    <div class="relative">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <input
        ref="inputRef"
        :value="modelValue"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="openDropdown"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-[460px] h-[50px] pl-12 pr-6 bg-white text-body text-brown-1 placeholder:text-brown-5 border-2 rounded-[50px] transition-all duration-200"
        :class="disabled ? 'border-transparent text-brown-6 cursor-not-allowed opacity-60' : 'border-transparent hover:border-brown-8 focus:border-brown-2 focus:outline-none'"
        role="combobox"
        :aria-expanded="showDropdown"
        :aria-controls="dropdownId"
        :aria-autocomplete="'list'"
      />
    </div>

    <div
      v-if="showDropdown && flattenedSuggestions.length > 0"
      :id="dropdownId"
      role="listbox"
      class="absolute w-[460px] bg-white rounded-[16px] shadow-lg overflow-hidden z-10 mt-2"
    >
      <div class="max-h-[300px] overflow-y-auto">
        <template v-for="(group, gIndex) in groupedSuggestions" :key="group.type || gIndex">
          <div class="px-4 py-2 bg-brown-9 text-sm text-brown-5 font-medium">{{ group.type || 'Other' }}</div>
          <div>
            <button
              v-for="(item, index) in group.items"
              :key="group.type + '-' + index"
              @mousedown.prevent="selectSuggestion(item)"
              @mousemove="setHover(flatIndexMap[group.type]?.[index] ?? -1)"
              :disabled="!item.selectable"
              :class="[
                'w-full px-6 py-3 text-left flex items-center justify-between transition-colors',
                !item.selectable ? 'text-brown-6 cursor-not-allowed opacity-60' : 'text-brown-1 hover:bg-brown-9 focus:bg-brown-8 cursor-pointer',
                flatIndexMap[group.type]?.[index] === highlightedIndex ? 'bg-brown-8' : ''
              ]"
              role="option"
              :aria-selected="flatIndexMap[group.type]?.[index] === highlightedIndex"
            >
              <div class="flex flex-col">
                <span class="text-base">
                  <template v-for="(part, i) in highlightMatch(item.title, modelValue)" :key="i">
                    <span v-if="part.match" class="font-bold">{{ part.text }}</span>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
                <a v-if="item.url" :href="item.url" class="text-xs text-brown-5">{{ item.url }}</a>
              </div>
              <div class="text-xs text-brown-5">{{ item.type }}</div>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

interface Suggestion {
  title: string
  url?: string
  type?: string
  selectable?: boolean
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  suggestions?: Suggestion[]
  useApi?: boolean
  apiEndpoint?: string
  searchDelay?: number
  minChars?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜尋',
  disabled: false,
  suggestions: () => [],
  useApi: false,
  apiEndpoint: '',
  searchDelay: 300,
  minChars: 2
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', suggestion: Suggestion): void
  (e: 'search', query: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const showDropdown = ref(false)
const localSuggestions = ref<Suggestion[]>(props.suggestions || [])
const remoteSuggestions = ref<Suggestion[]>([])
const searchTimer = ref<number | undefined>(undefined)
let abortController: AbortController | null = null

const dropdownId = `search-dropdown-${Math.random().toString(36).slice(2,9)}`

watch(() => props.suggestions, (v) => { localSuggestions.value = v || [] })

const allSuggestions = computed(() => {
  if (props.useApi) return remoteSuggestions.value
  return localSuggestions.value
})

const groupedSuggestions = computed(() => {
  const map = new Map<string, Suggestion[]>()
  for (const item of allSuggestions.value) {
    const t = item.type || 'Others'
    if (!map.has(t)) map.set(t, [])
    map.get(t)!.push(item)
  }
  return Array.from(map.entries()).map(([type, items]) => ({ type, items }))
})

const flattenedSuggestions = computed(() => allSuggestions.value)
const highlightedIndex = ref<number>(-1)
const flatIndexMap: Record<string, number[]> = {}

function rebuildFlatIndexMap() {
  let idx = 0
  flatIndexMap && Object.keys(flatIndexMap).forEach(k => delete flatIndexMap[k])
  for (const g of groupedSuggestions.value) {
    if (!flatIndexMap[g.type]) flatIndexMap[g.type] = []
    for (let i = 0; i < g.items.length; i++) {
      if (!flatIndexMap[g.type]) flatIndexMap[g.type] = []
      flatIndexMap[g.type]!.push(idx)
      idx++
    }
  }
}

watch(groupedSuggestions, () => {
  rebuildFlatIndexMap()
})

function openDropdown() {
  showDropdown.value = true
  // 聚焦時不主動顯示建議，需輸入文字才顯示
}

function handleInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
  showDropdown.value = true
  highlightedIndex.value = -1

  if (props.useApi && props.apiEndpoint && v.trim().length >= props.minChars) {
    if (searchTimer.value) window.clearTimeout(searchTimer.value)
    searchTimer.value = window.setTimeout(() => fetchSuggestions(v), props.searchDelay)
  } else if (!props.useApi) {
    const q = v.trim().toLowerCase()
    if (!q) {
      // 未輸入時不顯示建議
      remoteSuggestions.value = []
      return
    }
    remoteSuggestions.value = localSuggestions.value.filter(s => s.title.toLowerCase().includes(q))
  }
}

async function fetchSuggestions(query: string) {
  if (!props.apiEndpoint) return
  if (abortController) abortController.abort()
  abortController = new AbortController()
  try {
    const url = `${props.apiEndpoint}${props.apiEndpoint.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`
    const res = await fetch(url, { signal: abortController.signal })
    if (!res.ok) {
      remoteSuggestions.value = []
      return
    }
    const data = await res.json()
    const items: Suggestion[] = Array.isArray(data) ? data : data.items || []
    remoteSuggestions.value = items.map(it => ({ selectable: true, ...it }))
  } catch (err) {
    if ((err as any).name === 'AbortError') return
    remoteSuggestions.value = []
  }
}

function handleKeydown(e: KeyboardEvent) {
  const total = flattenedSuggestions.value.length
  if (!showDropdown.value || total === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    let next = highlightedIndex.value + 1
    if (next >= total) next = 0
    highlightedIndex.value = next
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    let prev = highlightedIndex.value - 1
    if (prev < 0) prev = total - 1
    highlightedIndex.value = prev
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = flattenedSuggestions.value[highlightedIndex.value]
    if (item && item.selectable !== false) selectSuggestion(item)
  } else if (e.key === 'Escape') {
    showDropdown.value = false
  }
}

function setHover(index: number) {
  highlightedIndex.value = index
}

function handleBlur() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function selectSuggestion(item: Suggestion) {
  if (item.selectable === false) return
  emit('update:modelValue', item.title)
  emit('select', item)
  emit('search', item.title)
  showDropdown.value = false
  inputRef.value?.blur()
}

function highlightMatch(text: string, keyword = '') {
  if (!keyword) return [{ text, match: false }]
  const esc = keyword.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
  const regex = new RegExp(`(${esc})`, 'gi')
  const parts = text.split(regex)
  return parts.map(p => ({ text: p, match: p.toLowerCase() === keyword.toLowerCase() }))
}

onUnmounted(() => {
  if (searchTimer.value) window.clearTimeout(searchTimer.value)
  if (abortController) abortController.abort()
})
</script>
  inputRef.value?.blur()
