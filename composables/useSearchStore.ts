import type { SearchSuggestionsParams, SearchResult, SearchSuggestionsData } from '@/types/search'

export const useSearchStore = () => {
  const { call } = useApi()

  const suggestions = useState<string[]>('search-suggestions', () => [])
  const pending = useState<boolean>('search-pending', () => false)

  const extractSuggestions = (data: SearchSuggestionsData): string[] => {
    const results: string[] = []

    if (data.products?.name) results.push(...data.products.name)

    if (data.club_course_infos) {
      if (data.club_course_infos.name) results.push(...data.club_course_infos.name)
      if (data.club_course_infos.description) results.push(...data.club_course_infos.description)
      if (data.club_course_infos.details) results.push(...data.club_course_infos.details)
    }

    if (data.members?.name) results.push(...data.members.name)
    if (data.notices?.title) results.push(...data.notices.title)
    if (data.orders?.title) results.push(...data.orders.title)

    return results
  }

  const getSearchSuggestions = async (params: SearchSuggestionsParams) => {
    pending.value = true

    try {
      const response = await call<SearchResult<SearchSuggestionsData>>(
        '/search/suggestions',
        { params: { query: params.query, limit: params.limit || 5 } }
      )

      if (response.success && response.data) {
        const extracted = extractSuggestions(response.data)
        suggestions.value = extracted
        return { success: true, data: extracted }
      }

      return { success: false, data: [] }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
      suggestions.value = []
      return { success: false, data: [] }
    } finally {
      pending.value = false
    }
  }

  return { suggestions, pending, getSearchSuggestions }
}
