import { describe, expect, it, vi } from 'vitest'
import { contactSchema, quoteSchema } from './form-schemas'
import { deliverFormSubmission, escapeHtml } from '../../server/utils/form-submission'

describe('form schemas', () => {
  it('accepts French names, apostrophes, punctuation, accents and multiline project details', () => {
    const result = quoteSchema.safeParse({
      name: "N'Diaye, M’Baye",
      email: 'client@example.com',
      company: "L'Atelier du Sénégal",
      projectType: 'e-commerce',
      budget: '500k-1m',
      deadline: "dans l'un des prochains mois, à l'automne",
      description: '« j\'ai une boutique à Dakar (Wave / Orange Money), budget environ 500 000 FCFA. Merci ! »\n\nÀ bientôt.',
      consent: true
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("N'Diaye, M’Baye")
      expect(result.data.company).toBe("L'Atelier du Sénégal")
      expect(result.data.deadline).toBe("dans l'un des prochains mois, à l'automne")
      expect(result.data.description).toContain('Merci ! » À bientôt.')
    }
  })

  it('accepts apostrophes and normalizes invisible characters and whitespace in contact messages', () => {
    const result = contactSchema.safeParse({
      name: "N'Diaye",
      email: 'client@example.com',
      message: 'J\u200B\'ai une question.\r\n\tMerci !'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toBe("J'ai une question. Merci !")
    }
  })

  it('rejects an invalid email address', () => {
    const result = contactSchema.safeParse({
      name: "N'Diaye",
      email: 'adresse-invalide',
      message: 'J’ai besoin de vous contacter.'
    })

    expect(result.success).toBe(false)
  })

  it('uses the renamed honeypot and treats an invalid duration as absent', () => {
    expect(contactSchema.shape).toHaveProperty('contact_pref_hp')
    expect(contactSchema.shape).not.toHaveProperty('website')
    expect(quoteSchema.shape).toHaveProperty('contact_pref_hp')
    expect(quoteSchema.shape).not.toHaveProperty('website')

    const result = contactSchema.safeParse({
      name: 'Client',
      email: 'client@example.com',
      message: 'A sufficiently long message.',
      fillDurationMs: 'invalid'
    })

    expect(result.success).toBe(true)
    if (result.success) expect(result.data.fillDurationMs).toBeUndefined()
  })
})

describe('email HTML escaping', () => {
  it('escapes apostrophes, quotes, ampersands and angle brackets', () => {
    expect(escapeHtml(`'"&<>`)).toBe('&#39;&quot;&amp;&lt;&gt;')
  })
})

describe('form anti-robot filters', () => {
  it('accepts a legitimate submission without a honeypot value and delivers the email', async () => {
    const sendEmail = vi.fn(async () => undefined)

    const result = await deliverFormSubmission('', 8000, sendEmail)

    expect(result).toEqual({ success: true })
    expect(sendEmail).toHaveBeenCalledOnce()
  })

  it('simulates success without sending email when the honeypot is filled', async () => {
    const sendEmail = vi.fn(async () => undefined)
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const result = await deliverFormSubmission('autofilled@example.com', 8000, sendEmail)

    expect(result).toEqual({ success: true })
    expect(sendEmail).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('[form-submission] honeypot déclenché (durée : 8000 ms)')
    expect(log.mock.calls.flat().join(' ')).not.toContain('autofilled@example.com')
    log.mockRestore()
  })

  it('simulates success without sending email when fillDurationMs is 2000', async () => {
    const sendEmail = vi.fn(async () => undefined)
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const result = await deliverFormSubmission('', 2000, sendEmail)

    expect(result).toEqual({ success: true })
    expect(sendEmail).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('[form-submission] trop rapide (durée : 2000 ms)')
    log.mockRestore()
  })

  it('sends email when fillDurationMs is 8000', async () => {
    const sendEmail = vi.fn(async () => undefined)
    const result = await deliverFormSubmission('', 8000, sendEmail)

    expect(result).toEqual({ success: true })
    expect(sendEmail).toHaveBeenCalledOnce()
  })

  it('sends email when fillDurationMs is absent or invalid', async () => {
    const sendEmail = vi.fn(async () => undefined)

    await expect(deliverFormSubmission('', undefined, sendEmail)).resolves.toEqual({ success: true })
    await expect(deliverFormSubmission('', Number.NaN, sendEmail)).resolves.toEqual({ success: true })
    expect(sendEmail).toHaveBeenCalledTimes(2)
  })
})