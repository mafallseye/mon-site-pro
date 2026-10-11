<script setup lang="ts">
const { t, tm, rt } = useI18n()
const config = useRuntimeConfig()
const privacyEmail = computed(() => config.public.contactEmail || t('pages.privacy.missingEmail'))
const sections = computed(() => (tm('pages.privacy.sections') as Array<{ title: string, text: string }>).map(section => ({
	title: rt(section.title),
	text: rt(section.text).replaceAll('[[contactEmail]]', privacyEmail.value)
})))

usePageSeo(
	() => `${t('pages.privacy.title')} | ${t('brand.name')}`,
	() => t('pages.privacy.description')
)
</script>

<template>
	<article class="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
		<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.privacy.title') }}</h1>
		<p class="mt-5 leading-7 text-slate-600">{{ t('pages.privacy.intro') }}</p>
		<div class="mt-10 space-y-8">
			<section v-for="section in sections" :key="section.title">
				<h2 class="text-xl font-bold text-primary">{{ section.title }}</h2>
				<p class="mt-3 whitespace-pre-line leading-7 text-slate-700">{{ section.text }}</p>
			</section>
		</div>
	</article>
</template>