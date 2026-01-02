import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 螢幕尺寸檢查 Composable
 * @param breakpoint - 斷點寬度（預設 1024px，對應 Tailwind 的 lg）
 * @returns isLargeScreen - 是否為大螢幕
 */
export const useScreenSize = (breakpoint = 1024) => {
  const isLargeScreen = ref(false)

  const checkScreenSize = () => {
    if (typeof window !== 'undefined') {
      isLargeScreen.value = window.innerWidth >= breakpoint
    }
  }

  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })

  return {
    isLargeScreen,
    checkScreenSize
  }
}
