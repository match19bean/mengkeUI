<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="absolute opacity-0 w-0 h-0 peer"
      @change="handleChange"
    />
    <span :class="trackClasses">
      <span :class="thumbClasses"></span>
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

const trackClasses = computed(() => {
  const baseClasses = 'relative inline-block w-12 h-6 rounded-full transition-all duration-250'
  const normalClasses = 'bg-brown-6 peer-checked:bg-primary-1'
  const disabledClasses = 'opacity-50 cursor-not-allowed'
  
  return [
    baseClasses,
    normalClasses,
    props.disabled ? disabledClasses : ''
  ].filter(Boolean).join(' ')
})

const thumbClasses = computed(() => {
  const baseClasses = 'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-250'
  const checkedClasses = props.modelValue ? 'translate-x-6' : ''
  
  return [baseClasses, checkedClasses].filter(Boolean).join(' ')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
