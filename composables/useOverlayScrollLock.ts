import type { Ref } from 'vue'

// module-level — 只在 client DOM 操作中同步讀寫，SSR 不執行 DOM code
let previousBodyOverflow = ''
let previousMainOverflowY = ''

const getMainElement = () => document.querySelector('main') as HTMLElement | null

const applyLock = (lockCount: Ref<number>) => {
  if (typeof document === 'undefined') return

  if (lockCount.value === 0) {
    const mainEl = getMainElement()
    previousBodyOverflow = document.body.style.overflow
    previousMainOverflowY = mainEl?.style.overflowY ?? ''

    document.body.style.overflow = 'hidden'
    if (mainEl) mainEl.style.overflowY = 'hidden'
  }

  lockCount.value += 1
}

const releaseLock = (lockCount: Ref<number>) => {
  if (typeof document === 'undefined') return
  if (lockCount.value === 0) return

  lockCount.value -= 1
  if (lockCount.value > 0) return

  const mainEl = getMainElement()
  document.body.style.overflow = previousBodyOverflow
  if (mainEl) mainEl.style.overflowY = previousMainOverflowY
}

export const useOverlayScrollLock = (isOpen: () => boolean) => {
  const lockCount = useState('overlay-lock-count', () => 0)
  let lockedByThisInstance = false

  watch(
    isOpen,
    (open) => {
      if (open && !lockedByThisInstance) {
        applyLock(lockCount)
        lockedByThisInstance = true
        return
      }

      if (!open && lockedByThisInstance) {
        releaseLock(lockCount)
        lockedByThisInstance = false
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (lockedByThisInstance) {
      releaseLock(lockCount)
      lockedByThisInstance = false
    }
  })
}
