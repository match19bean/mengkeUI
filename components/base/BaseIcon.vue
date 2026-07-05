<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :class="['icon', iconClass]"
    :style="{ color: color }"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

interface Props {
  name: string
  size?: number | string
  color?: string
  viewBox?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  viewBox: '0 0 24 24'
})

const iconClass = computed(() => `icon-${props.name}`)

// 動態載入 icon 組件
const iconComponent = computed(() => {
  return defineAsyncComponent(() => 
    import(`./icons/${props.name}.vue`).catch(() => 
      import(`./icons/default.vue`)
    )
  )
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  transition: all var(--transition-base);
}
</style>
