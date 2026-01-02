<template>
  <button
    :class="buttonClasses"
    v-bind="$attrs"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
    <img v-if="disabled" src="/images/lock-button.svg" alt="locked" width="14" height="16" class="flex-shrink-0" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-rounded' | 'brown' | 'brown-soft'
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 cursor-pointer font-primary font-semibold transition-all duration-250 whitespace-nowrap rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-3/60'

  const sizeClasses = {
    large: 'h-[60px] px-[22px] py-2 text-lg',
    medium: 'h-11 px-6 text-base',
    small: 'h-[53px] py-[9px] px-4 text-button-s rounded-[12px]'
  } as const

  const variantClasses = {
    primary: 'bg-primary-1 text-white border-2 border-transparent hover:bg-primary-2 active:bg-primary-3 disabled:bg-brown-9 disabled:text-white disabled:cursor-not-allowed',
    secondary: 'bg-secondary-1 text-white border-2 border-transparent hover:bg-secondary-2 active:bg-secondary-3 disabled:bg-brown-9 disabled:text-white disabled:cursor-not-allowed',
    brown: 'bg-brown-1/50 text-white border-2 border-transparent hover:bg-secondary-2 active:bg-secondary-3 disabled:bg-brown-9 disabled:text-white disabled:cursor-not-allowed',
    'brown-soft': 'bg-brown-1/50 text-cream border-2 border-transparent hover:bg-brown-1/60 active:bg-brown-1/70 disabled:bg-brown-9 disabled:text-white disabled:cursor-not-allowed',
    outline: 'bg-white border-2 border-brown-1 text-brown-1 hover:bg-cream active:bg-brown-9 disabled:bg-brown-9 disabled:text-white disabled:border-brown-7 disabled:cursor-not-allowed',
    'outline-rounded': 'bg-transparent border-[1.5px] border-brown-1 text-brown-1 hover:bg-white/60 active:bg-white/40 rounded-full disabled:bg-brown-9 disabled:text-white disabled:border-brown-7 disabled:cursor-not-allowed'
  } as const

  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].filter(Boolean).join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
