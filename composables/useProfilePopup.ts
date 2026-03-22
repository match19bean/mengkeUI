export const useProfilePopup = () => {
  const isOpen = useState('profilePopupOpen', () => false)
  
  const open = () => {
    isOpen.value = true
  }
  
  const close = () => {
    isOpen.value = false
  }
  
  return {
    isOpen,
    open,
    close
  }
}
