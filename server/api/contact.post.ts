import { contactSchema } from '../../shared/utils/form-schemas'
import { deliverFormSubmission, enforceFormRateLimit, formErrorResponse, sendFormEmail } from '../utils/form-submission'

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

    return await deliverFormSubmission(
      payload.contact_pref_hp,
      payload.fillDurationMs,
      () => sendFormEmail(payload, `Message de ${payload.name}`, text)
    )
  } catch (error) {
    return formErrorResponse(event, error)
  }
})