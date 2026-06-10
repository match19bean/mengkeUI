# Architecture Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 一次性整頓架構基礎：設計 token 統一、集中 API 層、路由守衛、composable 規範、BaseInput 語意化。

**Architecture:** 以 `tailwind.config.js` 為設計 token 唯一來源；新增 `useApi` composable 作為所有外部 API 呼叫的統一入口，自動注入 Bearer token 並處理 401；Nuxt route middleware 保護需登入的頁面。

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, pnpm

> **注意：** 本專案無測試框架。每個 task 的驗證步驟為手動檢查（執行 `pnpm dev` 觀察行為），無需撰寫測試。

---

## 檔案異動總覽

| 動作 | 路徑 | 說明 |
|------|------|------|
| 新增 | `types/auth.ts` | User interface 定義 |
| 修改 | `composables/useAuth.ts` | 套用 User 型別，移除 `any` |
| 新增 | `composables/useApi.ts` | 集中 API 呼叫，自動注入 auth header |
| 修改 | `composables/useSearchStore.ts` | 改用 useApi |
| 修改 | `assets/css/design-tokens.css` | 移除與 Tailwind 重複的 token 定義 |
| 新增 | `middleware/auth.ts` | 路由守衛 |
| 修改 | `pages/consultation.vue` | 加 auth middleware |
| 修改 | `pages/flipped-learning.vue` | 加 auth middleware |
| 修改 | `pages/cat-lesson.vue` | 加 auth middleware |
| 修改 | `pages/learning-task.vue` | 加 auth middleware |
| 修改 | `composables/useOverlayScrollLock.ts` | lockCount 改用 useState |
| 新增 | `data/taiwan-address.ts` | 台灣地址資料（從 composable 分離） |
| 修改 | `composables/useTaiwanAddress.ts` | 移除資料，只保留邏輯 |
| 修改 | `components/BaseInput.vue` | 加 variant/size 語意 props，移除魔法 class props |
| 修改 | `pages/login.vue` | 改用 variant/size |
| 修改 | `pages/index.vue` | 資料改為 useAsyncData 結構 |

---

## Task 1：定義 User 型別

**Files:**
- Create: `types/auth.ts`

- [ ] **Step 1：建立 `types/auth.ts`**

```ts
// types/auth.ts
export interface User {
  id: number
  nickname: string
  account: string
  email: string
  email_valid: number
  status: number
}
```

- [ ] **Step 2：Commit**

```bash
git add types/auth.ts
git commit -m "feat: add User type definition"
```

---

## Task 2：更新 useAuth 套用 User 型別

**Files:**
- Modify: `composables/useAuth.ts`

- [ ] **Step 1：修改 `composables/useAuth.ts`**

將檔案完整替換為以下內容（邏輯不變，只改型別）：

```ts
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
  const API_BASE = config.public.apiBase

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
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，確認 TypeScript 無型別錯誤（終端機無紅字），登入頁面功能正常。

- [ ] **Step 3：Commit**

```bash
git add composables/useAuth.ts
git commit -m "feat: apply User type to useAuth, remove any"
```

---

## Task 3：建立集中 API 層

**Files:**
- Create: `composables/useApi.ts`

- [ ] **Step 1：建立 `composables/useApi.ts`**

```ts
// composables/useApi.ts
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
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，確認無 TypeScript 錯誤。

- [ ] **Step 3：Commit**

```bash
git add composables/useApi.ts
git commit -m "feat: add centralized useApi composable with auth header injection"
```

---

## Task 4：useSearchStore 改用 useApi

**Files:**
- Modify: `composables/useSearchStore.ts`

- [ ] **Step 1：修改 `composables/useSearchStore.ts`**

```ts
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
    } catch {
      suggestions.value = []
      return { success: false, data: [] }
    } finally {
      pending.value = false
    }
  }

  return { suggestions, pending, getSearchSuggestions }
}
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，確認 TopSearchBar 搜尋功能正常（目前對接的是 server/api/search.get.ts 的假資料，行為不變）。

- [ ] **Step 3：Commit**

```bash
git add composables/useSearchStore.ts
git commit -m "refactor: useSearchStore now uses useApi instead of direct $fetch"
```

---

## Task 5：清理 design-tokens.css

**Files:**
- Modify: `assets/css/design-tokens.css`

- [ ] **Step 1：將 `assets/css/design-tokens.css` 替換為精簡版**

移除所有顏色、字體、間距定義（這些已在 `tailwind.config.js` 中），只保留純 CSS 才能表達的全域樣式：

```css
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Keep layout width stable when vertical scrollbars appear/disappear. */
html {
  scrollbar-gutter: stable;
}

