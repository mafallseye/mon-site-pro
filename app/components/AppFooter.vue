<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const footerLinks = useMainNavigation()

const whatsappLink = useWhatsAppLink()
const legalLinks = computed(() => [
  { label: t('footer.legal'), to: localePath('/mentions-legales') },
  { label: t('footer.privacy'), to: localePath('/politique-de-confidentialite') }
])

const linkClass = 'inline-flex min-h-tap min-w-tap items-center text-small text-dark-ink underline-offset-4 transition-colors hover:text-accent hover:underline'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="zone-dark border-t-4 border-accent bg-dark-bg text-dark-ink">
    <div class="mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-3 md:px-6 xl:px-8">
      <div>
        <NuxtLink :to="localePath('/')" :aria-label="t('navigation.home')" class="inline-block py-1">
          <img src="/logo-light.svg" :alt="t('brand.name')" class="h-10 w-auto" width="277" height="64" loading="lazy" decoding="async">
        </NuxtLink>
        <p class="mt-4 max-w-sm text-small text-dark-ink-muted">{{ t('brand.tagline') }}</p>
      </div>

      <div>
        <h2 class="font-sans text-eyebrow font-semibold uppercase text-dark-ink">{{ t('footer.navigation') }}</h2>
        <ul class="mt-4 grid grid-cols-2 gap-x-4">
          <li v-for="item in footerLinks" :key="item.to">
            <NuxtLink :to="item.to" :class="linkClass">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="font-sans text-eyebrow font-semibold uppercase text-dark-ink">{{ t('footer.contact') }}</h2>
        <LanguageSwitcher variant="dark" class="mt-4" />
        <ul class="mt-4 flex flex-col">
          <li><NuxtLink :to="localePath('/contact')" :class="linkClass">{{ t('navigation.contact') }}</NuxtLink></li>
          <li v-if="whatsappLink"><a :href="whatsappLink" target="_blank" rel="noopener noreferrer" :class="linkClass">{{ t('pages.contact.whatsapp') }}</a></li>
          <li v-for="item in legalLinks" :key="item.to">
            <NuxtLink :to="item.to" :class="linkClass">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-dark-line">
      <p class="mx-auto max-w-content px-4 py-5 text-small text-dark-ink-muted md:px-6 xl:px-8">© {{ year }} {{ t('brand.name') }}. {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>
