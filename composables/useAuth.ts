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
    // --- FAKE LOGIN ---
    // 這裡直接模擬登入成功，回傳假資料
    const fakeResponse: LoginResponse = {
      access_token: 'fake-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      member: {
        id: 1,
        nickname: 'User',
        account: params.account,
        email: 'demo@example.com',
        email_valid: 1,
        password: params.password,
        status: 1
      }
    }

    token.value = fakeResponse.access_token
    user.value = fakeResponse.member

    if (import.meta.client) {
      localStorage.setItem('auth-token', fakeResponse.access_token)
      localStorage.setItem('auth-user', JSON.stringify(fakeResponse.member))
    }

    return {
      success: true,
      message: '登入成功',
      data: {
        token: fakeResponse.access_token,
        user: fakeResponse.member
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
