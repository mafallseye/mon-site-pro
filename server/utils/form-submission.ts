import type { H3Event } from 'h3'
import { Resend } from 'resend'
import type { ContactPayload, QuotePayload } from '../../shared/utils/form-schemas'

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const ipRequests = new Map<string, number[]>()

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]!)
}

export class FormSubmissionError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string
  ) {
    super(message)
  }
}

function logResendError(label: string, error: unknown, apiKey: string): void {
  const details = error instanceof Error
    ? `${error.name}: ${error.message}`
    : JSON.stringify(error) || 'Unknown error'

  console.error(label, details.replaceAll(apiKey, '[REDACTED]'))
}

export function enforceFormRateLimit(event: H3Event): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const recentRequests = (ipRequests.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS)

  if (recentRequests.length >= MAX_REQUESTS) {
    throw new FormSubmissionError(429, 'RATE_LIMITED', 'Trop de demandes envoyées. Réessayez dans quelques minutes.')
  }

  recentRequests.push(now)
  ipRequests.set(ip, recentRequests)
}

export async function sendFormEmail(
  payload: QuotePayload | ContactPayload,
  subject: string,
  text: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  const missingConfiguration = [
    !apiKey && 'RESEND_API_KEY',
    !to && 'CONTACT_TO_EMAIL',
    !from && 'CONTACT_FROM_EMAIL'
  ].filter((name): name is string => Boolean(name))

  if (missingConfiguration.length > 0) {
    console.error('[form-submission] Missing mail configuration:', missingConfiguration.join(', '))
    throw new FormSubmissionError(500, 'MAIL_NOT_CONFIGURED', 'Le service d’envoi est temporairement indisponible. Réessayez plus tard.')
  }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject,
      text,
      html: `<div style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(text)}</div>`
    })

    if (error) {
      logResendError('[form-submission] Resend delivery failed:', error, apiKey)
      throw new FormSubmissionError(502, 'MAIL_DELIVERY_FAILED', 'Votre message n’a pas pu être envoyé. Réessayez plus tard.')
    }

    if (!data?.id) {
      console.error('[form-submission] Resend returned no email ID')
      throw new FormSubmissionError(502, 'MAIL_DELIVERY_FAILED', 'Votre message n’a pas pu être envoyé. Réessayez plus tard.')
    }
  } catch (error) {
    if (error instanceof FormSubmissionError) {
      throw error
    }

    logResendError('[form-submission] Resend request failed:', error, apiKey)
    throw new FormSubmissionError(502, 'MAIL_DELIVERY_FAILED', 'Votre message n’a pas pu être envoyé. Réessayez plus tard.')
  }
}

export function respondToHoneypot(honeypotValue: string | undefined): boolean {
  return Boolean(honeypotValue?.trim())
}

export async function deliverFormSubmission(
  honeypotValue: string | undefined,
  fillDurationMs: number | undefined,
  deliver: () => Promise<void>
): Promise<{ success: true }> {
  if (respondToHoneypot(honeypotValue)) {
    console.info(`[form-submission] honeypot déclenché (durée : ${fillDurationMs ?? 'indisponible'} ms)`)
    return { success: true }
  }

  if (typeof fillDurationMs === 'number' && Number.isFinite(fillDurationMs) && fillDurationMs < 3000) {
    console.info(`[form-submission] trop rapide (durée : ${fillDurationMs} ms)`)
    return { success: true }
  }

  await deliver()
  return { success: true }
}

interface StoreThenNotifyOptions {
  /** Enregistre la demande (Supabase) et renvoie son id. */
  store: () => Promise<string>
  /** Envoie l'email (Resend). Lève FormSubmissionError en cas d'échec. */
  notify: () => Promise<void>
  /** Marque la demande enregistrée quand l'email n'a pas pu partir. */
  markNotificationFailed: (id: string) => Promise<void>
  /** Rend un message d'erreur journalisable (sans secret). */
  describeError: (error: unknown) => string
}

/**
 * Enregistre la demande AVANT l'envoi de l'email :
 * - si l'enregistrement échoue, l'erreur est journalisée et l'email part quand même ;
 * - si l'email échoue, la demande reste enregistrée (statut « notification_echouee »)
 *   et l'erreur est relancée pour que le visiteur voie un message clair.
 * À appeler dans le callback de deliverFormSubmission, donc après les filtres anti-spam.
 */
export async function storeThenNotify(options: StoreThenNotifyOptions): Promise<void> {
  let storedId: string | undefined
  try {
    storedId = await options.store()
  } catch (error) {
    console.error('[form-submission] Supabase storage failed:', options.describeError(error))
  }

  try {
    await options.notify()
  } catch (error) {
    if (storedId) {
      await options.markNotificationFailed(storedId).catch((statusError: unknown) => {
        console.error('[form-submission] Supabase status update failed:', options.describeError(statusError))
      })
    }
    throw error
  }
}

export function formErrorResponse(event: H3Event, error: unknown) {
  if (error instanceof FormSubmissionError) {
    setResponseStatus(event, error.statusCode)
    return { success: false, code: error.code, message: error.message }
  }

  console.error('[form-submission] Unexpected form handling error')
  setResponseStatus(event, 500)
  return { success: false, code: 'INTERNAL_ERROR', message: 'Une erreur est survenue. Réessayez plus tard.' }
}