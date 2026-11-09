<script setup lang="ts">
import { contactSchema } from '../../shared/utils/form-schemas'

const { t } = useI18n()
const { form, status, fieldErrors, errorMessage, clearFieldError, submitForm } = useFormSubmission({
  schema: contactSchema,
  endpoint: '/api/contact',
  initialValues: () => ({ name: '', email: '', message: '', contact_pref_hp: '' }),
  longTextField: 'message'
})
</script>

<template>
  <section class="rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
    <h2 class="text-h2 text-primary">{{ t('pages.contact.formTitle') }}</h2>
    <form class="mt-6 space-y-5" :aria-busy="status === 'loading'" novalidate @submit.prevent="submitForm">
      <FormHoneypot id="contact-contact-pref-hp" v-model="form.contact_pref_hp" />

      <FormField id="contact-name" v-model="form.name" :label="t('pages.contact.name')" required :error="fieldErrors.name" name="name" autocomplete="name" maxlength="120" :placeholder="t('pages.contact.placeholderName')" @input="clearFieldError('name')" />
      <FormField id="contact-email" v-model="form.email" :label="t('pages.contact.email')" required :error="fieldErrors.email" name="email" type="email" autocomplete="email" maxlength="254" :placeholder="t('pages.contact.placeholderEmail')" @input="clearFieldError('email')" />
      <FormField id="contact-message" v-model="form.message" as="textarea" :label="t('pages.contact.message')" required :error="fieldErrors.message" name="message" minlength="10" maxlength="5000" rows="6" :placeholder="t('pages.contact.placeholderMessage')" @input="clearFieldError('message')" />

      <FormAlert v-if="errorMessage" tone="error">{{ errorMessage }}</FormAlert>
      <FormAlert v-if="status === 'success'" tone="success">{{ t('pages.contact.success') }}</FormAlert>
      <AppButton type="submit" block :disabled="status === 'loading'">
        {{ status === 'loading' ? t('pages.contact.sending') : t('pages.contact.submit') }}
      </AppButton>
    </form>
  </section>
</template>
