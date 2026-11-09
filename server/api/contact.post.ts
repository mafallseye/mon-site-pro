import { contactSchema } from '../../shared/utils/form-schemas'
import { deliverFormSubmission, enforceFormRateLimit, formErrorResponse, sendFormEmail, storeThenNotify } from '../utils/form-submission'
import { insertSupabaseRow, NOTIFICATION_FAILED_STATUS, redactSupabaseError, toContactMessageRow, updateSupabaseStatus } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    enforceFormRateLimit(event)
    const body: unknown = await readBody(event)
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues
          .map(issue => String(issue.path[0] || ''))
          .filter(field => field && field !== 'contact_pref_hp' && field !== 'fillDurationMs')
          .map(field => [field, ['invalid']])
      )
      setResponseStatus(event, 400)
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Certains champs sont invalides. Vérifiez le formulaire.',
        fieldErrors
      }
    }

    const payload = result.data
    const text = [
      'Nouveau message de contact',
      `Nom : ${payload.name}`,
      `Email : ${payload.email}`,
      `Langue : ${payload.language.toUpperCase()}`,
      '',
      'Message :',
      payload.message
    ].join('\n')

    const config = useRuntimeConfig(event)
    const supabase = { url: config.supabaseUrl, serviceRoleKey: config.supabaseServiceRoleKey }

    return await deliverFormSubmission(
      payload.contact_pref_hp,
      payload.fillDurationMs,
      () => storeThenNotify({
        store: () => insertSupabaseRow(supabase, 'contact_messages', toContactMessageRow(payload)),
        notify: () => sendFormEmail(payload, `Message de ${payload.name}`, text),
        markNotificationFailed: id => updateSupabaseStatus(supabase, 'contact_messages', id, NOTIFICATION_FAILED_STATUS),
        describeError: error => redactSupabaseError(error, supabase)
      })
    )
  } catch (error) {
    return formErrorResponse(event, error)
  }
})