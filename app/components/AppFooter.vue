<script setup lang="ts">
const { t } = useI18n()

const footerLinks = computed(() => [
  { label: t('navigation.home'), to: '/' },
  { label: t('navigation.services'), to: '/services' },
  { label: t('navigation.portfolio'), to: '/realisations' },
  { label: t('navigation.process'), to: '/process' },
  { label: t('navigation.about'), to: '/a-propos' },
  { label: t('navigation.contact'), to: '/contact' }
])
</script>

<template>
  <footer class="bg-primary text-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <NuxtLink to="/" :aria-label="t('navigation.home')">
          <img src="/logo-light.svg" alt="DIGISERVICE" class="h-10 w-auto" width="180" height="48">
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
        <NuxtLink to="/contact" class="mt-4 inline-block text-sm text-slate-300 transition hover:text-white">{{ t('navigation.contact') }}</NuxtLink>
        <div class="mt-6 flex flex-col gap-3">
          <NuxtLink to="/mentions-legales" class="text-sm text-slate-300 transition hover:text-white">{{ t('footer.legal') }}</NuxtLink>
          <NuxtLink to="/politique-de-confidentialite" class="text-sm text-slate-300 transition hover:text-white">{{ t('footer.privacy') }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="border-t border-white/15">
      <p class="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-300 sm:px-6 lg:px-8">© {{ new Date().getFullYear() }} DIGISERVICE. {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>