<template>
  <BasePageShell>
    <div class="mx-auto min-h-0 w-full">
      <section class="min-h-0 rounded-3xl border border-brown-8/70 bg-cream p-6 shadow-sm">
        <div class="mb-4">
          <p class="mb-2 text-sm font-bold text-brown-2">文章主題</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="topic in topicOptions"
              :key="topic"
              type="button"
              class="rounded-xl border px-4 py-2 text-sm font-bold transition"
              :class="selectedTopic === topic
                ? 'border-brown-1 bg-brown-1 text-cream'
                : 'border-brown-8 bg-white text-brown-2 hover:bg-brown-9'"
              @click="selectedTopic = topic"
            >
              {{ topic }}
            </button>
          </div>
        </div>

        <div class="mb-5 flex items-center gap-3">
          <div class="h-10 w-10 overflow-hidden rounded-full bg-brown-7">
            <img src="https://placehold.co/80x80/E8996D/FFFFFF?text=U" alt="作者頭像" class="h-full w-full object-cover" />
          </div>
          <div>
            <p class="text-sm font-bold text-brown-2">姜小文</p>
            <p class="text-xs text-brown-5">{{ nowText }}</p>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold text-brown-2" for="post-title">標題</label>
          <div class="mb-4 text-xs text-brown-5">({{ title.length }}/40)</div>
          <input
            id="post-title"
            v-model="title"
            type="text"
            maxlength="40"
            placeholder="請輸入文章標題"
            class="w-full rounded-2xl border border-brown-8 bg-white px-4 py-3 text-sm text-brown-2 outline-none transition focus:border-brown-5"
          />
        </div>

        <div class="mt-5">
          <div class="mb-2 flex items-start justify-between gap-3">
            <label class="text-sm font-bold text-brown-2" for="post-content">內容</label>
            <div class="flex max-w-full flex-wrap items-center gap-1.5 text-brown-4">
              <select
                v-model="selectedFontFamily"
                class="rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold transition hover:bg-brown-9"
                title="字體"
                @change="applyFontFamily"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
              <select
                v-model="selectedFontSize"
                class="rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold transition hover:bg-brown-9"
                title="文字大小"
                @change="applyFontSize"
              >
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="24px">24</option>
              </select>
              <label
                class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold transition hover:bg-brown-9"
                title="文字顏色"
              >
                <input
                  v-model="selectedTextColor"
                  type="color"
                  class="h-4 w-4 border-0 bg-transparent p-0"
                  @input="applyTextColor"
                />
              </label>
              <span class="mx-1 h-4 w-px bg-brown-8" />
              <button type="button" class="inline-flex items-center justify-center rounded-md border border-brown-8 bg-white px-2 py-1 transition hover:bg-brown-9" title="靠左對齊" @click="setAlign('left')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M2 3h10M2 5.5h7M2 8h10M2 10.5h6" />
                </svg>
              </button>
              <button type="button" class="inline-flex items-center justify-center rounded-md border border-brown-8 bg-white px-2 py-1 transition hover:bg-brown-9" title="置中對齊" @click="setAlign('center')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M2 3h10M3.5 5.5h7M2 8h10M4 10.5h6" />
                </svg>
              </button>
              <button type="button" class="inline-flex items-center justify-center rounded-md border border-brown-8 bg-white px-2 py-1 transition hover:bg-brown-9" title="靠右對齊" @click="setAlign('right')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M2 3h10M5 5.5h7M2 8h10M6 10.5h6" />
                </svg>
              </button>
              <span class="mx-1 h-4 w-px bg-brown-8" />
              <button type="button" class="rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold transition hover:bg-brown-9" title="粗體" @click="toggleBold">B</button>
              <button type="button" class="rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold italic transition hover:bg-brown-9" title="斜體" @click="toggleItalic">I</button>
              <button type="button" class="rounded-md border border-brown-8 bg-white px-2 py-1 text-xs font-bold underline transition hover:bg-brown-9" title="底線" @click="toggleUnderline">U</button>
              <button type="button" class="inline-flex items-center justify-center rounded-md border border-brown-8 bg-white px-2 py-1 transition hover:bg-brown-9" title="插入圖片" @click="openImagePicker">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1.5" y="2" width="11" height="10" rx="1.5" />
                  <circle cx="4.5" cy="5" r="1" />
                  <path d="M2.5 10l3-3 2 2 1.5-1.5 2 2.5" />
                </svg>
              </button>
            </div>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImagePicked"
          />
          <ClientOnly>
            <EditorContent
              id="post-content"
              :editor="editor"
              class="min-h-[320px] w-full rounded-2xl border border-brown-8 bg-white px-4 py-3 text-sm text-brown-2 outline-none transition focus-within:border-brown-5"
            />
          </ClientOnly>
          <p class="mt-2 text-xs text-brown-5">可插入圖片與文字樣式。建議包含學習背景、遇到的問題，以及你想和大家討論的重點。</p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border border-brown-7 bg-cream px-5 py-2.5 text-sm font-bold text-brown-2 transition hover:bg-brown-9"
            @click="publishConfirmOpen = true"
          >
            確定
          </button>
        </div>

      </section>
    </div>

    <Popup v-if="publishConfirmOpen" @close="publishConfirmOpen = false">
      <div class="w-[min(1200px,96vw)] p-2 text-center">
        <h3 class="text-xl font-black text-brown-2">是否發布文章？</h3>
        <p class="mt-3 text-sm text-brown-4">送出後會離開編輯頁，以下是即將發布的 HTML 內容。</p>
        <div class="mt-4 rounded-xl border border-brown-8 bg-brown-10 p-3 text-left">
          <p class="mb-2 text-xs font-bold text-brown-5">HTML 預覽</p>
          <pre class="max-h-[50vh] w-full overflow-auto whitespace-pre break-normal rounded-lg bg-white p-3 text-xs text-brown-2">{{ content || '<p></p>' }}</pre>
        </div>
        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-xl border border-brown-7 bg-cream px-5 py-2 text-sm font-bold text-brown-2 transition hover:bg-brown-9"
            @click="publishConfirmOpen = false"
          >
            取消
          </button>
          <button
            type="button"
            class="rounded-xl bg-primary-1 px-5 py-2 text-sm font-bold text-cream transition hover:opacity-90"
            @click="confirmPublish"
          >
            發布
          </button>
        </div>
      </div>
    </Popup>

    <Popup v-if="leaveConfirmOpen" @close="cancelLeave">
      <div class="min-w-[360px] max-w-[420px] p-2 text-center">
        <h3 class="text-xl font-black text-brown-2">是否要離開此頁？</h3>
        <p class="mt-3 text-sm text-brown-4">尚未發布的內容可能會遺失。</p>
        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-xl border border-brown-7 bg-cream px-5 py-2 text-sm font-bold text-brown-2 transition hover:bg-brown-9"
            @click="cancelLeave"
          >
            留在此頁
          </button>
          <button
            type="button"
            class="rounded-xl bg-primary-1 px-5 py-2 text-sm font-bold text-cream transition hover:opacity-90"
            @click="confirmLeave"
          >
            離開
          </button>
        </div>
      </div>
    </Popup>
  </BasePageShell>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, VueNodeViewRenderer } from '@tiptap/vue-3'
