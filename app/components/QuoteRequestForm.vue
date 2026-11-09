<script setup lang="ts">
import { quoteSchema } from '#shared/utils/form-schemas'
import { budgetOptions, projectTypeOptions } from '#shared/utils/form-options'

const { t } = useI18n()
const localePath = useLocalePath()
const { form, status, fieldErrors, errorMessage, clearFieldError, submitForm } = useFormSubmission({
  schema: quoteSchema,
  endpoint: '/api/devis',
  initialValues: () => ({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    deadline: '',
    description: '',
    consent: false,
    contact_pref_hp: ''
  }),
  longTextField: 'description'
})

const priceExamples = computed(() => [0, 1, 2, 3].map(index => ({
  service: t(`quoteStartingPrices.${index}.service`),
  amount: t(`quoteStartingPrices.${index}.amount`)
})))
</script>

<template>
  <section class="rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
    <h2 class="text-h2 text-primary">{{ t('pages.quote.formTitle') }}</h2>
    <p class="mt-2 text-small text-ink-muted">{{ t('pages.quote.formIntro') }}</p>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <article v-for="price in priceExamples" :key="price.service" class="rounded-control bg-surface-muted p-4">
        <h3 class="text-small font-semibold text-primary">{{ price.service }}</h3>
        <p class="mt-2 text-stat font-semibold tabular-nums text-ink">
          <span class="text-small font-normal text-ink-muted">{{ t('pages.quote.startingAt') }}</span> {{ price.amount }}
        </p>
      </article>
    </div>
    <p class="mt-4 flex items-start gap-2 text-small text-ink-muted">
      <span aria-hidden="true" class="mt-2 size-1.5 shrink-0 rounded-badge bg-accent" />
      <span>{{ t('pages.quote.disclaimer') }}</span>
    </p>

    <form class="mt-8 space-y-5 border-t border-line pt-8" :aria-busy="status === 'loading'" novalidate @submit.prevent="submitForm">
      <FormHoneypot id="quote-contact-pref-hp" v-model="form.contact_pref_hp" />

      <div class="grid gap-5 md:grid-cols-2">
        <FormField id="quote-name" v-model="form.name" :label="t('pages.quote.name')" required :error="fieldErrors.name" name="name" autocomplete="name" maxlength="120" :placeholder="t('pages.quote.placeholderName')" @input="clearFieldError('name')" />
        <FormField id="quote-email" v-model="form.email" :label="t('pages.quote.email')" required :error="fieldErrors.email" name="email" type="email" autocomplete="email" maxlength="254" :placeholder="t('pages.quote.placeholderEmail')" @input="clearFieldError('email')" />
        <FormField id="quote-company" v-model="form.company" :label="t('pages.quote.company')" :optional-label="t('pages.quote.companyOptional')" :error="fieldErrors.company" name="company" autocomplete="organization" maxlength="160" :placeholder="t('pages.quote.placeholderCompany')" @input="clearFieldError('company')" />
        <FormField id="quote-project-type" v-model="form.projectType" as="select" :label="t('pages.quote.projectType')" required :error="fieldErrors.projectType" name="projectType" @change="clearFieldError('projectType')">
          <option value="" disabled>{{ t('forms.projectTypes.choose') }}</option>
          <option v-for="option in projectTypeOptions" :key="option.value" :value="option.value">{{ t(`forms.projectTypes.${option.messageKey}`) }}</option>
        </FormField>
        <FormField id="quote-budget" v-model="form.budget" as="select" :label="t('pages.quote.budget')" required :error="fieldErrors.budget" name="budget" @change="clearFieldError('budget')">
          <option value="" disabled>{{ t('forms.budgets.choose') }}</option>
          <option v-for="option in budgetOptions" :key="option.value" :value="option.value">{{ t(`forms.budgets.${option.messageKey}`) }}</option>
        </FormField>
        <FormField id="quote-deadline" v-model="form.deadline" :label="t('pages.quote.deadline')" required :error="fieldErrors.deadline" name="deadline" maxlength="120" :placeholder="t('pages.quote.placeholderDeadline')" @input="clearFieldError('deadline')" />
      </div>

      <FormField id="quote-description" v-model="form.description" as="textarea" :label="t('pages.quote.descriptionLabel')" required :error="fieldErrors.description" name="description" minlength="20" maxlength="5000" rows="6" :placeholder="t('pages.quote.placeholderDescription')" @input="clearFieldError('description')" />

      <div>
        <div class="flex items-start gap-3">
          <input id="quote-consent" v-model="form.consent" name="consent" type="checkbox" required :aria-invalid="Boolean(fieldErrors.consent)" :aria-describedby="fieldErrors.consent ? 'quote-consent-error' : undefined" class="mt-1 size-5 shrink-0 cursor-pointer accent-primary" @change="clearFieldError('consent')">
          <label for="quote-consent" class="cursor-pointer py-0.5 text-small text-ink">
            {{ t('pages.quote.consentBefore') }}
            <NuxtLink :to="localePath('/politique-de-confidentialite')" class="font-semibold text-primary underline decoration-2 underline-offset-2 hover:text-primary-strong">{{ t('pages.quote.consentLink') }}</NuxtLink>{{ t('pages.quote.consentAfter') }} <span aria-hidden="true">*</span>
          </label>
        </div>
        <FormFieldError v-if="fieldErrors.consent" id="quote-consent-error" :message="fieldErrors.consent" />
      </div>

      <FormAlert v-if="errorMessage" tone="error">{{ errorMessage }}</FormAlert>
      <FormAlert v-if="status === 'success'" tone="success">{{ t('pages.quote.success') }}</FormAlert>
      <AppButton type="submit" block :disabled="status === 'loading'">
        {{ status === 'loading' ? t('pages.quote.sending') : t('pages.quote.submit') }}
      </AppButton>
    </form>
  </section>
</template>
