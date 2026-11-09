import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * Tests de bout en bout des routes /api/devis et /api/contact :
 * les fonctions globales de Nitro/h3 sont simulées, Resend est simulé, fetch (Supabase) est simulé.
 * Aucun appel réseau, aucun email réel.
 */

const resendSend = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendSend }
  }
}))

type Handler = (event: FakeEvent) => Promise<Record<string, unknown>>
interface FakeEvent { body: unknown, ip: string, status: number }

let ipCounter = 0
const runtimeConfig = { supabaseUrl: 'https://projet.supabase.co', supabaseServiceRoleKey: 'service-role-secret' }
const fetchMock = vi.fn()

let devis: Handler
let contact: Handler

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (handler: Handler) => handler)
  vi.stubGlobal('readBody', async (event: FakeEvent) => event.body)
  vi.stubGlobal('getRequestIP', (event: FakeEvent) => event.ip)
  vi.stubGlobal('setResponseStatus', (event: FakeEvent, status: number) => { event.status = status })
  vi.stubGlobal('useRuntimeConfig', () => runtimeConfig)
  devis = (await import('./devis.post')).default as unknown as Handler
  contact = (await import('./contact.post')).default as unknown as Handler
})

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.stubEnv('CONTACT_TO_EMAIL', 'moi@example.com')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'site@example.com')
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'info').mockImplementation(() => {})
})

