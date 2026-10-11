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
  runtimeConfig: {
    public: {
      siteUrl: '',
      contactEmail: '',
      contactPhone: '',
      contactLocation: ''
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
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})
