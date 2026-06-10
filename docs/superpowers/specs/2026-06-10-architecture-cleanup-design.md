# Architecture Cleanup Design

**Date:** 2026-06-10  
**Scope:** 一次性架構整頓，涵蓋設計 token、API 層、Auth 系統、Composable 規範、元件型別

---

## 背景與目標

專案目前 UI 與 API 並行開發，趁 API 尚未大量對接前，統一整頓架構基礎，避免技術債在擴展時放大。

目標：
- 設計 token 單一來源，消除顏色值不一致
- 建立集中 API 層，為 auth header 注入與統一錯誤處理做好準備
- 真正保護需要登入的路由（middleware）
- 統一 composable 的狀態管理規範
- `BaseInput` 改為語意 props，消除魔法 class 字串

---

## 第一段：設計 Token 統一

### 問題
`assets/css/design-tokens.css` 與 `tailwind.config.js` 對同一顏色名定義了不同值，例如：
- CSS token `--color-primary-1: #D95847`
- Tailwind `primary.1: '#EE7959'`

兩套來源並存導致 `var(--color-primary-1)` 與 `bg-primary-1` 顯示顏色不同。

### 設計
以 `tailwind.config.js` 為**唯一真實來源**。

**修改 `assets/css/design-tokens.css`：**
- 移除所有顏色、字體大小、間距定義（這些已在 Tailwind config 中）
- 保留僅有 CSS 才能表達的全域樣式：
  - `* { margin: 0; padding: 0; box-sizing: border-box; }`
  - `html { scrollbar-gutter: stable; }` 及其 fallback
  - `body { font-family: ...; color: ...; background-color: ...; }`
  - CSS transition 變數（`--transition-fast/base/slow`）若元件內有直接用 `var()` 則保留，否則移除

**不需要動任何 Vue 元件**，因為元件都是用 Tailwind class（`bg-primary-1`），而非 `var(--color-primary-1)`。

---

## 第二段：集中 API 層

### 問題
`useSearchStore`、`useAuth`、`useRegister` 各自組 URL、各自 `$fetch`，無法統一注入 Authorization header 或處理 401。

### 設計
新增 `composables/useApi.ts`：

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
        ...options?.headers,
      },
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      },
    })

  return { call }
}
```

**修改 `composables/useSearchStore.ts`：**
- 移除 `config.public.apiBase` 的直接使用
- 改為 `const { call } = useApi()`，呼叫 `call<SearchResult<SearchSuggestionsData>>('/search/suggestions', { params })`

**`useAuth` 與 `useRegister` 的真實 API 呼叫**（目前被 comment）待後端就緒時直接換，屆時也透過 `useApi().call()` 呼叫，無需另外處理 header。

---

## 第三段：Auth 系統與路由守衛

### 問題
1. `useAuth` 的 user 型別為 `any`
2. Token 存在 localStorage（XSS 風險）
3. 鎖定路由只有側邊欄視覺提示，直接輸入 URL 可繞過

### 設計

**① 新增 `types/auth.ts`**

```ts
export interface User {
  id: number
  nickname: string
  account: string
  email: string
  email_valid: number
  status: number
}
```

**② 修改 `composables/useAuth.ts`**
- `useState<any>` → `useState<User | null>`
- import `User` from `@/types/auth`

**③ Token 儲存策略**
目前維持 localStorage，理由：後端 API 尚未對接，HttpOnly cookie 方案需後端配合設定 `Set-Cookie`。

> **TODO（API 對接後處理）：** 與後端協議改用 HttpOnly cookie 傳遞 token，前端移除 localStorage 的 token 讀寫，改由 cookie 自動帶入。

**④ 新增 `middleware/auth.ts`**

```ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) return navigateTo('/login')
})
```

**⑤ 受保護頁面加上 middleware**
以下頁面加 `definePageMeta({ middleware: 'auth' })`：
- `pages/consultation.vue`
- `pages/flipped-learning.vue`
- `pages/cat-lesson.vue`
- `pages/learning-task.vue`

`app.vue` 側邊欄的 `locked` 邏輯保持不動（視覺提示仍有意義）。

---

## 第四段：Composable 規範統一

### 規則定義

| 情境 | 使用 | 範例 |
|------|------|------|
| 跨元件/頁面共享的全域狀態 | `useState` | `useAuth`、`useSearchStore`、`useProfilePopup` |
| 元件本地狀態，每次呼叫獨立 | `ref` | `useVerificationCode`、`useScreenSize`、`useTaiwanAddress` |

### `useOverlayScrollLock` 重寫

**問題：** module-level 變數（`lockCount`、`previousBodyOverflow` 等）在 SSR 下跨請求共用，有狀態汙染風險。

**修改方向：** 只需將 `lockCount` 改為 `useState`，`previousBodyOverflow` 和 `previousMainOverflowY` 保持 module-level 即可 — 它們只在 lock/unlock 同步操作 DOM 時讀寫，SSR 不執行 DOM 程式碼所以不會有跨請求問題：

```ts
// module-level — 這兩個只在 client DOM 操作中讀寫，安全
let previousBodyOverflow = ''
let previousMainOverflowY = ''