@supports not (scrollbar-gutter: stable) {
  html {
    overflow-y: scroll;
  }
}

body {
  font-family: 'Noto Sans TC', sans-serif;
  color: #362010;
  background-color: #ffffff;
}
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，打開首頁確認整體顏色與字型外觀無變化（因為元件都是用 Tailwind class，不是 CSS var，所以不應有任何視覺差異）。

- [ ] **Step 3：Commit**

```bash
git add assets/css/design-tokens.css
git commit -m "refactor: remove duplicate token definitions from design-tokens.css, tailwind.config.js is now the single source of truth"
```

---

## Task 6：建立路由守衛 middleware

**Files:**
- Create: `middleware/auth.ts`

- [ ] **Step 1：建立 `middleware/auth.ts`**

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) return navigateTo('/login')
})
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`。在瀏覽器直接輸入 `http://localhost:3000/consultation`，確認被 redirect 到 `/login`（此時尚未掛到任何頁面，middleware 只是存在，不會影響現有行為）。

- [ ] **Step 3：Commit**

```bash
git add middleware/auth.ts
git commit -m "feat: add auth route middleware"
```

---

## Task 7：受保護頁面加上 middleware

**Files:**
- Modify: `pages/consultation.vue`
- Modify: `pages/flipped-learning.vue`
- Modify: `pages/cat-lesson.vue`
- Modify: `pages/learning-task.vue`

- [ ] **Step 1：修改 `pages/consultation.vue`**

在 `<script setup lang="ts">` 內加入：

```ts
definePageMeta({ middleware: 'auth' })
```

完整 script 區塊：

```ts
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

- [ ] **Step 2：修改 `pages/flipped-learning.vue`**

在現有 `<script setup lang="ts">` 的第一行加入：

```ts
definePageMeta({ middleware: 'auth' })
```

- [ ] **Step 3：修改 `pages/cat-lesson.vue`**

在 `<script setup lang="ts">` 內加入：

```ts
definePageMeta({ middleware: 'auth' })
```

完整 script 區塊：

```ts
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

- [ ] **Step 4：修改 `pages/learning-task.vue`**

在現有 `<script setup lang="ts">` 的第一行加入：

```ts
definePageMeta({ middleware: 'auth' })
```

- [ ] **Step 5：驗證**

執行 `pnpm dev`，確認未登入狀態下：
- 直接進 `http://localhost:3000/consultation` → redirect 到 `/login` ✓
- 直接進 `http://localhost:3000/flipped-learning` → redirect 到 `/login` ✓
- 直接進 `http://localhost:3000/cat-lesson` → redirect 到 `/login` ✓
- 直接進 `http://localhost:3000/learning-task` → redirect 到 `/login` ✓

登入後再次訪問以上路由，確認可以正常進入。

- [ ] **Step 6：Commit**

```bash
git add pages/consultation.vue pages/flipped-learning.vue pages/cat-lesson.vue pages/learning-task.vue
git commit -m "feat: protect routes with auth middleware"
```

---

## Task 8：修復 useOverlayScrollLock 的 module-level 狀態

**Files:**
- Modify: `composables/useOverlayScrollLock.ts`

- [ ] **Step 1：修改 `composables/useOverlayScrollLock.ts`**

將 `lockCount` 改為 `useState`，`previousBodyOverflow` 和 `previousMainOverflowY` 保持 module-level（它們只在 client DOM 操作中讀寫，無 SSR 跨請求問題）：

