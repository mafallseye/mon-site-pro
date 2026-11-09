import type { ContactPayload, QuotePayload } from '../../shared/utils/form-schemas'

/**
 * Enregistrement des formulaires dans Supabase via l'API REST (PostgREST), côté serveur uniquement.
 * La clé service_role vient du runtimeConfig PRIVÉ (NUXT_SUPABASE_SERVICE_ROLE_KEY) : elle ne doit
 * jamais être exposée au navigateur. Elle contourne la RLS : les tables n'ont aucune politique
 * de lecture publique (voir supabase/migrations).
 */

export interface SupabaseConfig {
  url: string
  serviceRoleKey: string
}

export type SupabaseTable = 'quote_requests' | 'contact_messages'

/** Statut posé quand la demande est enregistrée mais que l'email Resend n'a pas pu partir. */
export const NOTIFICATION_FAILED_STATUS = 'notification_echouee'

export class SupabaseStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseStorageError'
  }
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>

export function toQuoteRequestRow(payload: QuotePayload) {
  return {
    name: payload.name,
    email: payload.email,
    company: payload.company || null,
    project_type: payload.projectType,
    budget: payload.budget,
    deadline: payload.deadline,
    description: payload.description,
    language: payload.language
  }
}

export function toContactMessageRow(payload: ContactPayload) {
  return {
    name: payload.name,
    email: payload.email,
    message: payload.message,
    language: payload.language
  }
}

function assertConfigured(config: SupabaseConfig): void {
  const missing = [
    !config.url && 'NUXT_SUPABASE_URL',
    !config.serviceRoleKey && 'NUXT_SUPABASE_SERVICE_ROLE_KEY'
  ].filter(Boolean)
  if (missing.length) throw new SupabaseStorageError(`Supabase non configuré (${missing.join(', ')})`)
}

function restUrl(config: SupabaseConfig, table: SupabaseTable, query: string): string {
  return `${config.url.replace(/\/+$/u, '')}/rest/v1/${table}?${query}`
}

function headers(config: SupabaseConfig, prefer: string): Record<string, string> {
  return {
    'apikey': config.serviceRoleKey,
    'Authorization': `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    'Prefer': prefer
  }
}

/** Message d'erreur sans jamais recopier la clé. */
export function redactSupabaseError(error: unknown, config: Pick<SupabaseConfig, 'serviceRoleKey'>): string {
  const details = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  return config.serviceRoleKey ? details.replaceAll(config.serviceRoleKey, '[REDACTED]') : details
}

async function failure(response: Response, action: string): Promise<SupabaseStorageError> {
  const body = await response.text().catch(() => '')
  return new SupabaseStorageError(`${action} : HTTP ${response.status} ${body.slice(0, 300)}`.trim())
}

/** Insère une ligne et renvoie son id. Lève SupabaseStorageError en cas d'échec. */
export async function insertSupabaseRow(
  config: SupabaseConfig,
  table: SupabaseTable,
  row: Record<string, unknown>,
  fetchImpl: FetchLike = fetch
): Promise<string> {
  assertConfigured(config)
  const response = await fetchImpl(restUrl(config, table, 'select=id'), {
    method: 'POST',
    headers: headers(config, 'return=representation'),
    body: JSON.stringify(row)
  })
  if (!response.ok) throw await failure(response, `Insertion dans ${table} refusée`)

  const data = await response.json() as Array<{ id?: string }>
  const id = data[0]?.id
  if (!id) throw new SupabaseStorageError(`Insertion dans ${table} : aucun id renvoyé`)
  return id
}

/** Met à jour le statut d'une ligne existante. Lève SupabaseStorageError en cas d'échec. */
export async function updateSupabaseStatus(
  config: SupabaseConfig,
  table: SupabaseTable,
  id: string,
  status: string,
  fetchImpl: FetchLike = fetch
): Promise<void> {
  assertConfigured(config)
  const response = await fetchImpl(restUrl(config, table, `id=eq.${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: headers(config, 'return=minimal'),
    body: JSON.stringify({ status })
  })
  if (!response.ok) throw await failure(response, `Mise à jour du statut dans ${table} refusée`)
}
