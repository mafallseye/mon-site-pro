<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: projects } = await useAsyncData(
  () => `featured-realisations-${locale.value}`,
  () => queryCollection('realisations').where('language', '=', locale.value).where('featured', '=', true).limit(2).all()
)

const homeServices = computed(() => [0, 1, 2].map(index => ({
  title: t(`homeServices.${index}.title`),
  text: t(`homeServices.${index}.text`)
})))

const processSteps = computed(() => [0, 1, 2, 3].map(index => ({
  title: t(`homeProcess.${index}.title`),
  text: t(`homeProcess.${index}.text`)
})))

const { canonicalUrl, imageUrl } = usePageSeo(
  () => `${t('pages.home.heroTitle')} | ${t('brand.name')}`,
  () => t('pages.home.description')
)

useHead({
  script: [{
    key: 'professional-service-jsonld',
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: t('brand.name'),
      description: t('pages.home.description'),
      url: canonicalUrl.value,
      logo: imageUrl.value,
      serviceType: t('structuredData.serviceType'),
      areaServed: t('structuredData.areaServed')
    }))
  }]
})
</script>

<template>
  <section class="overflow-hidden bg-bg">
    <div class="mx-auto grid max-w-content gap-12 px-4 py-section-sm md:px-6 md:py-section xl:grid-cols-2 xl:items-center xl:px-8">
      <div>
        <p class="flex items-center gap-3 text-eyebrow font-semibold uppercase text-primary">
          <span aria-hidden="true" class="h-0.5 w-6 bg-accent" />{{ t('brand.name') }}
        </p>
        <h1 class="mt-5 max-w-3xl text-display text-primary">{{ t('pages.home.heroTitle') }}</h1>
        <p class="mt-6 max-w-prose-content text-lead text-ink-muted">{{ t('pages.home.heroSubtitle') }}</p>
        <div class="mt-9 flex flex-col gap-3 md:flex-row">
          <AppButton :to="localePath('/tarifs-devis')" block>{{ t('common.requestQuote') }}</AppButton>
          <AppButton :to="localePath('/realisations')" variant="secondary" block>{{ t('pages.home.seeProjects') }}</AppButton>
        </div>
      </div>
      <BrandMark class="max-w-52 md:max-w-xs xl:max-w-sm" />
    </div>
  </section>

  <section class="zone-dark bg-primary py-8 text-on-primary">
    <p class="mx-auto flex max-w-content items-center justify-center gap-4 px-4 text-center text-lead font-semibold md:px-6 xl:px-8">
      <span aria-hidden="true" class="hidden h-0.5 w-8 shrink-0 bg-accent md:block" />
      {{ t('pages.home.proof') }}
      <span aria-hidden="true" class="hidden h-0.5 w-8 shrink-0 bg-accent md:block" />
    </p>
  </section>

  <section class="mx-auto max-w-content px-4 py-section-sm md:px-6 md:py-section xl:px-8">
    <SectionHeading :title="t('pages.home.servicesTitle')" :intro="t('pages.home.servicesIntro')" />
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <article v-for="(service, index) in homeServices" :key="service.title" class="flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-raised md:p-8">
        <StepBadge :index="index" />
        <h3 class="mt-5 text-h3 font-semibold text-primary">{{ service.title }}</h3>
        <p class="mt-3 flex-1 text-ink-muted">{{ service.text }}</p>
        <TextLink :to="localePath('/services')" icon="arrow-right" class="mt-5 self-start">{{ t('common.learnMore') }}</TextLink>
      </article>
    </div>
  </section>

  <section class="bg-surface-muted py-section-sm md:py-section">
    <div class="mx-auto max-w-content px-4 md:px-6 xl:px-8">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading :title="t('pages.home.featuredTitle')" :intro="t('pages.home.featuredIntro')" />
        <TextLink :to="localePath('/realisations')" icon="arrow-right" class="self-start md:self-auto">{{ t('pages.home.seeProjects') }}</TextLink>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <ProjectCard v-for="project in projects || []" :key="project.slug" :project="project" />
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-content px-4 py-section-sm md:px-6 md:py-section xl:px-8">
    <SectionHeading :title="t('pages.home.processTitle')" :intro="t('pages.home.processIntro')" />
    <div class="relative mt-10">
      <span aria-hidden="true" class="absolute inset-x-6 top-5 hidden h-0.5 bg-accent xl:block" />
      <ol class="relative grid gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        <li v-for="(step, index) in processSteps" :key="step.title" class="relative">
          <StepBadge :index="index" class="ring-8 ring-bg" />
          <h3 class="mt-4 text-h3 font-semibold text-primary">{{ step.title }}</h3>
          <p class="mt-2 text-small text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="zone-dark bg-primary px-4 py-section-sm text-center text-on-primary md:px-6 md:py-section xl:px-8">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-h2">{{ t('pages.home.ctaTitle') }}</h2>
      <p class="mx-auto mt-4 max-w-prose-content text-on-primary-muted">{{ t('pages.home.ctaText') }}</p>
      <AppButton :to="localePath('/tarifs-devis')" class="mt-8">{{ t('pages.home.ctaButton') }}</AppButton>
    </div>
  </section>
</template>
