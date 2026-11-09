import type { ZodType } from 'zod'

/** 'received' : demande enregistrée mais email non envoyé (réponse 202 STORED_NOTIFICATION_FAILED). */
type FormStatus = 'idle' | 'loading' | 'success' | 'received' | 'error'

interface ApiErrorBody {
  code?: string
  fieldErrors?: Record<string, string[]>
}

interface FormSubmissionOptions<T extends Record<string, unknown>> {
  /** Schéma Zod partagé client/serveur (shared/utils/form-schemas.ts). */
  schema: ZodType
  /** Route serveur : /api/devis ou /api/contact. */
  endpoint: string
  /** Valeurs initiales, réutilisées pour vider le formulaire après envoi. */
  initialValues: () => T
  /** Champ texte long dont l'erreur « too_small » se traduit par forms.errors.tooShort. */
  longTextField: keyof T & string
}

/** Champs anti-spam : jamais affichés comme erreurs à l'utilisateur. */
const HIDDEN_FIELDS = new Set(['contact_pref_hp', 'fillDurationMs'])

/**
 * Logique commune aux formulaires de devis et de contact : validation Zod côté client,
 * honeypot et durée de remplissage, envoi, traduction des codes d'erreur serveur.
 */
export function useFormSubmission<T extends Record<string, unknown>>(options: FormSubmissionOptions<T>) {
  const { t, locale } = useI18n()
  const form = reactive(options.initialValues()) as T
  const formStartedAt = ref<number>()
  const status = ref<FormStatus>('idle')
  const fieldErrors = reactive<Record<string, string>>({})
  const errorMessage = ref('')

  onMounted(() => {
    formStartedAt.value = performance.now()
  })

  function clearFieldError(field: string) {
    delete fieldErrors[field]
    errorMessage.value = ''
    if (status.value === 'error') status.value = 'idle'
  }

  function clearAllErrors() {
    errorMessage.value = ''
    for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
  }

  function setValidationErrors(issues: Array<{ path: PropertyKey[], code: string }>) {
    for (const issue of issues) {
      const field = String(issue.path[0] || '')
      if (!field || HIDDEN_FIELDS.has(field)) continue
      const key = issue.code === 'invalid_format'
        ? 'email'
        : issue.code === 'too_small' && field === options.longTextField
          ? 'tooShort'
          : issue.code === 'invalid_type' || issue.code === 'too_small' || issue.code === 'invalid_value'
            ? 'required'
            : 'invalid'
      fieldErrors[field] = t(`forms.errors.${key}`)
    }
  }

  function handleApiError(error: unknown) {
    const response = error as { data?: ApiErrorBody & { data?: ApiErrorBody } }
    const apiError = response.data?.data || response.data
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        if (field === 'email') fieldErrors[field] = t('forms.errors.email')
        else if (!HIDDEN_FIELDS.has(field) && messages.length) fieldErrors[field] = t('forms.errors.invalid')
      }
    }

    const code = apiError?.code
    errorMessage.value = code === 'RATE_LIMITED'
      ? t('forms.errors.rateLimited')
      : code === 'MAIL_NOT_CONFIGURED' || code === 'MAIL_DELIVERY_FAILED'
        ? t('forms.errors.unavailable')
        : code === 'VALIDATION_ERROR'
          ? t('forms.errors.invalid')
          : t('forms.errors.sendFailed')
    status.value = 'error'
  }

  async function submitForm() {
    clearAllErrors()

    const fillDurationMs = formStartedAt.value === undefined
      ? undefined
      : performance.now() - formStartedAt.value
    const parsed = options.schema.safeParse({ ...form, language: locale.value, fillDurationMs })
    if (!parsed.success) {
      setValidationErrors(parsed.error.issues)
      status.value = 'error'
      errorMessage.value = t('forms.errors.invalid')
      await nextTick()
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    status.value = 'loading'
    try {
      const response = await $fetch<{ success: boolean, code?: string }>(options.endpoint, { method: 'POST', body: parsed.data as Record<string, unknown> })
      status.value = response?.code === 'STORED_NOTIFICATION_FAILED' ? 'received' : 'success'
      Object.assign(form, options.initialValues())
      formStartedAt.value = performance.now()
    } catch (error) {
      handleApiError(error)
    }
  }

  return { form, status, fieldErrors, errorMessage, clearFieldError, submitForm }
}
