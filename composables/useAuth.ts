import type { User } from '@/types/auth'

interface LoginParams {
  account: string
  password: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  member: User
}

export const useAuth = () => {
  const config = useRuntimeConfig()

  const user = useState<User | null>('auth-user', () => null)
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (params: LoginParams) => {
    // --- FAKE LOGIN ---
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

  const logout = () => {
    token.value = null
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
  }

  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth-token')
      const savedUser = localStorage.getItem('auth-user')

      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser) as User
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
