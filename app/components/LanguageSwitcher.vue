<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'light' | 'dark' }>(), {
  variant: 'light'
})

const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const languages = [
  { code: 'fr', key: 'french', label: 'FR' },
  { code: 'en', key: 'english', label: 'EN' }
] as const
</script>

<template>
  <div
    role="group"
    :aria-label="t('languageSwitcher.label')"
    class="inline-flex items-center gap-1"
  >
    <NuxtLink
      v-for="language in languages"
      :key="language.code"
      :to="switchLocalePath(language.code)"
      :lang="language.code"
      :aria-label="t(`languageSwitcher.${language.key}`)"
      :aria-current="locale === language.code ? 'page' : undefined"
      :class="[
        'inline-flex min-h-tap min-w-tap items-center justify-center rounded-control px-2 text-small font-semibold transition-colors',
        variant === 'dark'
          ? (locale === language.code ? 'bg-accent text-dark-bg' : 'text-dark-ink hover:bg-dark-line')
          : (locale === language.code ? 'bg-primary text-on-primary' : 'text-primary hover:bg-primary-soft')
      ]"
    >
      {{ language.label }}
    </NuxtLink>
  </div>
</template>
