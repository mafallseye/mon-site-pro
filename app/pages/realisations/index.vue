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
			<ProjectCard v-for="project in projects || []" :key="project.slug" :project="project" heading-level="h2" show-technologies />
		</section>
	</div>
</template>