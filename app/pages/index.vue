<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()
const { data: projects } = await useAsyncData('featured-realisations', () =>
  queryCollection('realisations').where('featured', '=', true).limit(2).all()
)

const homeServices = computed(() => [0, 1, 2].map(index => ({
  title: t(`homeServices.${index}.title`),
  text: t(`homeServices.${index}.text`)
})))

const processSteps = computed(() => [0, 1, 2, 3].map(index => ({
  title: t(`homeProcess.${index}.title`),
  text: t(`homeProcess.${index}.text`)
})))

useSeoMeta({
  title: () => `${t('pages.home.heroTitle')} | DIGISERVICE`,
  description: () => t('pages.home.description'),
  ogTitle: () => `${t('pages.home.heroTitle')} | DIGISERVICE`,
  ogDescription: () => t('pages.home.description'),
  ogImage: '/logo.svg'
})
</script>

<template>
  <section class="overflow-hidden bg-white">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
      <div>
        <p class="font-semibold uppercase tracking-[0.16em] text-primary-light">{{ t('brand.name') }}</p>
        <h1 class="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">{{ t('pages.home.heroTitle') }}</h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.home.heroSubtitle') }}</p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <NuxtLink :to="localePath('/tarifs-devis')" class="rounded-lg bg-accent px-6 py-3.5 text-center font-bold text-primary shadow-sm transition hover:bg-amber-400">{{ t('common.requestQuote') }}</NuxtLink>
          <NuxtLink :to="localePath('/realisations')" class="rounded-lg border border-primary/15 px-6 py-3.5 text-center font-semibold text-primary transition hover:bg-surface">{{ t('pages.home.seeProjects') }}</NuxtLink>
        </div>
      </div>
      <div aria-hidden="true" class="flex min-h-64 items-center justify-center rounded-3xl bg-surface p-8 sm:min-h-80">
        <img src="/logo.svg" alt="" class="max-h-24 w-auto opacity-90 sm:max-h-32">
      </div>
    </div>
  </section>

  <section class="bg-primary py-6 text-white">
    <p class="mx-auto max-w-7xl px-4 text-center text-base font-medium leading-7 sm:px-6 sm:text-lg lg:px-8">{{ t('pages.home.proof') }}</p>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
    <div class="max-w-2xl">
      <h2 class="text-3xl font-bold tracking-tight text-primary">{{ t('pages.home.servicesTitle') }}</h2>
      <p class="mt-3 leading-7 text-slate-600">{{ t('pages.home.servicesIntro') }}</p>
    </div>
    <div class="mt-9 grid gap-5 md:grid-cols-3">
      <article v-for="(service, index) in homeServices" :key="service.title" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span class="inline-flex size-10 items-center justify-center rounded-xl bg-surface text-sm font-bold text-primary">0{{ index + 1 }}</span>
        <h3 class="mt-5 text-xl font-semibold text-primary">{{ service.title }}</h3>
        <p class="mt-3 leading-7 text-slate-600">{{ service.text }}</p>
        <NuxtLink :to="localePath('/services')" class="mt-5 inline-flex font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('common.learnMore') }}</NuxtLink>
      </article>
    </div>
  </section>

  <section class="bg-white py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-primary">{{ t('pages.home.featuredTitle') }}</h2>
          <p class="mt-3 leading-7 text-slate-600">{{ t('pages.home.featuredIntro') }}</p>
        </div>
        <NuxtLink :to="localePath('/realisations')" class="font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('pages.home.seeProjects') }}</NuxtLink>
      </div>
      <div class="mt-9 grid gap-6 md:grid-cols-2">
        <article v-for="project in projects || []" :key="project.slug" class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div class="flex aspect-[16/8] items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">{{ t('pages.portfolio.imagePlaceholder') }}</div>
          <div class="p-6">
            <p class="text-sm font-semibold text-primary-light">{{ project.sector }}</p>
            <h3 class="mt-2 text-2xl font-bold text-primary">{{ project.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ project.summary }}</p>
            <NuxtLink :to="localePath(`/realisations/${project.slug}`)" class="mt-5 inline-flex font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('pages.portfolio.viewProject') }}</NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
    <div class="max-w-2xl">
      <h2 class="text-3xl font-bold tracking-tight text-primary">{{ t('pages.home.processTitle') }}</h2>
      <p class="mt-3 leading-7 text-slate-600">{{ t('pages.home.processIntro') }}</p>
    </div>
    <ol class="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="(step, index) in processSteps" :key="step.title" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <span class="text-sm font-bold tracking-wider text-primary-light">0{{ index + 1 }}</span>
        <h3 class="mt-3 text-lg font-semibold text-primary">{{ step.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.text }}</p>
      </li>
    </ol>
  </section>

  <section class="bg-primary px-4 py-16 text-center text-white sm:px-6 sm:py-20 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('pages.home.ctaTitle') }}</h2>
      <p class="mx-auto mt-4 max-w-2xl leading-7 text-slate-200">{{ t('pages.home.ctaText') }}</p>
      <NuxtLink :to="localePath('/tarifs-devis')" class="mt-8 inline-flex rounded-lg bg-accent px-6 py-3.5 font-bold text-primary transition hover:bg-amber-400">{{ t('pages.home.ctaButton') }}</NuxtLink>
    </div>
  </section>
</template>