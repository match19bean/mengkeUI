<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      :name="name"
      class="absolute opacity-0 w-0 h-0 peer"
      @change="handleChange"
    />
    <span :class="radioClasses">
      <span v-if="isChecked" class="w-2.5 h-2.5 rounded-full bg-primary-1"></span>
    </span>
    <span v-if="label" class="text-body text-brown-1">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number | boolean
  value: string | number | boolean
  label?: string
  name?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const radioClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center w-5 h-5 border-2 rounded-full bg-white transition-all duration-250'
  const normalClasses = 'border-brown-5 peer-checked:border-primary-1 peer-hover:border-brown-3 peer-focus:ring-4 peer-focus:ring-primary-1/20'
  const disabledClasses = 'opacity-50 cursor-not-allowed'
  
  return [
    baseClasses,
    normalClasses,
    props.disabled ? disabledClasses : ''
  ].filter(Boolean).join(' ')
})

const handleChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>
