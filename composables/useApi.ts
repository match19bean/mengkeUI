export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const call = <T>(path: string, options?: Parameters<typeof $fetch>[1]) =>
    $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...(options?.headers as Record<string, string> | undefined),
      },
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      },
    })

  return { call }
}
