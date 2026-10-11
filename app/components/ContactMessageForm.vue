<script setup lang="ts">
import { contactSchema } from '../../shared/utils/form-schemas'
import type { ContactPayload } from '../../shared/utils/form-schemas'

const { t, locale } = useI18n()
const form = reactive({ name: '', email: '', message: '', website: '' })
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fieldErrors = reactive<Record<string, string>>({})
const errorMessage = ref('')

function clearFieldError(field: string) {
  delete fieldErrors[field]
  errorMessage.value = ''
  if (status.value === 'error') status.value = 'idle'
}

function setValidationErrors(issues: Array<{ path: PropertyKey[], code: string }>) {
  for (const issue of issues) {
    const field = String(issue.path[0] || '')
    if (!field || field === 'website') continue
    const key = issue.code === 'invalid_format'
      ? 'email'
      : issue.code === 'too_small' && field === 'message'
        ? 'tooShort'
        : issue.code === 'invalid_type' || issue.code === 'too_small'
          ? 'required'
          : 'invalid'
    fieldErrors[field] = t(`forms.errors.${key}`)
  }
}

async function submitForm() {
  errorMessage.value = ''
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]

  const parsed = contactSchema.safeParse({ ...form, language: locale.value })
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
    await $fetch('/api/contact', { method: 'POST', body: parsed.data as ContactPayload })
    status.value = 'success'
    Object.assign(form, { name: '', email: '', message: '', website: '' })
  } catch (error) {
    const response = error as {
      data?: {
        data?: { code?: string, fieldErrors?: Record<string, string[]> }
        code?: string
        fieldErrors?: Record<string, string[]>
      }
    }
    const apiError = response.data?.data || response.data
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        if (field === 'email') fieldErrors[field] = t('forms.errors.email')
        else if (field !== 'website' && messages.length) fieldErrors[field] = t('forms.errors.invalid')
      }
    }
    errorMessage.value = apiError?.code === 'RATE_LIMITED'
      ? t('forms.errors.rateLimited')
      : apiError?.code === 'MAIL_NOT_CONFIGURED' || apiError?.code === 'MAIL_DELIVERY_FAILED'
        ? t('forms.errors.unavailable')
        : apiError?.code === 'VALIDATION_ERROR'
          ? t('forms.errors.invalid')
          : t('forms.errors.sendFailed')
    status.value = 'error'
  }
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 class="text-2xl font-bold text-primary">{{ t('pages.contact.formTitle') }}</h2>
    <form class="mt-6 space-y-5" :aria-busy="status === 'loading'" novalidate @submit.prevent="submitForm">
      <div class="sr-only" aria-hidden="true">
        <label for="contact-website">{{ t('forms.honeypotLabel') }}</label>
        <input id="contact-website" v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off">
      </div>

      <div>
        <label for="contact-name" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.contact.name') }} <span aria-hidden="true">*</span></label>
        <input id="contact-name" v-model="form.name" name="name" autocomplete="name" required maxlength="120" :aria-invalid="Boolean(fieldErrors.name)" :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.contact.placeholderName')" @input="clearFieldError('name')">
        <p v-if="fieldErrors.name" id="contact-name-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.name }}</p>
      </div>

      <div>
        <label for="contact-email" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.contact.email') }} <span aria-hidden="true">*</span></label>
        <input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" required maxlength="254" :aria-invalid="Boolean(fieldErrors.email)" :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.contact.placeholderEmail')" @input="clearFieldError('email')">
        <p v-if="fieldErrors.email" id="contact-email-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.email }}</p>
      </div>

      <div>
        <label for="contact-message" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.contact.message') }} <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" v-model="form.message" name="message" required minlength="10" maxlength="5000" rows="6" :aria-invalid="Boolean(fieldErrors.message)" :aria-describedby="fieldErrors.message ? 'contact-message-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.contact.placeholderMessage')" @input="clearFieldError('message')" />
        <p v-if="fieldErrors.message" id="contact-message-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.message }}</p>
      </div>

      <p v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>
      <p v-if="status === 'success'" role="status" aria-live="polite" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{{ t('pages.contact.success') }}</p>
      <button type="submit" :disabled="status === 'loading'" class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-6 py-3 font-bold text-primary transition hover:bg-amber-400 focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        <span v-if="status === 'loading'">{{ t('pages.contact.sending') }}</span>
        <span v-else>{{ t('pages.contact.submit') }}</span>
      </button>
    </form>
  </section>
</template>
