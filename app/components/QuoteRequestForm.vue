<script setup lang="ts">
import { quoteSchema } from '../../shared/utils/form-schemas'
import type { QuotePayload } from '../../shared/utils/form-schemas'

const { t } = useI18n()
const localePath = useLocalePath()
const form = reactive({
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  deadline: '',
  description: '',
  consent: false,
  website: ''
})
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fieldErrors = reactive<Record<string, string>>({})
const errorMessage = ref('')

const projectTypes = [
  ['site-vitrine', 'forms.projectTypes.siteVitrine'],
  ['e-commerce', 'forms.projectTypes.ecommerce'],
  ['application-web', 'forms.projectTypes.webApp'],
  ['maintenance', 'forms.projectTypes.maintenance'],
  ['autre', 'forms.projectTypes.other']
] as const

const budgetOptions = [
  ['moins-250k', 'forms.budgets.less250k'],
  ['250k-500k', 'forms.budgets.250to500k'],
  ['500k-1m', 'forms.budgets.500kto1m'],
  ['1m-2m', 'forms.budgets.1to2m'],
  ['plus-2m', 'forms.budgets.over2m'],
  ['a-definir', 'forms.budgets.undecided']
] as const

const priceExamples = computed(() => [0, 1, 2, 3].map(index => ({
  service: t(`quoteStartingPrices.${index}.service`),
  amount: t(`quoteStartingPrices.${index}.amount`)
})))

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
      : issue.code === 'too_small' && field === 'description'
        ? 'tooShort'
        : issue.code === 'invalid_type' || issue.code === 'too_small' || issue.code === 'invalid_value'
          ? 'required'
          : 'invalid'
    fieldErrors[field] = t(`forms.errors.${key}`)
  }
}

