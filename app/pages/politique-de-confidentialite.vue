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
	<article>
		<PageHeader :title="t('pages.privacy.title')" :lead="t('pages.privacy.intro')" />
		<div class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
			<div class="max-w-prose-content space-y-10">
				<section v-for="section in sections" :key="section.title">
					<h2 class="flex items-center gap-3 font-sans text-h3 font-semibold text-primary">
						<span aria-hidden="true" class="h-0.5 w-6 shrink-0 bg-accent" />{{ section.title }}
					</h2>
					<p class="mt-3 whitespace-pre-line break-words text-ink">{{ section.text }}</p>
				</section>
			</div>
		</div>
	</article>
</template>
