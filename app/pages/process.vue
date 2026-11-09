<script setup lang="ts">
const { t } = useI18n()
const steps = computed(() => [0, 1, 2, 3, 4].map(index => ({
	title: t(`processSteps.${index}.title`),
	text: t(`processSteps.${index}.text`)
})))

usePageSeo(
	() => `${t('pages.process.title')} | ${t('brand.name')}`,
	() => t('pages.process.description')
)
</script>

<template>
	<div>
		<PageHeader :title="t('pages.process.title')" :lead="t('pages.process.intro')" />
		<section class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
			<div class="relative max-w-steps">
				<span aria-hidden="true" class="absolute top-6 bottom-6 left-11 w-0.5 bg-accent md:left-13" />
				<ol class="relative space-y-6">
					<li v-for="(step, index) in steps" :key="step.title" class="relative flex gap-5 rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
						<StepBadge :index="index" class="ring-4 ring-surface" />
						<div>
							<h2 class="text-h3 font-sans font-semibold text-primary">{{ step.title }}</h2>
							<p class="mt-2 text-ink-muted">{{ step.text }}</p>
						</div>
					</li>
				</ol>
			</div>
		</section>
	</div>
</template>
