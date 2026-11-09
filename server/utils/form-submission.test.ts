import { afterEach, describe, expect, it, vi } from 'vitest'
import { deliverFormSubmission, FormSubmissionError, storeThenNotify } from './form-submission'

const describeError = (error: unknown) => String(error)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('storeThenNotify', () => {
  it('enregistre avant d’envoyer l’email (issue « delivered »)', async () => {
    const calls: string[] = []
    const outcome = await storeThenNotify({
      store: async () => { calls.push('store'); return 'id-1' },
      notify: async () => { calls.push('notify') },
      markNotificationFailed: async () => { calls.push('mark') },
      describeError
    })
    expect(calls).toEqual(['store', 'notify'])
    expect(outcome).toBe('delivered')
  })

  it('envoie l’email même si Supabase échoue, et journalise l’erreur', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const notify = vi.fn().mockResolvedValue(undefined)
    const markNotificationFailed = vi.fn()

    await expect(storeThenNotify({
      store: () => Promise.reject(new Error('Supabase indisponible')),
      notify,
      markNotificationFailed,
      describeError
    })).resolves.toBe('delivered')

    expect(notify).toHaveBeenCalledOnce()
    expect(markNotificationFailed).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith('[form-submission] Supabase storage failed:', 'Error: Supabase indisponible')
  })

  it('Resend échoue mais demande enregistrée : statut marqué, issue « stored_only » (pas d’erreur)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const mailError = new FormSubmissionError(502, 'MAIL_DELIVERY_FAILED', 'Votre message n’a pas pu être envoyé.')
    const markNotificationFailed = vi.fn().mockResolvedValue(undefined)

    await expect(storeThenNotify({
      store: async () => 'id-42',
      notify: () => Promise.reject(mailError),
      markNotificationFailed,
      describeError
    })).resolves.toBe('stored_only')

    expect(markNotificationFailed).toHaveBeenCalledWith('id-42')
  })

  it('« stored_only » même si la mise à jour du statut échoue (erreur journalisée)', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mailError = new FormSubmissionError(500, 'MAIL_NOT_CONFIGURED', 'Indisponible')

    await expect(storeThenNotify({
      store: async () => 'id-7',
      notify: () => Promise.reject(mailError),
      markNotificationFailed: () => Promise.reject(new Error('PATCH refusé')),
      describeError
    })).resolves.toBe('stored_only')

    expect(consoleError).toHaveBeenCalledWith('[form-submission] Supabase status update failed:', 'Error: PATCH refusé')
  })

  it('Resend ET Supabase échouent : l’erreur Resend est relancée (rien n’est enregistré)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const mailError = new FormSubmissionError(502, 'MAIL_DELIVERY_FAILED', 'Votre message n’a pas pu être envoyé.')
    const markNotificationFailed = vi.fn()

    await expect(storeThenNotify({
      store: () => Promise.reject(new Error('Supabase indisponible')),
      notify: () => Promise.reject(mailError),
      markNotificationFailed,
      describeError
    })).rejects.toBe(mailError)

    expect(markNotificationFailed).not.toHaveBeenCalled()
  })
})

describe('deliverFormSubmission (anti-spam inchangé)', () => {
  it.each([
    ['honeypot rempli', 'robot', 10000],
    ['remplissage en moins de 3 s', '', 1200]
  ])('%s : succès simulé, rien n’est enregistré ni envoyé', async (_label, honeypot, duration) => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const deliver = vi.fn()
    await expect(deliverFormSubmission(honeypot, duration, deliver)).resolves.toEqual({ success: true })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('appelle la livraison pour une soumission humaine', async () => {
    const deliver = vi.fn().mockResolvedValue(undefined)
    await deliverFormSubmission('', 8000, deliver)
    expect(deliver).toHaveBeenCalledOnce()
  })
})
