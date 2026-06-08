<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div class="relative min-w-[320px] rounded-3xl bg-white p-8 text-center shadow-popup transition-transform duration-300">
        <button class="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brown-9 text-brown-4 transition hover:bg-brown-8" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <slot>
          <h2 class="mb-4 text-h3 font-bold">彈窗標題</h2>
          <p class="mb-6 text-body text-brown-2">這是一個 Popup 彈窗內容。</p>
          <BaseButton variant="primary" size="medium" @click="$emit('close')">關閉</BaseButton>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [], confirm: [] }>()

useOverlayScrollLock(() => true)
</script>

<style scoped>
/* Styles moved to template as Tailwind utility classes */
</style>
