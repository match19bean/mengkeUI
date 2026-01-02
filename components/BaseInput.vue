<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="inputId" class="text-h4 text-primary-1 font-semibold tracking-wide">
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      class="rounded-full"
    />
    <span v-if="error" class="text-body text-alert-1 mt-0.5">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: string
  type?: string
  label?: string
  placeholder?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const inputId = useId()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputClasses = computed(() => {
  const baseClasses = 'w-full h-[50px] px-4 py-2 text-base font-primary border-[1.5px] rounded-xl bg-white text-brown-1 transition-all duration-200 placeholder:text-brown-6'
  const normalClasses = 'border-brown-1 hover:border-brown-4 focus:border-secondary-1 focus:outline-none focus:ring-2 focus:ring-secondary-1/30'
  const errorClasses = 'border-alert-1 focus:ring-alert-1/30 text-alert-1'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60'
  
  return [
    baseClasses,
    props.error ? errorClasses : normalClasses,
    props.disabled ? disabledClasses : ''
  ].filter(Boolean).join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
