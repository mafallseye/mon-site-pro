<script setup lang="ts">
const { t } = useI18n()
usePageSeo(
	() => `${t('pages.quote.title')} | ${t('brand.name')}`,
	() => t('pages.quote.description')
)
</script>

<template>
	<div>
		<PageHeader :title="t('pages.quote.title')" :lead="t('pages.quote.intro')" />
		<section class="mx-auto max-w-form px-4 pb-section-sm md:px-6 md:pb-section">
			<QuoteRequestForm />
		</section>
	</div>
</template>
