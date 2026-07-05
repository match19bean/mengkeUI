<template>
  <NodeViewWrapper class="tiptap-resizable-image inline-block align-top leading-none">
    <div class="image-frame relative inline-block overflow-hidden rounded" :class="props.selected ? 'ring-2 ring-black' : 'ring-1 ring-transparent'">
      <img
        :src="String(node.attrs.src || '')"
        :alt="String(node.attrs.alt || '')"
        :title="String(node.attrs.title || '')"
        :style="imageStyle"
        class="m-0 block max-w-full rounded"
        draggable="false"
      />
      <button
        type="button"
        class="resize-handle absolute bottom-1 right-1 z-[5] flex h-4 w-4 cursor-se-resize items-center justify-center rounded-sm border border-white bg-black text-[9px] font-bold leading-none text-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
        title="拖曳調整大小"
        @pointerdown.prevent="startResize"
      >
        +
      </button>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const imageStyle = computed(() => {
  const width = Number(props.node.attrs.width || 320)
  const safeWidth = Number.isNaN(width) ? 320 : width
  return {
    width: `${safeWidth}px`,
    height: 'auto',
  }
})

const startResize = (event: PointerEvent) => {
  const startX = event.clientX
  const startWidth = Number(props.node.attrs.width || 320)
  const minWidth = 120
  const maxWidth = 1400

  const onPointerMove = (moveEvent: PointerEvent) => {
    const diff = moveEvent.clientX - startX
    const nextWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff))
    props.updateAttributes({ width: nextWidth })
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}
</script>

<style scoped>
.tiptap-resizable-image,
.image-frame {
  display: inline-block;
  line-height: 0;
  vertical-align: top;
}

.resize-handle {
  min-width: 14px;
  min-height: 14px;
  touch-action: none;
}
</style>
