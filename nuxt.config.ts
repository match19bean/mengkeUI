// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  // Components are grouped into base/ chart/ feature/ subfolders for readability.
  // pathPrefix:false keeps auto-import names based on filename only (folder is
  // ignored), so <BaseButton/>, <AreaChart/>, <ProfilePopup/> stay unchanged.
  // The icons/ folder keeps an explicit "Icons" prefix (e.g. <IconsChevronRight/>).
  components: [
    { path: '~/components/icons', prefix: 'Icons', pathPrefix: false },
    { path: '~/components', pathPrefix: false, ignore: ['icons/**'] },
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'tw-city-selector'
    }
  },
  css: ['~/assets/css/design-tokens.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://143.198.93.171/api'
    }
  }
})
