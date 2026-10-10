import { z } from 'zod'

const honeypotSchema = z.string().max(500).optional().default('')

function normalizeText(value: unknown): unknown {
  if (typeof value !== 'string') return value

  return value
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF\u2060]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
}

function textField(minimum: number, maximum: number) {
  return z.preprocess(normalizeText, z.string().trim().min(minimum).max(maximum))
}

export const quoteSchema = z.object({
  name: textField(2, 120),
  email: z.string().trim().email().max(254),
  company: textField(0, 160).optional().default(''),
  projectType: z.enum(['site-vitrine', 'e-commerce', 'application-web', 'maintenance', 'autre']),
  budget: z.enum(['moins-250k', '250k-500k', '500k-1m', '1m-2m', 'plus-2m', 'a-definir']),
  deadline: textField(2, 120),
  description: textField(20, 5000),
  consent: z.literal(true),
  website: honeypotSchema
})

export const contactSchema = z.object({
  name: textField(2, 120),
  email: z.string().trim().email().max(254),
  message: textField(10, 5000),
  website: honeypotSchema
})

export type QuotePayload = z.infer<typeof quoteSchema>
export type ContactPayload = z.infer<typeof contactSchema>