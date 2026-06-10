<template>
  <div class="flex flex-col">
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
      :style="placeholderStyle"
      @input="handleInput"
      @blur="handleBlur"
      class="rounded-full"
    />
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
  width?: string
  textAlign?: 'left' | 'center' | 'right'
  variant?: 'default' | 'filled'
  size?: 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  error: false,
  width: 'w-full',
  textAlign: 'left',
  variant: 'default',
  size: 'md',
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

const variantClasses: Record<string, { bg: string; text: string }> = {
  default: { bg: 'bg-brown-1/10', text: 'text-brown-1' },
  filled:  { bg: 'bg-primary-1/35', text: 'text-cream' },
}

const sizeClasses: Record<string, { height: string; textSize: string }> = {
  md: { height: 'h-[32px]', textSize: 'text-base' },
  lg: { height: 'h-[50px]', textSize: 'text-[20px]' },
}

const inputClasses = computed(() => {
  const { bg, text } = variantClasses[props.variant]
  const { height, textSize } = sizeClasses[props.size]
  const textAlignClass = props.textAlign === 'center' ? 'text-center' : props.textAlign === 'right' ? 'text-right' : 'text-left'
  const baseClasses = `${props.width} ${height} px-4 ${textSize} font-primary rounded-[32px] ${bg} ${textAlignClass} ${text} transition-all duration-200`
  const normalClasses = 'border-0 focus:outline-none focus:ring-2 focus:ring-secondary-1/30'
  const errorClasses = 'border border-alert-1 focus:ring-alert-1/30 text-alert-1'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60'

  return [
    baseClasses,
    props.error ? errorClasses : normalClasses,
    props.disabled ? disabledClasses : '',
  ].filter(Boolean).join(' ')
})

const placeholderStyle = computed(() => {
  const colorMap: Record<string, string> = {
    default: '#A89A8D',
    filled: '#F8F7F0',
  }
  const sizeMap: Record<string, string> = {
    md: '0.75rem',
    lg: '20px',
  }

  return {
    '--placeholder-color': colorMap[props.variant],
    '--placeholder-size': sizeMap[props.size],
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
input::placeholder {
  color: var(--placeholder-color);
  font-size: var(--placeholder-size);
  letter-spacing: 0.125rem;
}
</style>
