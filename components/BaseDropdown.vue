<template>
  <div class="relative inline-block w-full">
    <label v-if="label" class="block text-subtitle text-brown-1 font-medium mb-1">{{ label }}</label>
    <div
      :class="selectClasses"
      @click="toggleDropdown"
    >
      <span class="text-body text-brown-1">{{ displayValue }}</span>
      <svg
        :class="iconClasses"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div v-if="isOpen && !disabled" class="absolute top-full mt-1 left-0 right-0 bg-white border border-brown-6 rounded-sm shadow-lg max-h-50 overflow-y-auto z-50">
      <div
        v-for="option in options"
        :key="option.value"
        :class="getItemClasses(option)"
        @click="selectOption(option)"
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
  label?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '請選擇',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const selectClasses = computed(() => {
  const baseClasses = 'flex items-center justify-between px-3 py-2.5 bg-white border rounded-sm cursor-pointer transition-all duration-250'
  const normalClasses = 'border-brown-6 hover:border-brown-5'
  const openClasses = 'border-secondary-1 ring-4 ring-secondary-1/10'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60'
  
  return [
    baseClasses,
    props.disabled ? disabledClasses : (isOpen.value ? openClasses : normalClasses)
  ].filter(Boolean).join(' ')
})

const iconClasses = computed(() => {
  const baseClasses = 'transition-transform duration-250 text-brown-5'
  const rotateClasses = isOpen.value ? 'rotate-180' : ''
  
  return [baseClasses, rotateClasses].filter(Boolean).join(' ')
})

const getItemClasses = (option: Option) => {
  const baseClasses = 'px-3 py-2.5 text-body text-brown-1 cursor-pointer transition-colors duration-150'
  const hoverClasses = 'hover:bg-brown-9'
  const selectedClasses = option.value === props.modelValue ? 'bg-secondary-4 font-semibold' : ''
  
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