export const useOverlayScrollLock = (isOpen: () => boolean) => {
  const lockCount = useState('overlay-lock-count', () => 0)  // ← 改這裡
  // applyLock / releaseLock / watch / onBeforeUnmount 邏輯不變
}
```

### 資料與邏輯分離

**新增 `data/taiwan-address.ts`：**
- 將 `useTaiwanAddress.ts` 中的 `taiwanCounties` 陣列（200+ 行）移出

**修改 `composables/useTaiwanAddress.ts`：**
```ts
import { taiwanCounties } from '@/data/taiwan-address'
// 以下只保留 selectedCounty、selectedDistrict、computed、watch 邏輯
```

---

## 第五段：BaseInput 與型別清理

### BaseInput 改為語意 Props

**問題：** 目前接受任意 Tailwind class 字串（`bgColor="bg-[#EE795959]"`），呼叫端繞開設計 token，散落魔法值。

**移除的 props：**
`bgColor`、`height`、`placeholderSize`、`textSize`、`textAlign`、`textColor`、`placeholderColor`

**新增的語意 props：**

```ts
interface Props {
  variant?: 'default' | 'filled'  // filled = 半透明背景（用於 login 頁）
  size?: 'md' | 'lg'              // lg = h-[50px] + text-[20px]（用於 login 頁）
  // 保留原有的 type、placeholder、modelValue、error、errorMessage
}
```

`BaseInput` 內部根據 `variant`/`size` 映射 class，顏色全部改用設計 token class（`bg-primary-1/35` 取代 `bg-[#EE795959]`）。

**修改 `pages/login.vue`：**
```html
<!-- 改前 -->
<BaseInput bgColor="bg-[#EE795959]" height="h-[50px]" textSize="text-[20px]" ... />

<!-- 改後 -->
<BaseInput variant="filled" size="lg" ... />
```

### 頁面 Hardcoded 資料改為 async-ready 結構

`pages/index.vue` 的 `courses`、`statsItems`、`carouselItems` 改為 `useAsyncData` 包裝，目前仍回傳假資料，但介面已準備好直接替換 API 呼叫：

```ts
const { data: courses } = await useAsyncData('home-courses', () =>
  Promise.resolve([{ title: 'N5文法', ... }])
)
```

---

## 檔案異動清單

| 動作 | 路徑 |
|------|------|
| 修改 | `assets/css/design-tokens.css` |
| 新增 | `composables/useApi.ts` |
| 修改 | `composables/useSearchStore.ts` |
| 新增 | `types/auth.ts` |
| 修改 | `composables/useAuth.ts` |
| 新增 | `middleware/auth.ts` |
| 修改 | `pages/consultation.vue`、`flipped-learning.vue`、`cat-lesson.vue`、`learning-task.vue` |
| 修改 | `composables/useOverlayScrollLock.ts` |
| 新增 | `data/taiwan-address.ts` |
| 修改 | `composables/useTaiwanAddress.ts` |
| 修改 | `components/BaseInput.vue` |
| 修改 | `pages/login.vue` |
| 修改 | `pages/index.vue` |

---

## 不在本次範圍

- Token 改存 HttpOnly cookie（待後端 API 對接後處理）
- 真實 API 呼叫替換（`useAuth` login、`useRegister`）
- 其他頁面的 hardcoded 假資料換成真實 API
- 新增測試
