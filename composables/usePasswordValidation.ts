export function usePasswordValidation() {
  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (!password) {
      return { isValid: false, error: '' }
    }
    
    // 檢查長度
    if (password.length < 8 || password.length > 20) {
      return { isValid: false, error: '密碼長度需為8-20字元' }
    }
    
    // 檢查是否包含大寫字母
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: '密碼需包含至少一個大寫字母' }
    }
    
    // 檢查是否包含小寫字母
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: '密碼需包含至少一個小寫字母' }
    }
    
    // 檢查是否包含特殊符號
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`;~]/.test(password)) {
      return { isValid: false, error: '密碼需包含至少一個特殊符號' }
    }
    
    return { isValid: true, error: '' }
  }

  return {
    validatePassword
  }
}
