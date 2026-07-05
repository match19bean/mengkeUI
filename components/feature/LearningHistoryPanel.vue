<template>
  <section class="rounded-[28px] border shadow-2xl bg-brown-10 p-4 md:p-5">
    <header class="mb-3 flex items-center">
      <h3 class="text-h3 font-black text-brown-1 py-2">學習歷程</h3>
    </header>

    <div class="space-y-2">
      <article
        v-for="item in items"
        :key="`${item.title}-${item.time}`"
        class="grid cursor-pointer grid-cols-[minmax(0,72px)_1fr_auto] items-center gap-5 rounded-2xl bg-white px-4 py-5 shadow-[0_2px_10px_rgba(54,32,16,0.05)] transition hover:bg-brown-9/40"
        role="button"
        tabindex="0"
        @click="handleItemClick(item)"
        @keydown.enter="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <p class="truncate text-title font-black text-brown-1">{{ item.title }}</p>

        <div class="min-w-0">
          <div class="flex items-center gap-1.5 py-1">
            <span
              v-for="(tag, tagIndex) in getTags(item)"
              :key="`${item.title}-${tag}-${tagIndex}`"
              class="rounded-full px-2 py-1 text-[10px] font-bold leading-none text-white"
              :class="getTagClass(tagIndex)"
            >   
              {{ tag }}
            </span>
          </div>
          <p class="mt-1 text-[12px] font-semibold leading-none text-brown-6">{{ formatDisplayTime(item.time) }}</p>
        </div>

        <button
            type="button"
            class="text-brown-6 transition-colors hover:text-brown-3"
            :aria-label="`${item.title} 詳細`"
            @click.stop="handleItemClick(item)"
          >
            <span aria-hidden="true">
                <IconsChevronRight :size="25" :stroke-width="1.5" />
            </span>
        </button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface LearningHistoryItem {
  taskId?: string
  title: string
  tags?: string[]
  tag1?: string
  tag2?: string
  time: string
}

interface Props {
  items: LearningHistoryItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  'item-click': [item: LearningHistoryItem]
}>()

const handleItemClick = (item: LearningHistoryItem) => {
  emit('item-click', item)
}

const getTags = (item: LearningHistoryItem) => {
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    return item.tags
  }

  return [item.tag1, item.tag2].filter((tag): tag is string => Boolean(tag))
}

const getTagClass = (index: number) => {
  if (index % 2 === 0) return 'bg-secondary-1'
  return 'bg-complementary-1'
}

const parseTimeValue = (value: string) => {
  const trimmedValue = value.trim()

  // Unix timestamp (seconds or milliseconds)
  if (/^\d{10}$/.test(trimmedValue)) {
    return new Date(Number(trimmedValue) * 1000)
  }

  if (/^\d{13}$/.test(trimmedValue)) {
    return new Date(Number(trimmedValue))
  }

  // ISO-like date time: 2026-04-25 08:31 or 2026-04-25T08:31
  const normalizedValue = trimmedValue.replace(' ', 'T')
  const parsedDate = new Date(normalizedValue)

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  return null
}

const formatClock = (date: Date) => {
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatDateClock = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day} ${formatClock(date)}`
}

const formatDisplayTime = (value: string) => {
  const parsedDate = parseTimeValue(value)

  // Keep original text if value is not a parseable date string
  if (!parsedDate) return value

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetStart = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
  const dayDiff = Math.round((todayStart.getTime() - targetStart.getTime()) / 86400000)

  if (dayDiff === 0) {
    return `今天 ${formatClock(parsedDate)}`
  }

  if (dayDiff === 1) {
    return `昨天 ${formatClock(parsedDate)}`
  }

  return formatDateClock(parsedDate)
}
</script>
