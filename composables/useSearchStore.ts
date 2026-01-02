import type { SearchSuggestionsParams, SearchResult, SearchSuggestionsData } from '@/types/search'

/**
 * 搜尋功能的 composable
 */
export const useSearchStore = () => {
  const API_BASE = 'http://143.198.93.171/api'
  
  // 使用 useState 保存搜尋建議
  const suggestions = useState<string[]>('search-suggestions', () => [])
  const pending = useState<boolean>('search-pending', () => false)

  /**
   * 從 API 回應中提取所有建議文字
   */
  const extractSuggestions = (data: SearchSuggestionsData): string[] => {
    const results: string[] = []
    
    // 提取 products.name
    if (data.products?.name) {
      results.push(...data.products.name)
    }
    
    // 提取 club_course_infos 的所有欄位
    if (data.club_course_infos) {
      if (data.club_course_infos.name) {
        results.push(...data.club_course_infos.name)
      }
      if (data.club_course_infos.description) {
        results.push(...data.club_course_infos.description)
      }
      if (data.club_course_infos.details) {
        results.push(...data.club_course_infos.details)
      }
    }
    
    // 提取其他分類
    if (data.members?.name) {
      results.push(...data.members.name)
    }
    if (data.notices?.title) {
      results.push(...data.notices.title)
    }
    if (data.orders?.title) {
      results.push(...data.orders.title)
    }
    
    return results
  }

  /**
   * 獲取搜尋建議
   */
  const getSearchSuggestions = async (params: SearchSuggestionsParams) => {
    pending.value = true

    console.log('Fetching search suggestions for query:', params.query)
    try {
      const response = await $fetch<SearchResult<SearchSuggestionsData>>(
        `${API_BASE}/search/suggestions`,
        {
          params: {
            query: params.query,
            limit: params.limit || 5
          }
        }
      )

      console.log('API 原始回應:', response)
      
      if (response.success && response.data) {
        // 提取建議
        const extractedSuggestions = extractSuggestions(response.data)
        suggestions.value = extractedSuggestions
        
        console.log('提取的建議:', extractedSuggestions)

        return {
          success: true,
          data: extractedSuggestions
        }
      }

      return {
        success: false,
        data: []
      }
    } catch (error) {
      console.error('搜尋建議 API 錯誤:', error)
      suggestions.value = []
      return {
        success: false,
        data: []
      }
    } finally {
      pending.value = false
    }
  }

  return {
    suggestions,
    pending,
    getSearchSuggestions
  }
}
