<script setup lang="ts">
const props = withDefaults(defineProps<{
  project: { slug: string, title: string, sector: string, summary: string, technologies?: string[] }
  headingLevel?: 'h2' | 'h3'
  showTechnologies?: boolean
}>(), {
  headingLevel: 'h3',
  showTechnologies: false
})

const { t } = useI18n()
const localePath = useLocalePath()
const projectPath = computed(() => localePath(`/realisations/${props.project.slug}`))
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-raised">
    <ImagePlaceholder />
    <div class="flex flex-1 flex-col p-6 md:p-8">
      <p class="text-eyebrow font-semibold uppercase text-primary">{{ project.sector }}</p>
      <component :is="headingLevel" class="mt-2 font-display text-h2 font-semibold text-primary">{{ project.title }}</component>
      <p class="mt-3 text-ink-muted">{{ project.summary }}</p>
      <TechBadges v-if="showTechnologies && project.technologies?.length" :items="project.technologies" class="mt-5" />
      <TextLink :to="projectPath" icon="arrow-right" class="mt-6 self-start">{{ t('pages.portfolio.viewProject') }}</TextLink>
    </div>
  </article>
</template>
