<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" class="flex-shrink-0">
    <path d="M6 12L10 8L6 4" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  strokeWidth?: number | string
}

withDefaults(defineProps<Props>(), {
  size: 16,
  strokeWidth: 2,
})
</script>
