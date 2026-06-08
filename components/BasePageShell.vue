<template>
  <div class="min-h-screen bg-cream px-4 py-6 mx-10">
    <div class="mx-auto w-full max-w-[1440px] space-y-8">
      <TopSearchBar v-if="showSearch" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showSearch?: boolean
  }>(),
  {
    showSearch: true
  }
)
</script>