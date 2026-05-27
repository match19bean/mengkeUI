<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] bg-black/40 p-2 backdrop-blur-sm md:p-4 lg:p-6"
      >
        <div class="mx-auto flex h-[95vh] w-full max-w-[1540px] flex-col overflow-hidden rounded-[28px] border border-brown-8 bg-cream shadow-[0_12px_30px_rgba(54,32,16,0.14)]">
          <div class="flex shrink-0 items-center justify-between px-4 pt-4 md:px-6">
            <div />
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full text-brown-2 transition hover:bg-brown-9"
              aria-label="關閉"
              @click="closePopup"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M6 6l8 8M14 6l-8 8" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-6 lg:px-8 lg:pb-8">
            <h1 class="mt-4 font-genyogothic text-[32px] font-black text-brown-1">任務列表</h1>

            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <article
                v-for="task in tasks"
                :key="task.id"
                class="cursor-pointer rounded-2xl border border-brown-8/60 bg-white/75 p-4 shadow-sm transition hover:shadow-md"
                @click="openTask(task.id)"
              >
                <div class="mb-3 h-[120px] rounded-xl bg-brown-7/50" />
                <h3 class="text-[18px] font-bold text-brown-1">{{ task.title }}</h3>
                <div class="mt-2 flex gap-0.5">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-[16px]"
                    :class="star <= task.stars ? 'text-[#f5c44a]' : 'text-brown-7'"
                  >★</span>
                </div>
                <div class="mt-3">
                  <div class="mb-1 flex justify-between text-xs text-brown-5">
                    <span>進度</span>
                    <span>{{ task.current }} / {{ task.total }}</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-brown-8">
                    <div
                      class="h-full rounded-full bg-secondary-1"
                      :style="{ width: `${safePercent(task.current, task.total)}%` }"
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface TaskItem {
  id: string
  title: string
  stars: number
  current: number
  total: number
}

interface Props {
  modelValue: boolean
  taskId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const tasks = ref<TaskItem[]>([
  { id: 'fast-reading', title: '快朗', stars: 4, current: 1, total: 5 },
  { id: 'keyword', title: '關鍵字', stars: 3, current: 2, total: 8 },
  { id: 'shadowing', title: '跟讀', stars: 5, current: 0, total: 6 },
  { id: 'dictation', title: '聽寫', stars: 2, current: 3, total: 10 }
])

const safePercent = (current: number, total: number) => {
  if (!total) return 0
  return Math.min(100, Math.round((current / total) * 100))
}

const openTask = (taskId: string) => {
  navigateTo(`/learning-task?taskId=${encodeURIComponent(taskId)}`)
}

const closePopup = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
