<script setup lang="ts">
const route = useRoute()
const taskId = route.params.id as string

// TODO: 從 API 取得任務資料
// const { data } = await useFetch(`/api/learning-tasks/${taskId}`)
const title = '學習任務'
const description = '依任務內容提供操作教學、討論文章與學習歷程。'
const image = `${useRuntimeConfig().public.apiBase ?? ''}/images/logo.png`

useSeoMeta({
  ogTitle: title,
  ogDescription: description,
  ogImage: image,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
})

// redirect 到 /learning-task?taskId=id
await navigateTo(`/learning-task?taskId=${encodeURIComponent(taskId)}`, { replace: true })
</script>

<template>
  <div></div>
</template>
