import { describe, expect, it } from 'vitest'
import { contactSchema, quoteSchema } from './form-schemas'
import { escapeHtml } from '../../server/utils/form-submission'

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
})

describe('email HTML escaping', () => {
  it('escapes apostrophes, quotes, ampersands and angle brackets', () => {
    expect(escapeHtml(`'"&<>`)).toBe('&#39;&quot;&amp;&lt;&gt;')
  })
})