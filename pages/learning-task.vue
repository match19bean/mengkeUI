<template>
  <LearningTaskPopup
    v-if="popupView === 'detail'"
    v-model="popupOpen"
    :task-id="routeTaskId"
  />
  <LearningTaskListPopup
    v-else
    v-model="popupOpen"
    :task-id="routeTaskId"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const popupOpen = ref(true)
const route = useRoute()

const routeTaskId = computed(() => {
  const taskId = route.query.taskId
  return typeof taskId === 'string' ? taskId : undefined
})

const popupView = computed(() => {
  const view = route.query.view
  return view === 'list' ? 'list' : 'detail'
})

watch(popupOpen, (value) => {
  if (value) return

  if (window.history.length > 1) {
    useRouter().back()
    return
  }

  navigateTo('/')
})
</script>
