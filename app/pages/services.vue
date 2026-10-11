<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const services = computed(() => [0, 1, 2].map(index => ({
	title: t(`servicesList.${index}.title`),
	summary: t(`servicesList.${index}.summary`),
	audience: t(`servicesList.${index}.audience`),
	includes: [0, 1].map(item => t(`servicesList.${index}.includes.${item}`))
})))

usePageSeo(
	() => `${t('pages.services.title')} | ${t('brand.name')}`,
	() => t('pages.services.description')
)
</script>

<template>
	<div>
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.services.title') }}</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.services.intro') }}</p>
			</div>
		</section>

		<section class="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
			<article v-for="(service, index) in services" :key="service.title" class="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<span class="inline-flex size-10 items-center justify-center rounded-xl bg-surface text-sm font-bold text-primary">0{{ index + 1 }}</span>
				<h2 class="mt-5 text-2xl font-bold text-primary">{{ service.title }}</h2>
				<p class="mt-3 leading-7 text-slate-600">{{ service.summary }}</p>
				<h3 class="mt-7 text-sm font-bold uppercase tracking-wide text-primary">{{ t('pages.services.forLabel') }}</h3>
				<p class="mt-2 text-sm leading-6 text-slate-600">{{ service.audience }}</p>
				<h3 class="mt-6 text-sm font-bold uppercase tracking-wide text-primary">{{ t('pages.services.includesLabel') }}</h3>
				<ul class="mt-3 flex-1 space-y-2.5">
					<li v-for="feature in service.includes" :key="feature" class="flex gap-2 text-sm leading-6 text-slate-600">
						<span aria-hidden="true" class="mt-1 text-primary-light">✓</span>{{ feature }}
					</li>
				</ul>
				<NuxtLink :to="localePath('/tarifs-devis')" class="mt-8 rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-amber-400">{{ t('pages.services.quoteCta') }}</NuxtLink>
			</article>
		</section>

		<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
			<article class="grid gap-8 rounded-2xl bg-primary p-7 text-white sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
				<div>
					<h2 class="text-2xl font-bold sm:text-3xl">{{ t('pages.services.maintenanceTitle') }}</h2>
					<p class="mt-3 max-w-3xl leading-7 text-slate-200">{{ t('pages.services.maintenanceIntro') }}</p>
					<h3 class="mt-6 text-sm font-bold uppercase tracking-wide">{{ t('pages.services.forLabel') }}</h3>
					<p class="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{{ t('pages.services.maintenanceAudience') }}</p>
					<h3 class="mt-5 text-sm font-bold uppercase tracking-wide">{{ t('pages.services.includesLabel') }}</h3>
					<p class="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{{ t('pages.services.maintenanceIncludes') }}</p>
					<p class="mt-5 max-w-3xl text-sm leading-6 text-slate-200">{{ t('pages.services.maintenanceExperience') }}</p>
				</div>
				<NuxtLink :to="localePath('/tarifs-devis')" class="rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-amber-400">{{ t('pages.services.quoteCta') }}</NuxtLink>
			</article>
		</section>
	</div>
</template>