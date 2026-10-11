<script setup lang="ts">
const { t } = useI18n()
const { locale } = useI18n()
const localePath = useLocalePath()
const { data: projects } = await useAsyncData(
	() => `realisations-list-${locale.value}`,
	() => queryCollection('realisations').where('language', '=', locale.value).all()
)

usePageSeo(
	() => `${t('pages.portfolio.title')} | ${t('brand.name')}`,
	() => t('pages.portfolio.description')
)
</script>

<template>
	<div>
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.portfolio.title') }}</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.portfolio.intro') }}</p>
			</div>
		</section>

		<section class="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
			<article v-for="project in projects || []" :key="project.slug" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div class="flex aspect-[16/8] items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600">{{ t('pages.portfolio.imagePlaceholder') }}</div>
				<div class="p-6 sm:p-8">
					<p class="text-sm font-semibold text-primary-light">{{ project.sector }}</p>
					<h2 class="mt-2 text-2xl font-bold text-primary">{{ project.title }}</h2>
					<p class="mt-3 leading-7 text-slate-600">{{ project.summary }}</p>
					<div class="mt-5 flex flex-wrap gap-2">
						<span v-for="technology in project.technologies" :key="technology" class="rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">{{ technology }}</span>
					</div>
					<NuxtLink :to="localePath(`/realisations/${project.slug}`)" class="mt-6 inline-flex font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('pages.portfolio.viewProject') }}</NuxtLink>
				</div>
			</article>
		</section>
	</div>
</template>