# Nuxt 3 專案開發指南

## 技術棧

- **框架**: Nuxt 3 + Vue 3 (Composition API)
- **語言**: TypeScript
- **樣式**: Tailwind CSS + 自定義設計 tokens
- **套件管理**: pnpm
- **字體**: Gen Jyuu Gothic X P (主要字體)

## 專案結構

```
components/     基礎可重用組件 (Base*) 和業務組件
composables/    Vue composables (useAuth, useRegister 等)
pages/          路由頁面 (自動路由)
assets/css/     全域樣式和設計 tokens
server/api/     API 端點
types/          TypeScript 型別定義
public/         靜態資源
```

## 開發規範

### 組件命名

- **基礎組件**: 使用 `Base` 前綴 (如 `BaseButton.vue`, `BaseInput.vue`)
- **業務組件**: 使用描述性名稱 (如 `CourseCard.vue`, `ProfilePopup.vue`)
- **圖標組件**: 放在 `components/icons/` 目錄

### Composables 規範

- 使用 `use` 前綴命名 (如 `useAuth.ts`, `useRegister.ts`)
- 應導出函式，內部使用 `useState`, `useRuntimeConfig` 等 Nuxt composables
- 包含完整的 TypeScript 型別定義

### 樣式規範

- **優先使用**: Tailwind CSS utility classes
- **設計 tokens**: 使用 `assets/css/design-tokens.css` 中定義的 CSS 變數
- **顏色系統**:
  - Primary: `primary-1` 到 `primary-4` (珊瑚紅)
  - Secondary: `secondary-1` 到 `secondary-4` (青綠色)
  - Brown: `brown-1` 到 `brown-10` (棕色系)
  - Alert: `alert-1`, `alert-2` (警告紅)
  - Complementary: `complementary-1/2/3` (輔助色)

### TypeScript 規範

- 使用 `interface` 定義組件 Props 和 API 回應
- 使用 `<script setup lang="ts">` 語法
- 為組件 emits 提供型別定義
- API 請求和回應都要有型別定義

### 組件開發模式

**基礎組件範例** (BaseButton.vue):
```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

### API 開發

- API 端點放在 `server/api/` 目錄
- 使用 `useRuntimeConfig()` 獲取 API base URL
- API Base: `process.env.NUXT_PUBLIC_API_BASE` (預設: `http://143.198.93.171/api`)

### 狀態管理

- 優先使用 Nuxt 內建的 `useState` 進行狀態管理
- 跨組件共享狀態時使用 composables
- 範例: `useAuth` composable 管理用戶認證狀態

## 開發命令

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器 (http://localhost:3000)
pnpm dev

# 建構生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 生成靜態網站
pnpm generate
```

## 頁面路由

Nuxt 3 使用檔案系統路由:
- `pages/index.vue` → `/`
- `pages/login.vue` → `/login`
- `pages/settings.vue` → `/settings`

## 注意事項

- 使用 Nuxt 自動導入特性，無需手動導入組件和 composables
- 圖片資源放在 `public/images/` 目錄，使用 `/images/` 路徑引用
- 設計稿遵循設計 tokens，維持視覺一致性
- 開發時確保 TypeScript 型別正確，避免 `any` 類型
