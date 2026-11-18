export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const origin = (config.public.siteUrl || getRequestURL(event).origin).replace(/\/+$/u, '')

  setResponseHeader(event, 'content-type', 'text/plain; charset=UTF-8')
  return [
    'User-Agent: *',
    'Disallow:',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n')
})
