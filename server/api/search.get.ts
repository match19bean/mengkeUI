import { getQuery } from 'h3'

export default defineEventHandler((event) => {
  const q = String(getQuery(event).q || '').toLowerCase()

  const data = [
    { title: 'Vue 3 實戰', url: '/courses/vue3', type: '課程', selectable: true },
    { title: 'Nuxt 3 入門', url: '/courses/nuxt3', type: '課程', selectable: true },
    { title: '如何寫 unit test', url: '/posts/testing', type: '文章', selectable: true },
    { title: '系統管理入口', url: '/admin', type: '入口', selectable: false },
    { title: 'Tailwind 快速上手', url: '/posts/tailwind', type: '文章', selectable: true },
    { title: '學習路徑推薦', url: '/guides/path', type: '文章', selectable: true }
  ]

  if (!q) {
    return { items: [] }
  }

  const items = data.filter(d => d.title.toLowerCase().includes(q)).slice(0, 10)
  return { items }
})