function handleApiError(error: unknown) {
  const response = error as {
    data?: {
      data?: { code?: string, fieldErrors?: Record<string, string[]> }
      statusCode?: number
    }
  }
  const apiError = response.data?.data || response.data as { code?: string, fieldErrors?: Record<string, string[]> }
  if (apiError?.fieldErrors) {
    for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
      if (field === 'email') fieldErrors[field] = t('forms.errors.email')
      else if (field === 'website') continue
      else if (messages.length) fieldErrors[field] = t('forms.errors.invalid')
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
  errorMessage.value = ''
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]

  const parsed = quoteSchema.safeParse(form)
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
    await $fetch('/api/devis', { method: 'POST', body: parsed.data as QuotePayload })
    status.value = 'success'
    Object.assign(form, {
      name: '', email: '', company: '', projectType: '', budget: '', deadline: '', description: '', consent: false, website: ''
    })
  } catch (error) {
    handleApiError(error)
  }
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 class="text-2xl font-bold text-primary">{{ t('pages.quote.formTitle') }}</h2>
    <p class="mt-2 text-sm text-slate-600">{{ t('pages.quote.formIntro') }}</p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <article v-for="price in priceExamples" :key="price.service" class="rounded-xl bg-surface p-4">
        <h3 class="text-sm font-semibold text-primary">{{ price.service }}</h3>
        <p class="mt-2 text-lg font-bold text-primary-light"><span class="text-xs font-medium text-slate-500">{{ t('pages.quote.startingAt') }}</span> {{ price.amount }}</p>
      </article>
    </div>
    <p class="mt-4 text-xs leading-5 text-slate-500">{{ t('pages.quote.disclaimer') }}</p>

    <form class="mt-8 space-y-5" :aria-busy="status === 'loading'" novalidate @submit.prevent="submitForm">
      <div class="sr-only" aria-hidden="true">
        <label for="quote-website">{{ t('forms.honeypotLabel') }}</label>
        <input id="quote-website" v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off">
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="quote-name" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.name') }} <span aria-hidden="true">*</span></label>
          <input id="quote-name" v-model="form.name" name="name" autocomplete="name" required maxlength="120" :aria-invalid="Boolean(fieldErrors.name)" :aria-describedby="fieldErrors.name ? 'quote-name-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.quote.placeholderName')" @input="clearFieldError('name')">
          <p v-if="fieldErrors.name" id="quote-name-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.name }}</p>
        </div>
        <div>
          <label for="quote-email" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.email') }} <span aria-hidden="true">*</span></label>
          <input id="quote-email" v-model="form.email" name="email" type="email" autocomplete="email" required maxlength="254" :aria-invalid="Boolean(fieldErrors.email)" :aria-describedby="fieldErrors.email ? 'quote-email-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.quote.placeholderEmail')" @input="clearFieldError('email')">
          <p v-if="fieldErrors.email" id="quote-email-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.email }}</p>
        </div>
        <div>
          <label for="quote-company" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.company') }} <span class="font-normal text-slate-500">({{ t('pages.quote.companyOptional') }})</span></label>
          <input id="quote-company" v-model="form.company" name="company" autocomplete="organization" maxlength="160" :aria-invalid="Boolean(fieldErrors.company)" :aria-describedby="fieldErrors.company ? 'quote-company-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.quote.placeholderCompany')" @input="clearFieldError('company')">
          <p v-if="fieldErrors.company" id="quote-company-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.company }}</p>
        </div>
        <div>
          <label for="quote-project-type" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.projectType') }} <span aria-hidden="true">*</span></label>
          <select id="quote-project-type" v-model="form.projectType" name="projectType" required :aria-invalid="Boolean(fieldErrors.projectType)" :aria-describedby="fieldErrors.projectType ? 'quote-project-type-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" @change="clearFieldError('projectType')">
            <option value="" disabled>{{ t('forms.projectTypes.choose') }}</option>
            <option v-for="[value, label] in projectTypes" :key="value" :value="value">{{ t(label) }}</option>
          </select>
          <p v-if="fieldErrors.projectType" id="quote-project-type-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.projectType }}</p>
        </div>
        <div>
          <label for="quote-budget" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.budget') }} <span aria-hidden="true">*</span></label>
          <select id="quote-budget" v-model="form.budget" name="budget" required :aria-invalid="Boolean(fieldErrors.budget)" :aria-describedby="fieldErrors.budget ? 'quote-budget-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" @change="clearFieldError('budget')">
            <option value="" disabled>{{ t('forms.budgets.choose') }}</option>
            <option v-for="[value, label] in budgetOptions" :key="value" :value="value">{{ t(label) }}</option>
          </select>
          <p v-if="fieldErrors.budget" id="quote-budget-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.budget }}</p>
        </div>
        <div>
          <label for="quote-deadline" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.deadline') }} <span aria-hidden="true">*</span></label>
          <input id="quote-deadline" v-model="form.deadline" name="deadline" required maxlength="120" :aria-invalid="Boolean(fieldErrors.deadline)" :aria-describedby="fieldErrors.deadline ? 'quote-deadline-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.quote.placeholderDeadline')" @input="clearFieldError('deadline')">
          <p v-if="fieldErrors.deadline" id="quote-deadline-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.deadline }}</p>
        </div>
      </div>

      <div>
        <label for="quote-description" class="mb-1.5 block text-sm font-semibold text-ink">{{ t('pages.quote.descriptionLabel') }} <span aria-hidden="true">*</span></label>
        <textarea id="quote-description" v-model="form.description" name="description" required minlength="20" maxlength="5000" rows="6" :aria-invalid="Boolean(fieldErrors.description)" :aria-describedby="fieldErrors.description ? 'quote-description-error' : undefined" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-ink shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="t('pages.quote.placeholderDescription')" @input="clearFieldError('description')" />
        <p v-if="fieldErrors.description" id="quote-description-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.description }}</p>
      </div>

      <div>
        <div class="flex items-start gap-3">
          <input id="quote-consent" v-model="form.consent" name="consent" type="checkbox" required :aria-invalid="Boolean(fieldErrors.consent)" :aria-describedby="fieldErrors.consent ? 'quote-consent-error' : undefined" class="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary" @change="clearFieldError('consent')">
          <label for="quote-consent" class="text-sm leading-6 text-slate-600">
            {{ t('pages.quote.consentBefore') }}
            <NuxtLink :to="localePath('/politique-de-confidentialite')" class="font-semibold text-primary underline underline-offset-2">{{ t('pages.quote.consentLink') }}</NuxtLink>{{ t('pages.quote.consentAfter') }} <span aria-hidden="true">*</span>
          </label>
        </div>
        <p v-if="fieldErrors.consent" id="quote-consent-error" class="mt-1.5 text-sm text-red-700">{{ fieldErrors.consent }}</p>
      </div>

      <p v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>
      <p v-if="status === 'success'" role="status" aria-live="polite" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{{ t('pages.quote.success') }}</p>
      <button type="submit" :disabled="status === 'loading'" class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-6 py-3 font-bold text-primary transition hover:bg-amber-400 focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        <span v-if="status === 'loading'">{{ t('pages.quote.sending') }}</span>
        <span v-else>{{ t('pages.quote.submit') }}</span>
      </button>
    </form>
  </section>
</template>
