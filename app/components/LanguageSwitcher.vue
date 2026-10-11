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
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 text-sm font-bold transition focus-visible:outline-offset-2',
        variant === 'dark'
          ? (locale === language.code ? 'bg-white text-primary' : 'text-white hover:bg-white/15')
          : (locale === language.code ? 'bg-primary text-white' : 'text-primary hover:bg-surface')
      ]"
    >
      {{ language.label }}
    </NuxtLink>
  </div>
</template>