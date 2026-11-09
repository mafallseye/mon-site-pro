<script setup lang="ts">
/**
 * Gabarit commun des pages légales : lit pages.<pageKey>.sections dans i18n et remplace
 * [[contactEmail]] par l'email public (ou le texte pages.<pageKey>.missingEmail).
 */
const props = defineProps<{ pageKey: 'legal' | 'privacy' }>()
const { t, tm, rt } = useI18n()
const config = useRuntimeConfig()

/** Clés i18n écrites en toutes lettres (repérables par les outils d'analyse des traductions). */
const messageKeys = {
  legal: { title: 'pages.legal.title', intro: 'pages.legal.intro', missingEmail: 'pages.legal.missingEmail', sections: 'pages.legal.sections' },
  privacy: { title: 'pages.privacy.title', intro: 'pages.privacy.intro', missingEmail: 'pages.privacy.missingEmail', sections: 'pages.privacy.sections' }
} as const
const keys = computed(() => messageKeys[props.pageKey])

const contactEmail = computed(() => config.public.contactEmail || t(keys.value.missingEmail))
const sections = computed(() => (tm(keys.value.sections) as Array<{ title: string, text: string }>).map(section => ({
  title: rt(section.title),
  text: rt(section.text).replaceAll('[[contactEmail]]', contactEmail.value)
})))
</script>

<template>
  <article>
    <PageHeader :title="t(keys.title)" :lead="t(keys.intro)" />
    <div class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
      <div class="max-w-prose-content space-y-10">
        <section v-for="section in sections" :key="section.title">
          <h2 class="flex items-center gap-3 font-sans text-h3 font-semibold text-primary">
            <span aria-hidden="true" class="h-0.5 w-6 shrink-0 bg-accent" />{{ section.title }}
          </h2>
          <p class="mt-3 whitespace-pre-line break-words text-ink">{{ section.text }}</p>
        </section>
      </div>
    </div>
  </article>
</template>
