<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const isMenuOpen = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})

const navigation = computed(() => [
  { label: t('navigation.home'), to: localePath('/') },
  { label: t('navigation.services'), to: localePath('/services') },
  { label: t('navigation.portfolio'), to: localePath('/realisations') },
  { label: t('navigation.process'), to: localePath('/process') },
  { label: t('navigation.about'), to: localePath('/a-propos') },
  { label: t('navigation.contact'), to: localePath('/contact') }
])
</script>

<template>
  <a
    href="#main-content"
    class="sr-only z-50 rounded-md bg-accent px-4 py-3 font-semibold text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    {{ t('navigation.skipToContent') }}
  </a>
  <header class="relative z-40 border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink :to="localePath('/')" :aria-label="t('navigation.home')" @click="isMenuOpen = false">
        <img src="/logo.svg" :alt="t('brand.name')" class="h-10 w-auto" width="300" height="64">
      </NuxtLink>

      <nav :aria-label="t('navigation.mainLabel')" class="hidden items-center gap-6 lg:flex">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-ink transition hover:text-primary-light"
          active-class="text-primary"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <LanguageSwitcher class="hidden lg:flex" />

      <div class="hidden lg:block">
        <NuxtLink :to="localePath('/tarifs-devis')" class="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:bg-amber-400">
          {{ t('navigation.quote') }}
        </NuxtLink>
      </div>

      <button
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-primary lg:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        :aria-label="isMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg v-if="!isMenuOpen" aria-hidden="true" class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else aria-hidden="true" class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>

    <nav
      v-if="isMenuOpen"
      id="mobile-navigation"
      :aria-label="t('navigation.mobileLabel')"
      class="absolute inset-x-0 top-full border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden"
    >
      <div class="mx-auto flex max-w-7xl flex-col gap-1 sm:px-2">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-3 font-medium text-ink hover:bg-surface"
          @click="isMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/tarifs-devis')"
          class="mt-2 rounded-lg bg-accent px-5 py-3 text-center font-bold text-primary"
          @click="isMenuOpen = false"
        >
          {{ t('navigation.quote') }}
        </NuxtLink>
        <LanguageSwitcher class="mt-3 justify-center border-t border-slate-200 pt-3" />
      </div>
    </nav>
  </header>
</template>