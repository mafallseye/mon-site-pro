<script setup lang="ts">
/**
 * Gabarit commun des pages légales : lit pages.<pageKey>.sections dans i18n et remplace
 * [[contactEmail]] par l'email public (ou le texte pages.<pageKey>.missingEmail).
 */
const props = defineProps<{ pageKey: 'legal' | 'privacy' }>()
const { t, tm, rt } = useI18n()
const config = useRuntimeConfig()
const contactEmail = computed(() => config.public.contactEmail || t(`pages.${props.pageKey}.missingEmail`))
const sections = computed(() => (tm(`pages.${props.pageKey}.sections`) as Array<{ title: string, text: string }>).map(section => ({
  title: rt(section.title),
  text: rt(section.text).replaceAll('[[contactEmail]]', contactEmail.value)
})))
</script>

<template>
  <article>
    <PageHeader :title="t(`pages.${pageKey}.title`)" :lead="t(`pages.${pageKey}.intro`)" />
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
