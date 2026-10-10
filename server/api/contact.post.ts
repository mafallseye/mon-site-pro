import { contactSchema } from '../../shared/utils/form-schemas'
import { enforceFormRateLimit, formErrorResponse, respondToHoneypot, sendFormEmail } from '../utils/form-submission'

export default defineEventHandler(async (event) => {
  try {
    enforceFormRateLimit(event)
    const body: unknown = await readBody(event)
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues
          .map(issue => String(issue.path[0] || ''))
          .filter(field => field && field !== 'website')
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

    if (respondToHoneypot(result.data.website)) {
      setResponseStatus(event, 400)
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Certaines données sont invalides.'
      }
    }

    const payload = result.data
    const text = [
      'Nouveau message de contact',
      `Nom : ${payload.name}`,
      `Email : ${payload.email}`,
      '',
      'Message :',
      payload.message
    ].join('\n')

    await sendFormEmail(payload, 'Nouveau message de contact — DIGISERVICE', text)
    return { success: true }
  } catch (error) {
    return formErrorResponse(event, error)
  }
})