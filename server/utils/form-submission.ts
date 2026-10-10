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

export function respondToHoneypot(website: string | undefined): boolean {
  return Boolean(website?.trim())
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