import { Extension } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { FontFamily } from '@tiptap/extension-font-family'
import TiptapResizableImage from '~/components/TiptapResizableImage.vue'

const router = useRouter()
const title = ref('')
const topicOptions = ['課程公告', '學習討論', '旅遊分享', '學習方式', '疑難困惑', '投票'] as const
const selectedTopic = ref<(typeof topicOptions)[number]>('課程公告')
const fileInputRef = ref<HTMLInputElement | null>(null)
const content = ref('')
const selectedFontFamily = ref('Arial')
const selectedFontSize = ref('14px')
const selectedTextColor = ref('#432c2c')
const publishConfirmOpen = ref(false)
const leaveConfirmOpen = ref(false)
const imageWidth = ref(320)
const lastSelection = ref<{ from: number; to: number } | null>(null)
const lastTextSelection = ref<{ from: number; to: number } | null>(null)
const pendingRoute = ref<string | null>(null)
const ignoreLeaveGuard = ref(false)

const plainTextContent = computed(() =>
  content.value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
)

const hasDraftChanges = computed(() => title.value.trim().length > 0 || plainTextContent.value.length > 0)

const applyTypingStyle = () => {
  if (!editor.value) return

  editor.value
    .chain()
    .focus()
    .setFontFamily(selectedFontFamily.value)
    .setMark('textStyle', { fontSize: selectedFontSize.value })
    .setColor(selectedTextColor.value)
    .run()
}

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
})

const CustomImage = Image.extend({
  addNodeView() {
    return VueNodeViewRenderer(TiptapResizableImage)
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 320,
        parseHTML: element => {
          const raw = element.getAttribute('data-width') || element.style.width || '320'
          const parsed = Number.parseInt(raw.replace('px', ''), 10)
          return Number.isNaN(parsed) ? 320 : parsed
        },
        renderHTML: attributes => ({
          'data-width': attributes.width,
          style: `width: ${attributes.width}px; height: auto;`,
        }),
      },
    }
  },
})

