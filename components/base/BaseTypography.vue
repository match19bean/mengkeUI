<template>
  <component :is="tag" :class="typographyClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'subtitle' | 'body' | 'caption' | 'small'
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  tag: 'p'
})

const typographyClasses = computed(() => {
  const baseClasses = 'font-primary m-0 text-brown-1'
  
  const variantClasses = {
    h1: 'text-h1 font-black leading-tight',
    h2: 'text-h2 font-bold leading-snug',
    h3: 'text-h3 font-semibold leading-normal',
    h4: 'text-h4 font-semibold leading-normal',
    h5: 'text-h5 font-medium leading-relaxed',
    title: 'text-title font-semibold leading-relaxed',
    subtitle: 'text-subtitle font-medium leading-relaxed',
    body: 'text-body font-normal leading-relaxed',
    caption: 'text-caption font-normal leading-relaxed',
    small: 'text-small font-normal leading-normal'
  }
  
  return [baseClasses, variantClasses[props.variant]].filter(Boolean).join(' ')
})
</script>
