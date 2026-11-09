<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const isMenuOpen = ref(false)
const headerRef = ref<HTMLElement>()
const menuButtonRef = ref<HTMLButtonElement>()

const navigation = useMainNavigation()

function closeMenu({ restoreFocus = false } = {}) {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
  if (restoreFocus) menuButtonRef.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu({ restoreFocus: true })
}

/** Le focus clavier quitte le header : on ferme le menu pour qu'il ne masque pas l'élément focalisé. */
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && headerRef.value && !headerRef.value.contains(next)) closeMenu()
}

function onPointerDown(event: PointerEvent) {
  if (headerRef.value && !headerRef.value.contains(event.target as Node)) closeMenu()
}

watch(() => route.fullPath, () => closeMenu())

watch(isMenuOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('pointerdown', onPointerDown)
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('pointerdown', onPointerDown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <a
    href="#main-content"
    class="sr-only z-50 rounded-control bg-accent font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-4 focus:py-3"
  >
    {{ t('navigation.skipToContent') }}
  </a>
  <header ref="headerRef" class="relative z-40 border-b-2 border-accent bg-bg" @focusout="onFocusOut">
    <div class="mx-auto flex max-w-content items-center justify-between gap-6 px-4 py-3 md:px-6 xl:px-8 xl:py-5">
      <NuxtLink :to="localePath('/')" :aria-label="t('navigation.home')" class="shrink-0 py-1" @click="closeMenu()">
        <img src="/logo.svg" :alt="t('brand.name')" class="h-9 w-auto xl:h-10" width="277" height="64">
      </NuxtLink>

      <nav :aria-label="t('navigation.mainLabel')" class="hidden items-center gap-7 xl:flex">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="inline-flex min-h-tap min-w-tap items-center justify-center border-b-2 border-transparent text-small font-semibold text-ink transition-colors hover:border-accent hover:text-primary-strong"
          active-class="border-accent! text-primary!"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-4 xl:flex">
        <LanguageSwitcher />
        <AppButton :to="localePath('/tarifs-devis')">{{ t('navigation.quote') }}</AppButton>
      </div>

      <button
        ref="menuButtonRef"
        type="button"
        class="inline-flex size-tap items-center justify-center rounded-control border border-line-strong text-primary transition-colors hover:bg-primary-soft xl:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        :aria-label="isMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')"
        @click="isMenuOpen = !isMenuOpen"
      >
        <AppIcon :name="isMenuOpen ? 'close' : 'menu'" class="size-6" />
      </button>
    </div>

    <nav
      v-show="isMenuOpen"
      id="mobile-navigation"
      :aria-label="t('navigation.mobileLabel')"
      class="absolute inset-x-0 top-full border-t border-line bg-surface px-4 py-4 shadow-raised xl:hidden"
    >
      <div class="mx-auto flex max-w-content flex-col gap-1 md:px-2">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex min-h-control items-center rounded-r-control border-l-4 border-transparent px-3 font-semibold text-ink transition-colors hover:bg-primary-soft"
          active-class="border-accent! text-primary!"
          @click="closeMenu()"
        >
          {{ item.label }}
        </NuxtLink>
        <AppButton :to="localePath('/tarifs-devis')" class="mt-2" @click="closeMenu()">{{ t('navigation.quote') }}</AppButton>
        <LanguageSwitcher class="mt-3 justify-center border-t border-line pt-3" />
      </div>
    </nav>
  </header>
</template>
