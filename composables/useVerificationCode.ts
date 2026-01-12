export function useVerificationCode() {
  const countdown = ref(0)
  const isCountingDown = ref(false)
  const codeSent = ref(false)
  const verified = ref(false)
  const code = ref('')

  let timer: ReturnType<typeof setInterval> | null = null

  const startCountdown = (seconds = 60) => {
    codeSent.value = true
    isCountingDown.value = true
    countdown.value = seconds
    
    if (timer) clearInterval(timer)
    
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer!)
        isCountingDown.value = false
        timer = null
      }
    }, 1000)
  }

  const reset = () => {
    if (timer) clearInterval(timer)
    countdown.value = 0
    isCountingDown.value = false
    codeSent.value = false
    verified.value = false
    code.value = ''
    timer = null
  }

  const verify = () => {
    verified.value = true
  }

  return { 
    countdown, 
    isCountingDown, 
    codeSent, 
    verified, 
    code,
    startCountdown,
    verify,
    reset
  }
}
