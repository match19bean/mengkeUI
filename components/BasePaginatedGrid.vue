<template>
  <div class="relative">
    <div :class="gridClass">
      <slot v-for="item in currentPage" :item="item" />
    </div>
    <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
      <button
        v-for="i in totalPages"
        :key="i"
        type="button"
        class="h-2 rounded-full transition-all"
        :class="currentPageIndex === i - 1 ? 'w-4 bg-brown-3' : 'w-2 bg-brown-7'"
        @click="currentPageIndex = i - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: string | number }">
import { computed, ref } from 'vue'

interface Props {
  items: T[]
  pageSize?: number
  gridClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 4,
  gridClass: 'grid gap-4',
})

const currentPageIndex = ref(0)
const totalPages = computed(() => Math.ceil(props.items.length / props.pageSize))
const currentPage = computed(() => {
  const start = currentPageIndex.value * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})
</script>
