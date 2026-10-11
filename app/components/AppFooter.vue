<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const footerLinks = computed(() => [
  { label: t('navigation.home'), to: localePath('/') },
  { label: t('navigation.services'), to: localePath('/services') },
  { label: t('navigation.portfolio'), to: localePath('/realisations') },
  { label: t('navigation.process'), to: localePath('/process') },
  { label: t('navigation.about'), to: localePath('/a-propos') },
  { label: t('navigation.contact'), to: localePath('/contact') }
])
</script>

<template>
  <footer class="bg-primary text-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <NuxtLink :to="localePath('/')" :aria-label="t('navigation.home')">
          <img src="/logo-light.svg" :alt="t('brand.name')" class="h-10 w-auto" width="300" height="64" loading="lazy" decoding="async">
        </NuxtLink>
        <p class="mt-4 max-w-sm text-sm leading-6 text-slate-300">{{ t('brand.tagline') }}</p>
      </div>

      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ t('footer.navigation') }}</h2>
        <ul class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <li v-for="item in footerLinks" :key="item.to">
            <NuxtLink :to="item.to" class="text-sm text-slate-300 transition hover:text-white">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ t('footer.contact') }}</h2>
        <LanguageSwitcher variant="dark" class="mt-4" />
        <NuxtLink :to="localePath('/contact')" class="mt-4 inline-block text-sm text-slate-300 transition hover:text-white">{{ t('navigation.contact') }}</NuxtLink>
        <div class="mt-6 flex flex-col gap-3">
          <NuxtLink :to="localePath('/mentions-legales')" class="text-sm text-slate-300 transition hover:text-white">{{ t('footer.legal') }}</NuxtLink>
          <NuxtLink :to="localePath('/politique-de-confidentialite')" class="text-sm text-slate-300 transition hover:text-white">{{ t('footer.privacy') }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="border-t border-white/15">
      <p class="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-300 sm:px-6 lg:px-8">© {{ new Date().getFullYear() }} {{ t('brand.name') }}. {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>