afterEach(() => {
  fetchMock.mockReset()
  resendSend.mockReset()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

function event(body: unknown): FakeEvent {
  ipCounter += 1
  return { body, ip: `10.0.0.${ipCounter}`, status: 200 }
}

const quoteBody = {
  name: 'Aïssatou N’Diaye',
  email: 'aissatou@example.com',
  company: 'Atelier « Teranga »',
  projectType: 'site-vitrine',
  budget: '250k-500k',
  deadline: 'Septembre',
  description: 'Un site vitrine bilingue pour présenter l’atelier.',
  consent: true,
  language: 'fr',
  contact_pref_hp: '',
  fillDurationMs: 15000
}

const contactBody = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I would like to talk.',
  language: 'en',
  contact_pref_hp: '',
  fillDurationMs: 9000
}

function supabaseInsertOk(id = 'uuid-1') {
  return new Response(JSON.stringify([{ id }]), { status: 201 })
}

describe('POST /api/devis', () => {
  it('enregistre dans quote_requests puis envoie l’email', async () => {
    const order: string[] = []
    fetchMock.mockImplementation(async () => { order.push('supabase'); return supabaseInsertOk() })
    resendSend.mockImplementation(async () => { order.push('resend'); return { data: { id: 'mail-1' }, error: null } })

    const e = event(quoteBody)
    await expect(devis(e)).resolves.toEqual({ success: true })
    expect(order).toEqual(['supabase', 'resend'])

    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://projet.supabase.co/rest/v1/quote_requests?select=id')
    expect(JSON.parse(init.body)).toEqual({
      name: 'Aïssatou N’Diaye',
      email: 'aissatou@example.com',
      company: 'Atelier « Teranga »',
      project_type: 'site-vitrine',
      budget: '250k-500k',
      deadline: 'Septembre',
      description: 'Un site vitrine bilingue pour présenter l’atelier.',
      language: 'fr'
    })
    expect(resendSend.mock.calls[0]![0]).toMatchObject({ replyTo: 'aissatou@example.com' })
  })

  it('envoie l’email si Supabase échoue et journalise sans la clé', async () => {
    fetchMock.mockRejectedValue(new Error('connexion refusée (service-role-secret)'))
    resendSend.mockResolvedValue({ data: { id: 'mail-1' }, error: null })

    await expect(devis(event(quoteBody))).resolves.toEqual({ success: true })
    expect(resendSend).toHaveBeenCalledOnce()
    const logged = vi.mocked(console.error).mock.calls.flat().join(' ')
    expect(logged).toContain('Supabase storage failed')
    expect(logged).not.toContain('service-role-secret')
  })

  it('envoie l’email si Supabase n’est pas configuré', async () => {
    const saved = { ...runtimeConfig }
    runtimeConfig.supabaseUrl = ''
    runtimeConfig.supabaseServiceRoleKey = ''
    resendSend.mockResolvedValue({ data: { id: 'mail-1' }, error: null })
    try {
      await expect(devis(event(quoteBody))).resolves.toEqual({ success: true })
      expect(fetchMock).not.toHaveBeenCalled()
      expect(resendSend).toHaveBeenCalledOnce()
    } finally {
      Object.assign(runtimeConfig, saved)
    }
  })

  it('garde la demande, la marque « notification_echouee » et renvoie MAIL_DELIVERY_FAILED si Resend échoue', async () => {
    fetchMock
      .mockResolvedValueOnce(supabaseInsertOk('uuid-9'))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    resendSend.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'boom' } })

    const e = event(quoteBody)
    const response = await devis(e)
    expect(e.status).toBe(502)
    expect(response).toMatchObject({ success: false, code: 'MAIL_DELIVERY_FAILED' })

    const [patchUrl, patchInit] = fetchMock.mock.calls[1]!
    expect(patchUrl).toBe('https://projet.supabase.co/rest/v1/quote_requests?id=eq.uuid-9')
    expect(JSON.parse(patchInit.body)).toEqual({ status: 'notification_echouee' })
  })

  it('renvoie MAIL_NOT_CONFIGURED (demande enregistrée) si Resend n’est pas configuré', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    fetchMock.mockResolvedValueOnce(supabaseInsertOk('uuid-3')).mockResolvedValueOnce(new Response(null, { status: 204 }))

    const e = event(quoteBody)
    expect(await devis(e)).toMatchObject({ success: false, code: 'MAIL_NOT_CONFIGURED' })
    expect(e.status).toBe(500)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['honeypot', { contact_pref_hp: 'http://spam.example' }],
    ['durée < 3 s', { fillDurationMs: 800 }]
  ])('anti-spam (%s) : succès simulé, ni enregistrement ni email', async (_label, override) => {
    await expect(devis(event({ ...quoteBody, ...override }))).resolves.toEqual({ success: true })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(resendSend).not.toHaveBeenCalled()
  })

  it('validation : 400 sans enregistrement ni email', async () => {
    const e = event({ ...quoteBody, email: 'pas-un-email' })
    expect(await devis(e)).toMatchObject({ success: false, code: 'VALIDATION_ERROR', fieldErrors: { email: ['invalid'] } })
    expect(e.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/contact', () => {
  it('enregistre dans contact_messages puis envoie l’email', async () => {
    fetchMock.mockResolvedValue(supabaseInsertOk())
    resendSend.mockResolvedValue({ data: { id: 'mail-2' }, error: null })

    await expect(contact(event(contactBody))).resolves.toEqual({ success: true })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://projet.supabase.co/rest/v1/contact_messages?select=id')
    expect(JSON.parse(init.body)).toEqual({ name: 'John Doe', email: 'john@example.com', message: 'Hello, I would like to talk.', language: 'en' })
    expect(resendSend).toHaveBeenCalledOnce()
  })

  it('envoie l’email si Supabase répond en erreur', async () => {
    fetchMock.mockResolvedValue(new Response('{"message":"permission denied"}', { status: 401 }))
    resendSend.mockResolvedValue({ data: { id: 'mail-2' }, error: null })
    await expect(contact(event(contactBody))).resolves.toEqual({ success: true })
    expect(resendSend).toHaveBeenCalledOnce()
  })

  it('garde le message et renvoie une erreur claire si Resend échoue', async () => {
    fetchMock.mockResolvedValueOnce(supabaseInsertOk('uuid-c')).mockResolvedValueOnce(new Response(null, { status: 204 }))
    resendSend.mockRejectedValue(new Error('network down'))

    const e = event(contactBody)
    expect(await contact(e)).toMatchObject({ success: false, code: 'MAIL_DELIVERY_FAILED' })
    expect(e.status).toBe(502)
    expect(JSON.parse(fetchMock.mock.calls[1]![1].body)).toEqual({ status: 'notification_echouee' })
  })

  it('anti-spam : honeypot rempli, rien n’est enregistré', async () => {
    await expect(contact(event({ ...contactBody, contact_pref_hp: 'x' }))).resolves.toEqual({ success: true })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(resendSend).not.toHaveBeenCalled()
  })
})
