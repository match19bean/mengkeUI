import { onBeforeUnmount, watch } from 'vue'

let lockCount = 0
let previousBodyOverflow = ''
let previousMainOverflowY = ''

const getMainElement = () => document.querySelector('main') as HTMLElement | null

const applyLock = () => {
  if (typeof document === 'undefined') return

  if (lockCount === 0) {
    const mainEl = getMainElement()
    previousBodyOverflow = document.body.style.overflow
    previousMainOverflowY = mainEl?.style.overflowY ?? ''

    document.body.style.overflow = 'hidden'
    if (mainEl) {
      mainEl.style.overflowY = 'hidden'
    }
  }

  lockCount += 1
}

const releaseLock = () => {
  if (typeof document === 'undefined') return
  if (lockCount === 0) return

  lockCount -= 1
  if (lockCount > 0) return

  const mainEl = getMainElement()
  document.body.style.overflow = previousBodyOverflow
  if (mainEl) {
    mainEl.style.overflowY = previousMainOverflowY
  }
}

export const useOverlayScrollLock = (isOpen: () => boolean) => {
  let lockedByThisInstance = false

  watch(
    isOpen,
    (open) => {
      if (open && !lockedByThisInstance) {
        applyLock()
        lockedByThisInstance = true
        return
      }

      if (!open && lockedByThisInstance) {
        releaseLock()
        lockedByThisInstance = false
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (lockedByThisInstance) {
      releaseLock()
      lockedByThisInstance = false
    }
  })
}
