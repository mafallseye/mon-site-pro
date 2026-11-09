<script setup lang="ts">
const { t } = useI18n()
usePageSeo(
	() => `${t('pages.about.title')} | ${t('brand.name')}`,
	() => t('pages.about.description')
)
</script>

<template>
	<section class="relative overflow-hidden bg-bg">
		<span aria-hidden="true" class="absolute -right-1/4 -bottom-1/3 aspect-square w-3/4 rounded-badge bg-surface-muted xl:w-1/2" />
		<div class="relative mx-auto grid min-h-half-screen max-w-content items-center gap-12 px-4 py-section-sm md:px-6 md:py-section xl:grid-cols-2 xl:px-8">
			<div>
				<h1 class="text-h1 text-primary">{{ t('pages.about.title') }}</h1>
				<span aria-hidden="true" class="mt-5 block h-1 w-12 rounded-badge bg-accent" />
			</div>
			<BrandMark class="max-w-52 md:max-w-xs xl:max-w-sm" />
		</div>
	</section>
</template>
