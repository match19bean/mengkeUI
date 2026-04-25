<template>
  <section class="rounded-[28px] border bg-brown-10 p-4 md:p-5 shadow-2xl">
    <header class="mb-3 flex items-center">
      <h3 class="text-h3 font-black text-brown-1 py-2">本期學習</h3>
    </header>

    <div class="space-y-3">
      <article
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        class="rounded-2xl bg-white px-4 py-5 shadow-[0_2px_10px_rgba(54,32,16,0.05)]"
      >
        <div class="mb-2 flex items-center justify-between gap-3 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <p class="truncate text-title font-black text-brown-1 tracking-[2px]">{{ item.title }}</p>

            <span
                v-if="item.actionText"
              class="rounded-full px-2 py-1.5 text-[12px] tracking-[2px] font-bold leading-none"
                :class="item.actionClass || 'bg-primary-2 text-white'"
                >
                {{ item.actionText }}
            </span>
          </div>

          <button
            type="button"
            class="text-brown-6 transition-colors hover:text-brown-3"
            :aria-label="`${item.title} 詳細`"
          >
            <span aria-hidden="true">
                 <svg width="25" height="25" viewBox="0 0 16 16" fill="none" class="flex-shrink-0">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="w-full bg-brown-8 rounded-full h-4 overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="item.progressClass || 'bg-primary-2'"
              :style="{ width: `${safeProgress(getProgressPercent(item))}%` }"
            />
          </div>
          <p class="min-w-[62px] text-right text-caption font-black text-brown-1">{{ getCountText(item) }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface CurrentLearningItem {
  title: string
  actionText?: string
  actionClass?: string
  progress?: number
  current?: number
  total?: number
  unit?: string
  countText?: string
  progressClass?: string
}

interface Props {
  items: CurrentLearningItem[]
}

defineProps<Props>()

const safeProgress = (value: number) => {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

const getProgressPercent = (item: CurrentLearningItem) => {
  if (typeof item.progress === 'number') return item.progress
  if (typeof item.current === 'number' && typeof item.total === 'number' && item.total > 0) {
    return (item.current / item.total) * 100
  }
  return 0
}

const getCountText = (item: CurrentLearningItem) => {
  if (item.countText) return item.countText
  if (typeof item.current === 'number' && typeof item.total === 'number') {
    return `${item.current} / ${item.total}${item.unit ? ` ${item.unit}` : ''}`
  }
  return '-'
}
</script>