```ts
import type { Ref } from 'vue'

// module-level — 只在 client DOM 操作中同步讀寫，SSR 不執行 DOM code
let previousBodyOverflow = ''
let previousMainOverflowY = ''

const getMainElement = () => document.querySelector('main') as HTMLElement | null

const applyLock = (lockCount: Ref<number>) => {
  if (typeof document === 'undefined') return

  if (lockCount.value === 0) {
    const mainEl = getMainElement()
    previousBodyOverflow = document.body.style.overflow
    previousMainOverflowY = mainEl?.style.overflowY ?? ''

    document.body.style.overflow = 'hidden'
    if (mainEl) mainEl.style.overflowY = 'hidden'
  }

  lockCount.value += 1
}

const releaseLock = (lockCount: Ref<number>) => {
  if (typeof document === 'undefined') return
  if (lockCount.value === 0) return

  lockCount.value -= 1
  if (lockCount.value > 0) return

  const mainEl = getMainElement()
  document.body.style.overflow = previousBodyOverflow
  if (mainEl) mainEl.style.overflowY = previousMainOverflowY
}

export const useOverlayScrollLock = (isOpen: () => boolean) => {
  const lockCount = useState('overlay-lock-count', () => 0)
  let lockedByThisInstance = false

  watch(
    isOpen,
    (open) => {
      if (open && !lockedByThisInstance) {
        applyLock(lockCount)
        lockedByThisInstance = true
        return
      }

      if (!open && lockedByThisInstance) {
        releaseLock(lockCount)
        lockedByThisInstance = false
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (lockedByThisInstance) {
      releaseLock(lockCount)
      lockedByThisInstance = false
    }
  })
}
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，打開任何含有 Popup 的頁面（例如首頁的 ProfilePopup），確認：
- 開啟 popup 時背景捲動被鎖定
- 關閉 popup 時捲動恢復

- [ ] **Step 3：Commit**

```bash
git add composables/useOverlayScrollLock.ts
git commit -m "fix: use useState for overlay lock count to prevent SSR state pollution"
```

---

## Task 9：分離台灣地址資料

**Files:**
- Create: `data/taiwan-address.ts`
- Modify: `composables/useTaiwanAddress.ts`

- [ ] **Step 1：建立 `data/taiwan-address.ts`**

將 `useTaiwanAddress.ts` 中的 `taiwanCounties` 陣列整個移到這個新檔案：

```ts
// data/taiwan-address.ts
export const taiwanCounties = [
  { name: '台北市', districts: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'] },
  { name: '新北市', districts: ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'] },
  { name: '桃園市', districts: ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區', '復興區'] },
  { name: '台中市', districts: ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'] },
  { name: '台南市', districts: ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'] },
  { name: '高雄市', districts: ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區', '大社區', '東沙群島', '南沙群島', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '茄萣區'] },
  { name: '基隆市', districts: ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'] },
  { name: '新竹市', districts: ['東區', '北區', '香山區'] },
  { name: '新竹縣', districts: ['竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉'] },
  { name: '苗栗縣', districts: ['竹南鎮', '頭份市', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮', '苗栗市', '造橋鄉', '頭屋鄉', '公館鄉', '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮'] },
  { name: '彰化縣', districts: ['彰化市', '芬園鄉', '花壇鄉', '秀水鄉', '鹿港鎮', '福興鄉', '線西鄉', '和美鎮', '伸港鄉', '員林市', '社頭鄉', '永靖鄉', '埔心鄉', '溪湖鎮', '大村鄉', '埔鹽鄉', '田中鎮', '北斗鎮', '田尾鄉', '埔頭鄉', '溪州鄉', '竹塘鄉', '二林鎮', '大城鄉', '芳苑鄉', '二水鄉'] },
  { name: '南投縣', districts: ['南投市', '中寮鄉', '草屯鎮', '國姓鄉', '埔里鎮', '仁愛鄉', '名間鄉', '集集鎮', '水里鄉', '魚池鄉', '信義鄉', '竹山鎮', '鹿谷鄉'] },
  { name: '雲林縣', districts: ['斗南鎮', '大埤鄉', '虎尾鎮', '土庫鎮', '褒忠鄉', '東勢鄉', '台西鄉', '崙背鄉', '麥寮鄉', '斗六市', '林內鄉', '古坑鄉', '莿桐鄉', '西螺鎮', '二崙鄉', '北港鎮', '水林鄉', '口湖鄉', '四湖鄉', '元長鄉'] },
  { name: '嘉義市', districts: ['東區', '西區'] },
  { name: '嘉義縣', districts: ['番路鄉', '梅山鄉', '竹崎鄉', '阿里山鄉', '中埔鄉', '大埔鄉', '水上鄉', '鹿草鄉', '太保市', '朴子市', '東石鄉', '六腳鄉', '新港鄉', '民雄鄉', '大林鎮', '溪口鄉', '義竹鄉', '布袋鎮'] },
  { name: '屏東縣', districts: ['屏東市', '三地門鄉', '霧台鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉', '萬丹鄉', '潮州鎮', '泰武鄉', '來義鄉', '萬巒鄉', '崁頂鄉', '新埤鄉', '南州鄉', '林邊鄉', '東港鎮', '琉球鄉', '佳冬鄉', '新園鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '恆春鎮', '滿州鄉'] },
  { name: '宜蘭縣', districts: ['宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉', '釣魚台列嶼'] },
  { name: '花蓮縣', districts: ['花蓮市', '新城鄉', '秀林鄉', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '玉里鎮', '卓溪鄉', '富里鄉'] },
  { name: '台東縣', districts: ['台東市', '綠島鄉', '蘭嶼鄉', '延平鄉', '卑南鄉', '鹿野鄉', '關山鎮', '海端鄉', '池上鄉', '東河鄉', '成功鎮', '長濱鄉', '太麻里鄉', '金峰鄉', '大武鄉', '達仁鄉'] },
  { name: '澎湖縣', districts: ['馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉'] },
  { name: '金門縣', districts: ['金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉'] },
  { name: '連江縣', districts: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'] }
]
```

- [ ] **Step 2：修改 `composables/useTaiwanAddress.ts`**

```ts
import { ref, computed, watch } from 'vue'
import { taiwanCounties } from '@/data/taiwan-address'

export function useTaiwanAddress() {
  const selectedCounty = ref('')
  const selectedDistrict = ref('')

  const countyOptions = computed(() =>
    taiwanCounties.map(county => county.name)
  )

  const districtOptions = computed(() => {
    if (!selectedCounty.value) return []
    const county = taiwanCounties.find(c => c.name === selectedCounty.value)
    return county ? county.districts : []
  })

  watch(selectedCounty, () => {
    selectedDistrict.value = ''
  })

  return {
    selectedCounty,
    selectedDistrict,
    countyOptions,
    districtOptions
  }
}
```

- [ ] **Step 3：驗證**

執行 `pnpm dev`，確認 TypeScript 無錯誤，任何使用縣市選擇器的頁面功能正常。

- [ ] **Step 4：Commit**

```bash
git add data/taiwan-address.ts composables/useTaiwanAddress.ts
git commit -m "refactor: extract Taiwan address data to data/taiwan-address.ts"
```

---

## Task 10：BaseInput 改為語意 Props

**Files:**
- Modify: `components/BaseInput.vue`

- [ ] **Step 1：修改 `components/BaseInput.vue`**

```vue
<template>
  <div class="flex flex-col">
    <label v-if="label" :for="inputId" class="text-h4 text-primary-1 font-semibold tracking-wide">
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      :style="placeholderStyle"
      @input="handleInput"
      @blur="handleBlur"
      class="rounded-full"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: string
  type?: string
  label?: string
  placeholder?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  width?: string
  textAlign?: 'left' | 'center' | 'right'
  variant?: 'default' | 'filled'
  size?: 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  error: false,
  width: 'w-full',
  textAlign: 'left',
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const inputId = useId()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const variantClasses: Record<string, { bg: string; text: string }> = {
  default: { bg: 'bg-brown-1/10', text: 'text-brown-1' },
  filled:  { bg: 'bg-primary-1/35', text: 'text-cream' },
}

const sizeClasses: Record<string, { height: string; textSize: string }> = {
  md: { height: 'h-[32px]', textSize: 'text-base' },
  lg: { height: 'h-[50px]', textSize: 'text-[20px]' },
}

const inputClasses = computed(() => {
  const { bg, text } = variantClasses[props.variant]
  const { height, textSize } = sizeClasses[props.size]
  const textAlignClass = props.textAlign === 'center' ? 'text-center' : props.textAlign === 'right' ? 'text-right' : 'text-left'
  const baseClasses = `${props.width} ${height} px-4 ${textSize} font-primary rounded-[32px] ${bg} ${textAlignClass} ${text} transition-all duration-200`
  const normalClasses = 'border-0 focus:outline-none focus:ring-2 focus:ring-secondary-1/30'
  const errorClasses = 'border border-alert-1 focus:ring-alert-1/30 text-alert-1'
  const disabledClasses = 'bg-brown-9 cursor-not-allowed opacity-60'

  return [
    baseClasses,
    props.error ? errorClasses : normalClasses,
    props.disabled ? disabledClasses : '',
  ].filter(Boolean).join(' ')
})

const placeholderStyle = computed(() => {
  const colorMap: Record<string, string> = {
    default: '#A89A8D',
    filled: '#F8F7F0',
  }
  const sizeMap: Record<string, string> = {
    md: '0.75rem',
    lg: '20px',
  }

  return {
    '--placeholder-color': colorMap[props.variant],
    '--placeholder-size': sizeMap[props.size],
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
input::placeholder {
  color: var(--placeholder-color);
  font-size: var(--placeholder-size);
  letter-spacing: 0.125rem;
}
</style>
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，打開任何使用 BaseInput 的頁面（如搜尋列、設定頁），確認外觀正常。

- [ ] **Step 3：Commit**

```bash
git add components/BaseInput.vue
git commit -m "refactor: BaseInput now uses semantic variant/size props instead of raw class strings"
```

---

## Task 11：更新 login.vue 使用新的 BaseInput props

**Files:**
- Modify: `pages/login.vue`

- [ ] **Step 1：修改 `pages/login.vue` 中的兩個 BaseInput 呼叫**

找到帳號的 BaseInput：

```html
<!-- 改前 -->
<BaseInput
  v-model="form.account"
  type="text"
  placeholder="請輸入帳號"
  height="h-[50px]"
  placeholderSize="text-[20px]"
  placeholderColor="text-[#F8F7F0]"
  textSize="text-[20px]"
  textAlign="center"
  textColor="text-[#F8F7F0]"
  bgColor="bg-[#EE795959]"
  :error="errors.account"
  :error-message="errors.accountMessage"
/>

<!-- 改後 -->
<BaseInput
  v-model="form.account"
  type="text"
  placeholder="請輸入帳號"
  variant="filled"
  size="lg"
  text-align="center"
  :error="errors.account"
  :error-message="errors.accountMessage"
/>
```

找到密碼的 BaseInput：

```html
<!-- 改前 -->
<BaseInput
  v-model="form.password"
  type="password"
  placeholder="請輸入密碼"
  height="h-[50px]"
  placeholderSize="text-[20px]"
  placeholderColor="text-[#F8F7F0]"
  textSize="text-[20px]"
  textAlign="center"
  textColor="text-[#F8F7F0]"
  bgColor="bg-[#EE795959]"
  :error="errors.password"
  :error-message="errors.passwordMessage"
/>

<!-- 改後 -->
<BaseInput
  v-model="form.password"
  type="password"
  placeholder="請輸入密碼"
  variant="filled"
  size="lg"
  text-align="center"
  :error="errors.password"
  :error-message="errors.passwordMessage"
/>
```

- [ ] **Step 2：驗證**

執行 `pnpm dev`，打開 `/login`，確認：
- 帳號欄位與密碼欄位的外觀（高度、背景顏色、文字顏色、placeholder 顏色）與修改前相同
- TypeScript 無錯誤警告

- [ ] **Step 3：Commit**

```bash
git add pages/login.vue
git commit -m "refactor: update login page to use BaseInput variant/size props"
```

---

## Task 12：index.vue 資料改為 useAsyncData 結構

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1：修改 `pages/index.vue` 的 script 區塊**

將三個 hardcoded 資料陣列改為 `useAsyncData` 包裝。找到以下程式碼並替換：

```ts
// 改前
const statsItems = [
  { value: '-', label: '-', color: '#6B3F2E', maxValue: 100 },
  { value: '-', label: '-', color: '#D95847', maxValue: 100 },
  { value: '-', label: '-', color: '#F2A74B', maxValue: 100 },
  { value: '-', label: '-', color: '#3E7871', maxValue: 100 }
]

const courses = [
  {
    title: 'N5文法',
    status: '進行中',
    tags: ['N5', '文法', '聽力'],
    progress: 65,
    timeInfo: '上午10:00 - 中午12:30'
  },
  {
    title: '日文主題發表',
    status: '今天',
    tags: ['N3', '口說', '應對'],
    progress: 45,
    timeInfo: '晚上09:00 - 晚上10:30'
  }
]

const carouselItems = ref<CarouselItem[]>([
  { id: 1, image: '/images/Carousel1.png', alt: '輪播圖片 1' },
  { id: 2, image: 'https://placehold.co/800x400/3E7871/FFFFFF?text=Slide+2', alt: '輪播圖片 2' },
  { id: 3, image: 'https://placehold.co/800x400/F2A74B/FFFFFF?text=Slide+3', alt: '輪播圖片 3' }
])
```

```ts
// 改後
const { data: statsItems } = await useAsyncData('home-stats', () =>
  Promise.resolve([
    { value: '-', label: '-', color: '#6B3F2E', maxValue: 100 },
    { value: '-', label: '-', color: '#D95847', maxValue: 100 },
    { value: '-', label: '-', color: '#F2A74B', maxValue: 100 },
    { value: '-', label: '-', color: '#3E7871', maxValue: 100 }
  ])
)

const { data: courses } = await useAsyncData('home-courses', () =>
  Promise.resolve([
    {
      title: 'N5文法',
      status: '進行中',
      tags: ['N5', '文法', '聽力'],
      progress: 65,
      timeInfo: '上午10:00 - 中午12:30'
    },
    {
      title: '日文主題發表',
      status: '今天',
      tags: ['N3', '口說', '應對'],
      progress: 45,
      timeInfo: '晚上09:00 - 晚上10:30'
    }
  ])
)

const { data: carouselItems } = await useAsyncData('home-carousel', () =>
  Promise.resolve([
    { id: 1, image: '/images/Carousel1.png', alt: '輪播圖片 1' },
    { id: 2, image: 'https://placehold.co/800x400/3E7871/FFFFFF?text=Slide+2', alt: '輪播圖片 2' },
    { id: 3, image: 'https://placehold.co/800x400/F2A74B/FFFFFF?text=Slide+3', alt: '輪播圖片 3' }
  ] as CarouselItem[])
)
```

- [ ] **Step 2：更新 template 加 null 防護**

`useAsyncData` 回傳的 `data` 在型別上是 `T | null`，需加 `?? []` fallback 避免 TypeScript 警告。找到 template 中以下三處並更新：

```html
<!-- CircleStatsGroup -->
<CircleStatsGroup :items="statsItems ?? []" />

<!-- CourseCardSimple v-for -->
<CourseCardSimple
  v-for="course in (courses ?? [])"
  :key="course.title"
  v-bind="course"
/>

<!-- BaseCarousel -->
<BaseCarousel :items="carouselItems ?? []" :autoplay="true" :interval="6000" />
```

- [ ] **Step 3：驗證**

執行 `pnpm dev`，打開首頁，確認：
- 輪播圖片正常顯示
- 課程卡片正常顯示
- TypeScript 無錯誤

- [ ] **Step 4：Commit**

```bash
git add pages/index.vue
git commit -m "refactor: wrap index.vue stub data in useAsyncData for future API migration"
```

---

## 完成後驗收清單

- [ ] `pnpm dev` 無 TypeScript 錯誤
- [ ] 登入頁面外觀正常，帳號/密碼輸入框樣式不變
- [ ] 未登入時直接訪問 `/consultation`、`/flipped-learning`、`/cat-lesson`、`/learning-task` 均 redirect 到 `/login`
- [ ] 登入後可正常訪問以上頁面
- [ ] ProfilePopup 開關時捲動鎖定/解鎖正常
- [ ] 首頁課程、輪播、統計資料正常顯示
- [ ] 搜尋功能正常
