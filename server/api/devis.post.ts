import { quoteSchema } from '../../shared/utils/form-schemas'
import { budgetOptions, projectTypeOptions } from '../../shared/utils/form-options'
import fr from '../../i18n/locales/fr.json'
import { deliverFormSubmission, enforceFormRateLimit, formErrorResponse, sendFormEmail, storeThenNotify } from '../utils/form-submission'
import { insertSupabaseRow, NOTIFICATION_FAILED_STATUS, redactSupabaseError, toQuoteRequestRow, updateSupabaseStatus } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    enforceFormRateLimit(event)
    const body: unknown = await readBody(event)
    const result = quoteSchema.safeParse(body)

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
    const projectTypeOption = projectTypeOptions.find(option => option.value === payload.projectType)!
    const budgetOption = budgetOptions.find(option => option.value === payload.budget)!
    const projectTypeLabel = fr.forms.projectTypes[projectTypeOption.messageKey]
    const budgetLabel = fr.forms.budgets[budgetOption.messageKey]
    const companySuffix = payload.company ? ` (${payload.company})` : ''
    const text = [
      'Nouvelle demande de devis',
      `Nom : ${payload.name}`,
      `Email : ${payload.email}`,
      `Entreprise : ${payload.company || 'Non renseignée'}`,
      `Type de projet : ${projectTypeLabel}`,
      `Budget approximatif : ${budgetLabel}`,
      `Délai souhaité : ${payload.deadline}`,
      `Consentement : ${payload.consent ? 'Oui' : 'Non'}`,
      `Langue : ${payload.language.toUpperCase()}`,
      '',
      'Description du projet :',
      payload.description
    ].join('\n')

    const config = useRuntimeConfig(event)
    const supabase = { url: config.supabaseUrl, serviceRoleKey: config.supabaseServiceRoleKey }

    return await deliverFormSubmission(
      payload.contact_pref_hp,
      payload.fillDurationMs,
      () => storeThenNotify({
        store: () => insertSupabaseRow(supabase, 'quote_requests', toQuoteRequestRow(payload)),
        notify: () => sendFormEmail(payload, `Devis : ${projectTypeLabel}, ${payload.name}${companySuffix}`, text),
        markNotificationFailed: id => updateSupabaseStatus(supabase, 'quote_requests', id, NOTIFICATION_FAILED_STATUS),
        describeError: error => redactSupabaseError(error, supabase)
      })
    )
  } catch (error) {
    return formErrorResponse(event, error)
  }
})