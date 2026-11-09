// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  // Déploiement Vercel. Pour tester le build en local avec `npm run preview`,
  // construire avec NITRO_PRESET=node-server (voir README).
  nitro: {
    preset: process.env.NITRO_PRESET || 'vercel'
  },
  runtimeConfig: {
    // Privé (serveur uniquement) : surchargé par NUXT_SUPABASE_URL et NUXT_SUPABASE_SERVICE_ROLE_KEY.
    // Ne JAMAIS déplacer ces clés dans `public`.
    supabaseUrl: '',
    supabaseServiceRoleKey: '',
    public: {
      siteUrl: '',
      contactEmail: '',
      contactPhone: '',
      contactLocation: '',
      contactWhatsapp: ''
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'fr', language: 'fr', file: 'fr.json', name: 'Français' },
      { code: 'en', language: 'en', file: 'en.json', name: 'English' }
    ],
    langDir: 'locales',
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
