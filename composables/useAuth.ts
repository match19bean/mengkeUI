interface LoginParams {
  account: string
  password: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  member: {
    id: number
    nickname: string
    account: string
    email: string
    email_valid: number
    password: string
    status: number
  }
}

/**
 * 認證相關的 composable
 */
export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  // 使用 useState 保存用戶資訊和 token
  const user = useState<any>('auth-user', () => null)
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  /**
   * 登入
   */
  const login = async (params: LoginParams) => {
    try {
      const response = await $fetch<LoginResponse>(
        `${API_BASE}/auth/login`,
        {
          method: 'POST',
          body: {
            account: params.account,
            password: params.password
          }
        }
      )

      if (response.access_token && response.member) {
        // 保存 token 和用戶資訊
        token.value = response.access_token
        user.value = response.member

        // 可以選擇將 token 保存到 localStorage
        if (import.meta.client) {
          localStorage.setItem('auth-token', response.access_token)
          localStorage.setItem('auth-user', JSON.stringify(response.member))
        }

        return {
          success: true,
          data: {
            token: response.access_token,
            user: response.member
          }
        }
      }

      return {
        success: false,
        message: '登入失敗'
      }
    } catch (error: any) {
      console.error('登入 API 錯誤:', error)
      
      return {
        success: false,
        message: error.data?.message || '登入失敗，請稍後再試'
      }
    }
  }

  /**
   * 登出
   */
  const logout = () => {
    token.value = null
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
  }

  /**
   * 初始化認證狀態（從 localStorage 恢復）
   */
  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth-token')
      const savedUser = localStorage.getItem('auth-user')

      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
}
