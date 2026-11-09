<script setup lang="ts">
const { t, locale } = useI18n()
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
		<PageHeader :title="t('pages.portfolio.title')" :lead="t('pages.portfolio.intro')" />
		<section class="mx-auto grid max-w-content gap-6 px-4 pb-section-sm md:grid-cols-2 md:px-6 md:pb-section xl:px-8">
			<ProjectCard v-for="project in projects || []" :key="project.slug" :project="project" heading-level="h2" show-technologies />
		</section>
	</div>
</template>
