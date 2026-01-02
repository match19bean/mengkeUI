<template>
  <div class="relative overflow-hidden rounded-[24px] shadow-card">
    <!-- 輪播容器 -->
    <div class="relative w-full">
      <TransitionGroup name="carousel">
        <div
          v-for="(item, index) in items"
          v-show="index === currentIndex"
          :key="item.id"
          class="absolute inset-0 w-full"
        >
          <img
            :src="item.image"
            :alt="item.alt"
            class="w-full h-auto block"
          />
        </div>
      </TransitionGroup>
      <!-- 佔位圖片，用於撐開容器高度 -->
      <img
        :src="items[0]?.image"
        :alt="items[0]?.alt"
        class="w-full h-auto block invisible"
      />
    </div>

    <!-- 左右箭頭 -->
    <button
      @click="handlePrev"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
      aria-label="上一張"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#362010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button
      @click="handleNext"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
      aria-label="下一張"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#362010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 指示器 -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(item, index) in items"
        :key="`dot-${item.id}`"
        @click="handleGoTo(index)"
        :class="[
          'w-2 h-2 rounded-full transition-all',
          index === currentIndex 
            ? 'bg-white w-6' 
            : 'bg-white/50 hover:bg-white/75'
        ]"
        :aria-label="`跳到第 ${index + 1} 張`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface CarouselItem {
  id: string | number
  image: string
  alt: string
}

interface Props {
  items: CarouselItem[]
  autoplay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 3000
})

const currentIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prev = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.items.length - 1 
    : currentIndex.value - 1
}

const goTo = (index: number) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  if (props.autoplay && props.items.length > 1) {
    autoplayTimer = setInterval(() => {
      next()
    }, props.interval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const handlePrev = () => {
  prev()
  resetAutoplay()
}

const handleNext = () => {
  next()
  resetAutoplay()
}

const handleGoTo = (index: number) => {
  goTo(index)
  resetAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.carousel-enter-active,
.carousel-leave-active {
  transition: opacity 0.5s ease;
}

.carousel-enter-from {
  opacity: 0;
}

.carousel-leave-to {
  opacity: 0;
}
</style>
