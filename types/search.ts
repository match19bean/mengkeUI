// 搜尋建議的參數
export interface SearchSuggestionsParams {
  query: string
  limit?: number
}

// 搜尋建議的回應結構
export interface SearchSuggestionsData {
  products?: {
    name?: string[]
  }
  club_course_infos?: {
    name?: string[]
    description?: string[]
    details?: string[]
  }
  members?: {
    name?: string[]
  }
  notices?: {
    title?: string[]
  }
  orders?: {
    title?: string[]
  }
}

// API 回應格式
export interface SearchResult<T = any> {
  success: boolean
  data: T
}
