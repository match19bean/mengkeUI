<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="absolute opacity-0 w-0 h-0 peer"
      @change="handleChange"
    />
    <span :class="checkboxClasses">
      <svg
        v-if="modelValue"
        class="w-3 h-3"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3334 4L6.00002 11.3333L2.66669 8"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="label" class="text-body text-brown-1">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center w-5 h-5 border-2 rounded-sm bg-white transition-all duration-250'
  const normalClasses = 'border-brown-5 peer-checked:bg-primary-1 peer-checked:border-primary-1 peer-hover:border-brown-3 peer-focus:ring-4 peer-focus:ring-primary-1/20'
  const disabledClasses = 'opacity-50 cursor-not-allowed'
  
  return [
    baseClasses,
    normalClasses,
    props.disabled ? disabledClasses : ''
  ].filter(Boolean).join(' ')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
