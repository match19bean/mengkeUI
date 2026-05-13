<template>
  <LearningTaskPopup v-model="popupOpen" :task-id="routeTaskId" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const popupOpen = ref(true)
const route = useRoute()

const routeTaskId = computed(() => {
  const taskId = route.query.taskId
  return typeof taskId === 'string' ? taskId : undefined
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
