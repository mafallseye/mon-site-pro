import { describe, expect, it, vi } from 'vitest'
import {
  insertSupabaseRow,
  redactSupabaseError,
  SupabaseStorageError,
  toContactMessageRow,
  toQuoteRequestRow,
  updateSupabaseStatus
} from './supabase'

const config = { url: 'https://projet.supabase.co/', serviceRoleKey: 'service-role-secret' }

function jsonResponse(body: unknown, status = 201) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('toQuoteRequestRow / toContactMessageRow', () => {
  it('ne garde que les colonnes de la table (pas de honeypot, durée ni consentement)', () => {
    const row = toQuoteRequestRow({
      name: 'Aïssatou N’Diaye',
      email: 'a@example.com',
      company: '',
      projectType: 'e-commerce',
      budget: 'a-definir',
      deadline: 'Juin',
      description: 'Une boutique en ligne « bilingue » pour l’atelier.',
      consent: true,
      language: 'fr',
      contact_pref_hp: '',
      fillDurationMs: 12000
    })
    expect(row).toEqual({
      name: 'Aïssatou N’Diaye',
      email: 'a@example.com',
      company: null,
      project_type: 'e-commerce',
      budget: 'a-definir',
      deadline: 'Juin',
      description: 'Une boutique en ligne « bilingue » pour l’atelier.',
      language: 'fr'
    })
  })

  it('mappe un message de contact', () => {
    expect(toContactMessageRow({ name: 'Jo', email: 'j@example.com', message: 'Bonjour à vous', language: 'en', contact_pref_hp: '', fillDurationMs: undefined }))
      .toEqual({ name: 'Jo', email: 'j@example.com', message: 'Bonjour à vous', language: 'en' })
  })
})

describe('insertSupabaseRow', () => {
  it('appelle PostgREST avec la clé service_role et renvoie l’id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ id: 'uuid-1' }]))
    const id = await insertSupabaseRow(config, 'quote_requests', { name: 'A' }, fetchMock)

    expect(id).toBe('uuid-1')
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://projet.supabase.co/rest/v1/quote_requests?select=id')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      apikey: 'service-role-secret',
      Authorization: 'Bearer service-role-secret',
      Prefer: 'return=representation'
    })
    expect(JSON.parse(init.body)).toEqual({ name: 'A' })
  })

  it('lève une SupabaseStorageError si la réponse est en erreur', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"message":"violates check constraint"}', { status: 400 }))
    await expect(insertSupabaseRow(config, 'quote_requests', {}, fetchMock)).rejects.toThrow(/HTTP 400.*check constraint/)
  })

  it('lève une erreur si aucun id n’est renvoyé', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
    await expect(insertSupabaseRow(config, 'contact_messages', {}, fetchMock)).rejects.toBeInstanceOf(SupabaseStorageError)
  })

  it('n’appelle pas le réseau si la configuration manque', async () => {
    const fetchMock = vi.fn()
    await expect(insertSupabaseRow({ url: '', serviceRoleKey: '' }, 'quote_requests', {}, fetchMock))
      .rejects.toThrow('Supabase non configuré (NUXT_SUPABASE_URL, NUXT_SUPABASE_SERVICE_ROLE_KEY)')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('updateSupabaseStatus', () => {
  it('envoie un PATCH filtré sur l’id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    await updateSupabaseStatus(config, 'quote_requests', 'uuid-1', 'notification_echouee', fetchMock)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://projet.supabase.co/rest/v1/quote_requests?id=eq.uuid-1')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ status: 'notification_echouee' })
  })
})

describe('redactSupabaseError', () => {
  it('masque la clé dans les messages journalisés', () => {
    expect(redactSupabaseError(new Error('bad key service-role-secret'), config)).toBe('Error: bad key [REDACTED]')
  })
})
