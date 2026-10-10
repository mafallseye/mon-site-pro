<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => `${t('pages.quote.title')} | DIGISERVICE`, description: () => t('pages.quote.description'), ogTitle: () => `${t('pages.quote.title')} | DIGISERVICE`, ogDescription: () => t('pages.quote.description'), ogImage: '/logo.svg' })
</script>

<template>
	<div>
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.quote.title') }}</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.quote.intro') }}</p>
			</div>
		</section>
		<section class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
			<QuoteRequestForm />
		</section>
	</div>
</template>