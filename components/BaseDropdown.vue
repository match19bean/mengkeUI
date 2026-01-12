<template>
  <div class="relative inline-block w-full" ref="dropdownRef">
    <div
      :class="selectClasses"
      @click="toggleDropdown"
      tabindex="0"
      @blur="handleBlur"
    >
      <span :class="displayTextClasses">{{ displayValue }}</span>
      <svg
        :class="iconClasses"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div v-if="isOpen && !disabled" class="absolute top-full mt-2 left-0 right-0 bg-[#F8F7F0] rounded-2xl shadow-lg max-h-60 overflow-y-auto z-50 py-2">
      <div
        v-for="option in options"
        :key="option.value"
        :class="getItemClasses(option)"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '請選擇',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const displayTextClasses = computed(() => {
  const isPlaceholder = !props.options.find(opt => opt.value === props.modelValue)
  return isPlaceholder ? 'text-xs text-[#36201080] font-black tracking-[2px]' : 'text-xs text-brown-1 tracking-[2px]'
})

const selectClasses = computed(() => {
  const baseClasses = 'flex items-center justify-between h-[32px] px-4 bg-[#36201019] rounded-[32px] cursor-pointer transition-all duration-250'
  const normalClasses = 'hover:bg-[#36201026] border-0'
  const openClasses = 'bg-[#36201026] border-0'
  const errorClasses = 'border border-alert-1'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60 border-0'
  
  return [
    baseClasses,
    props.disabled ? disabledClasses : props.error ? errorClasses : (isOpen.value ? openClasses : normalClasses)
  ].filter(Boolean).join(' ')
})

const iconClasses = computed(() => {
  const baseClasses = 'transition-transform duration-250 text-brown-6'
  const rotateClasses = isOpen.value ? 'rotate-180' : ''
  
  return [baseClasses, rotateClasses].filter(Boolean).join(' ')
})

const getItemClasses = (option: Option) => {
  const baseClasses = 'px-4 py-2.5 text-xs text-brown-1 cursor-pointer transition-colors duration-150 text-center tracking-[2px]'
  const hoverClasses = 'hover:bg-[#36201019]'
  const selectedClasses = option.value === props.modelValue ? 'bg-[#36201019] font-semibold' : ''
  
  return [baseClasses, hoverClasses, selectedClasses].filter(Boolean).join(' ')
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleBlur = (event: FocusEvent) => {
  // 延遲關閉以允許點擊選項
  setTimeout(() => {
    isOpen.value = false
  }, 200)
}

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