const editor = useEditor({
  content: '<p></p>',
  editorProps: {
    handleKeyDown: (_view, event) => {
      const isTypingKey = event.key.length === 1 || event.key === 'Enter'
      if (isTypingKey) {
        requestAnimationFrame(() => {
          applyTypingStyle()
        })
      }
      return false
    },
  },
  extensions: [
    StarterKit,
    TextStyle,
    FontSize,
    Underline,
    FontFamily,
    Color,
    CustomImage,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML()
  },
  onSelectionUpdate: ({ editor }) => {
    const { from, to } = editor.state.selection
    lastSelection.value = { from, to }
    if (from !== to) {
      lastTextSelection.value = { from, to }
    }

    if (!editor.isActive('image')) return
    const attrs = editor.getAttributes('image')
    const width = Number(attrs.width)
    if (!Number.isNaN(width)) imageWidth.value = width
  },
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  if (import.meta.client) {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
})

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!hasDraftChanges.value || ignoreLeaveGuard.value) return
  event.preventDefault()
  event.returnValue = ''
}

if (import.meta.client) {
  window.addEventListener('beforeunload', handleBeforeUnload)
}

onBeforeRouteLeave((to) => {
  if (ignoreLeaveGuard.value) {
    ignoreLeaveGuard.value = false
    return true
  }

  if (!hasDraftChanges.value) return true

  pendingRoute.value = to.fullPath
  leaveConfirmOpen.value = true
  return false
})

const confirmPublish = () => {
  publishConfirmOpen.value = false
  ignoreLeaveGuard.value = true
  router.push('/mk-lobby')
}

const confirmLeave = () => {
  const targetRoute = pendingRoute.value
  pendingRoute.value = null
  leaveConfirmOpen.value = false
  ignoreLeaveGuard.value = true
  router.push(targetRoute || '/mk-lobby')
}

const cancelLeave = () => {
  pendingRoute.value = null
  leaveConfirmOpen.value = false
}

const exec = (fn: () => boolean) => {
  if (!editor.value) return
  fn()
}

const applyFontFamily = () => {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const range = from !== to ? { from, to } : lastTextSelection.value

  const chain = editor.value.chain().focus()
  if (range) chain.setTextSelection(range)
  chain.setFontFamily(selectedFontFamily.value)
  if (range) {
    chain.setTextSelection(range.to).setFontFamily(selectedFontFamily.value)
  }
  chain.run()
  applyTypingStyle()
}

const applyFontSize = () => {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const range = from !== to ? { from, to } : lastTextSelection.value

  const chain = editor.value.chain().focus()
  if (range) chain.setTextSelection(range)
  chain.setMark('textStyle', { fontSize: selectedFontSize.value })
  if (range) {
    chain.setTextSelection(range.to)
  }
  chain.run()
  applyTypingStyle()
}

const applyTextColor = () => {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const range = from !== to ? { from, to } : lastTextSelection.value

  const chain = editor.value.chain().focus()
  if (range) chain.setTextSelection(range)
  chain.setColor(selectedTextColor.value)
  if (range) {
    chain.setTextSelection(range.to).setColor(selectedTextColor.value)
  }
  chain.run()
  applyTypingStyle()
}

const setAlign = (align: 'left' | 'center' | 'right') => {
  exec(() => editor.value!.chain().focus().setTextAlign(align).run())
}

const toggleBold = () => {
  exec(() => editor.value!.chain().focus().toggleBold().run())
}

const toggleItalic = () => {
  exec(() => editor.value!.chain().focus().toggleItalic().run())
}

const toggleUnderline = () => {
  exec(() => editor.value!.chain().focus().toggleUnderline().run())
}

const openImagePicker = () => {
  fileInputRef.value?.click()
}

const onImagePicked = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const imageSrc = typeof reader.result === 'string' ? reader.result : ''
    if (!imageSrc) return

    exec(() => editor.value!.chain().focus().setImage({ src: imageSrc, width: imageWidth.value }).createParagraphNear().focus().run())
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const nowText = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${year}年${month}月${day}日 ${hour}:${minute}`
})
</script>

<style scoped>
:deep(.ProseMirror) {
  min-height: 320px;
  line-height: 1.6;
  outline: none;
}

:deep(.ProseMirror p) {
  margin: 0 0 0.8rem;
}

:deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  cursor: pointer;
  display: block;
  margin: 0 0 0.8rem;
}

:deep(.ProseMirror img.ProseMirror-selectednode) {
  outline: none;
}

:deep(.ProseMirror .ProseMirror-selectednode) {
  outline: none;
}

:deep(.ProseMirror a) {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}
</style>
