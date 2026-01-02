<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white rounded-3xl p-8 shadow-popup min-w-[320px] text-center relative transition-transform duration-300">
      <button class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-brown-9 hover:bg-brown-8 text-brown-4 cursor-pointer transition" @click="$emit('close')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <h2 class="text-h3 font-bold mb-4">彈窗標題</h2>
      <p class="text-body text-brown-2 mb-6">這是一個 Popup 彈窗內容。</p>
      <BaseButton variant="primary" size="medium" @click="$emit('close')">關閉</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()
</script>

<style scoped>
/* Styles moved to template as Tailwind utility classes */
</style>
