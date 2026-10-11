import { queryCollection } from '@nuxt/content/server'

const staticPaths = [
  '/',
  '/services',
  '/realisations',
  '/process',
  '/tarifs-devis',
  '/a-propos',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite'
]

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/gu, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  })[character]!)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const origin = (config.public.siteUrl || getRequestURL(event).origin).replace(/\/+$/u, '')
  const frenchProjects = await queryCollection(event, 'realisations')
    .where('language', '=', 'fr')
    .all()
  const paths = [...staticPaths, ...frenchProjects.map(project => `/realisations/${project.slug}`)]

  const entries = paths.map((path) => {
    const frenchUrl = new URL(path, `${origin}/`).href
    const englishPath = path === '/' ? '/en' : `/en${path}`
    const englishUrl = new URL(englishPath, `${origin}/`).href
    const escapedFrenchUrl = escapeXml(frenchUrl)
    const escapedEnglishUrl = escapeXml(englishUrl)

    return [escapedFrenchUrl, escapedEnglishUrl].map(loc => [
      '<url>',
      `<loc>${loc}</loc>`,
      `<xhtml:link rel="alternate" hreflang="fr" href="${escapedFrenchUrl}" />`,
      `<xhtml:link rel="alternate" hreflang="en" href="${escapedEnglishUrl}" />`,
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapedFrenchUrl}" />`,
      '</url>'
    ].join('')).join('')
  }).join('')

  setResponseHeader(event, 'content-type', 'application/xml; charset=UTF-8')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`
})
