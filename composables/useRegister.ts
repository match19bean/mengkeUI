interface RegisterParams {
  account: string
  password: string
  email: string
  nickname: string
}

interface RegisterResponse {
  success: boolean
  message?: string
  data?: any
}

/**
 * 註冊相關的 composable
 */
export const useRegister = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  /**
   * 註冊
   */
  const register = async (params: RegisterParams): Promise<RegisterResponse> => {
    try {
      // TODO: 之後改為真實 API
      // const response = await $fetch(`${API_BASE}/auth/register`, {
      //   method: 'POST',
      //   body: params
      // })
      // return response

      // --- FAKE REGISTER ---
      return {
        success: true,
        data: {
          id: 2,
          ...params
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || '註冊失敗，請稍後再試'
      }
    }
  }

  return {
    register
  }
}
