import { quoteSchema } from '../../shared/utils/form-schemas'
import { enforceFormRateLimit, formErrorResponse, respondToHoneypot, sendFormEmail } from '../utils/form-submission'

export default defineEventHandler(async (event) => {
  try {
    enforceFormRateLimit(event)
    const body: unknown = await readBody(event)
    const result = quoteSchema.safeParse(body)

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
      'Nouvelle demande de devis',
      `Nom : ${payload.name}`,
      `Email : ${payload.email}`,
      `Entreprise : ${payload.company || 'Non renseignée'}`,
      `Type de projet : ${payload.projectType}`,
      `Budget approximatif : ${payload.budget}`,
      `Délai souhaité : ${payload.deadline}`,
      `Consentement : ${payload.consent ? 'Oui' : 'Non'}`,
      '',
      'Description du projet :',
      payload.description
    ].join('\n')

    await sendFormEmail(payload, 'Nouvelle demande de devis — DIGISERVICE', text)
    return { success: true }
  } catch (error) {
    return formErrorResponse(event, error)
  }
})