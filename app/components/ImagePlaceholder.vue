<script setup lang="ts">
/**
 * Emplacement de visuel de projet en attendant de vraies captures :
 * motif décoratif (monogramme « D » en filet + pastille or) et texte existant
 * pages.portfolio.imagePlaceholder.
 */
withDefaults(defineProps<{ wide?: boolean }>(), { wide: false })
const { t } = useI18n()
</script>

<template>
  <div :class="['relative flex items-center justify-center overflow-hidden bg-surface-muted px-6 text-center', wide ? 'aspect-card md:aspect-wide' : 'aspect-card']">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" class="absolute -right-6 -bottom-6 h-3/4 w-auto text-line">
      <path fill="none" stroke="currentColor" stroke-width="1.5" fill-rule="evenodd" d="M20 16H32A16 16 0 0 1 32 48H20Z M27 23V41H32A9 9 0 0 0 32 23Z" />
      <circle cx="47" cy="47" r="4.5" class="fill-accent" />
    </svg>
    <p class="relative rounded-badge bg-surface-muted px-3 py-1 text-small text-ink-muted">{{ t('pages.portfolio.imagePlaceholder') }}</p>
  </div>
</template>
