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
  // Cookies are readable during SSR, so route middleware sees the auth state
  // on first render / hard refresh (localStorage would only exist client-side).
  const cookieOpts = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' as const, path: '/' }
  const user = useCookie<User | null>('auth-user', { ...cookieOpts, default: () => null })
  const token = useCookie<string | null>('auth-token', { ...cookieOpts, default: () => null })
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
        status: 1,
        type: params.account.toLowerCase().includes('teacher') ? 'Teacher' : 'Student'
      }
    }

    token.value = fakeResponse.access_token
    user.value = fakeResponse.member

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
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
}
