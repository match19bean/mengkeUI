<script setup lang="ts">
const route = useRoute()
const courseId = route.params.id as string

// TODO: 從 API 取得課程資料
// const { data } = await useFetch(`/api/courses/${courseId}`)
const title = 'JLPT N5 文法精修班'
const description = '協助學習者準備日文能力測驗（JLPT）N5 文法理解，建立完整句型骨架與題型判讀邏輯。'
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

// redirect 到 /club?course=id
await navigateTo(`/club?course=${courseId}`, { replace: true })
</script>

<template>
  <div></div>
</template>
