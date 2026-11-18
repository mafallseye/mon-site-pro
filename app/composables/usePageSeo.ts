import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function usePageSeo(title: MaybeRefOrGetter<string>, description: MaybeRefOrGetter<string>) {
  const route = useRoute()
  const { locale } = useI18n()
  const requestUrl = useRequestURL()
  const config = useRuntimeConfig()
  const pageTitle = computed(() => toValue(title))
  const pageDescription = computed(() => toValue(description))
  const baseUrl = computed(() => (config.public.siteUrl || requestUrl.origin).replace(/\/+$/u, ''))
  const unlocalizedPath = computed(() => route.path.replace(/^\/en(?=\/|$)/u, '') || '/')
  const frenchUrl = computed(() => new URL(unlocalizedPath.value, `${baseUrl.value}/`).href)
  const englishPath = computed(() => unlocalizedPath.value === '/' ? '/en' : `/en${unlocalizedPath.value}`)
  const englishUrl = computed(() => new URL(englishPath.value, `${baseUrl.value}/`).href)
  const canonicalUrl = computed(() => locale.value === 'en' ? englishUrl.value : frenchUrl.value)
  // og:image en PNG 1200×630 : LinkedIn, Facebook et WhatsApp n'affichent pas les SVG.
  const imageUrl = computed(() => new URL('/og-image.png', `${baseUrl.value}/`).href)
  const logoUrl = computed(() => new URL('/logo.svg', `${baseUrl.value}/`).href)

  useSeoMeta({
    title: () => pageTitle.value,
    description: () => pageDescription.value,
    ogTitle: () => pageTitle.value,
    ogDescription: () => pageDescription.value,
    ogUrl: () => canonicalUrl.value,
    ogType: 'website',
    ogLocale: () => locale.value === 'en' ? 'en_US' : 'fr_FR',
    ogImage: () => imageUrl.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    // Vérification Google Search Console : balise absente tant que la variable est vide.
    googleSiteVerification: () => config.public.googleSiteVerification || undefined
  })

  useHead({
    htmlAttrs: { lang: locale },
    link: [
      { key: 'canonical', rel: 'canonical', href: canonicalUrl },
      { key: 'hreflang-fr', rel: 'alternate', hreflang: 'fr', href: frenchUrl },
      { key: 'hreflang-en', rel: 'alternate', hreflang: 'en', href: englishUrl },
      { key: 'hreflang-default', rel: 'alternate', hreflang: 'x-default', href: frenchUrl }
    ]
  })

  return { canonicalUrl, baseUrl, imageUrl, logoUrl }
}