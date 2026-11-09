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
		<PageHeader :title="t('pages.services.title')" :lead="t('pages.services.intro')" />

		<section class="mx-auto grid max-w-content gap-6 px-4 pb-section-sm md:px-6 md:pb-section xl:grid-cols-3 xl:px-8">
			<article v-for="(service, index) in services" :key="service.title" class="flex flex-col rounded-card border border-line bg-surface p-6 shadow-card md:w-full md:max-w-prose-content md:p-8 xl:max-w-none">
				<StepBadge :index="index" />
				<h2 class="mt-5 text-h2 text-primary">{{ service.title }}</h2>
				<p class="mt-3 text-ink-muted">{{ service.summary }}</p>
				<h3 class="mt-7 text-eyebrow font-semibold uppercase text-primary">{{ t('pages.services.forLabel') }}</h3>
				<p class="mt-2 text-small text-ink-muted">{{ service.audience }}</p>
				<h3 class="mt-6 text-eyebrow font-semibold uppercase text-primary">{{ t('pages.services.includesLabel') }}</h3>
				<ul class="mt-3 flex-1 space-y-2.5">
					<li v-for="feature in service.includes" :key="feature" class="flex gap-2.5 text-small text-ink-muted">
						<span aria-hidden="true" class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-badge bg-accent text-ink">
							<AppIcon name="check" class="size-3.5" />
						</span>
						{{ feature }}
					</li>
				</ul>
				<AppButton :to="localePath('/tarifs-devis')" class="mt-8 w-full">{{ t('pages.services.quoteCta') }}</AppButton>
			</article>
		</section>

		<section class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
			<article class="zone-dark flex flex-col gap-8 rounded-card bg-primary-strong p-7 text-on-primary md:flex-row md:items-center md:justify-between md:p-10">
				<div class="max-w-3xl">
					<h2 class="text-h2">{{ t('pages.services.maintenanceTitle') }}</h2>
					<p class="mt-3 text-on-primary-muted">{{ t('pages.services.maintenanceIntro') }}</p>
					<h3 class="mt-6 flex items-center gap-2 text-eyebrow font-semibold uppercase"><span aria-hidden="true" class="size-2 rounded-badge bg-accent" />{{ t('pages.services.forLabel') }}</h3>
					<p class="mt-2 text-small text-on-primary-muted">{{ t('pages.services.maintenanceAudience') }}</p>
					<h3 class="mt-5 flex items-center gap-2 text-eyebrow font-semibold uppercase"><span aria-hidden="true" class="size-2 rounded-badge bg-accent" />{{ t('pages.services.includesLabel') }}</h3>
					<p class="mt-2 text-small text-on-primary-muted">{{ t('pages.services.maintenanceIncludes') }}</p>
					<p class="mt-5 text-small text-on-primary-muted">{{ t('pages.services.maintenanceExperience') }}</p>
				</div>
				<AppButton :to="localePath('/tarifs-devis')" class="md:shrink-0">{{ t('pages.services.quoteCta') }}</AppButton>
			</article>
		</section>
	</div>
</template>
