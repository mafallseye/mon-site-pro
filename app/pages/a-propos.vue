<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const experience = computed(() => (tm('pages.about.experience') as Array<Record<'period' | 'role' | 'organization' | 'text', string>>)
	.map(item => ({ period: rt(item.period), role: rt(item.role), organization: rt(item.organization), text: rt(item.text) })))

const skills = computed(() => (tm('pages.about.skills') as Array<{ title: string, items: string[] }>)
	.map(skill => ({ title: rt(skill.title), items: skill.items.map(item => rt(item)) })))

// Profils publics (repris de mafallseye/my-portfolio)
const profiles = computed(() => [
	{ label: t('pages.about.github'), href: 'https://github.com/mafallseye' },
	{ label: t('pages.about.linkedin'), href: 'https://www.linkedin.com/in/maguette-fall-seye/' }
])

usePageSeo(
	() => `${t('pages.about.title')} | ${t('brand.name')}`,
	() => t('pages.about.description')
)
</script>

<template>
	<div>
		<PageHeader :title="t('pages.about.title')" :lead="t('pages.about.lead')" :eyebrow="t('pages.about.specialty')">
			<ul class="mt-6 flex flex-wrap gap-x-6">
				<li v-for="profile in profiles" :key="profile.href">
					<TextLink :href="profile.href" icon="external">{{ profile.label }}</TextLink>
				</li>
			</ul>
		</PageHeader>

		<section class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
			<div class="grid items-start gap-12 xl:grid-cols-2">
				<div>
					<SectionHeading :title="t('pages.about.experienceTitle')" />
					<ol class="mt-8 space-y-8 border-l-2 border-accent pl-6">
						<li v-for="item in experience" :key="item.period + item.role" class="relative">
							<span aria-hidden="true" class="absolute top-1.5 -left-8 size-3.5 rounded-badge border-2 border-bg bg-accent" />
							<p class="text-eyebrow font-semibold uppercase text-primary">{{ item.period }}</p>
							<h3 class="mt-1 text-h3 font-semibold text-ink">{{ item.role }}</h3>
							<p class="text-small font-semibold text-primary">{{ item.organization }}</p>
							<p class="mt-2 text-ink-muted">{{ item.text }}</p>
						</li>
					</ol>
				</div>
				<BrandMark class="hidden max-w-sm xl:block" />
			</div>
		</section>

		<section class="bg-surface-muted py-section-sm md:py-section">
			<div class="mx-auto max-w-content px-4 md:px-6 xl:px-8">
				<SectionHeading :title="t('pages.about.skillsTitle')" />
				<div class="mt-10 grid gap-6 md:grid-cols-3">
					<article v-for="(skill, index) in skills" :key="skill.title" class="rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
						<StepBadge :index="index" />
						<h3 class="mt-5 text-h3 font-semibold text-primary">{{ skill.title }}</h3>
						<ul class="mt-4 space-y-2.5">
							<li v-for="item in skill.items" :key="item" class="flex gap-2.5 text-small text-ink-muted">
								<span aria-hidden="true" class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-badge bg-accent text-ink">
									<AppIcon name="check" class="size-3.5" />
								</span>
								{{ item }}
							</li>
						</ul>
					</article>
				</div>
			</div>
		</section>

		<section class="zone-dark bg-primary px-4 py-section-sm text-center text-on-primary md:px-6 md:py-section xl:px-8">
			<div class="mx-auto max-w-3xl">
				<h2 class="text-h2">{{ t('pages.home.ctaTitle') }}</h2>
				<p class="mx-auto mt-4 max-w-prose-content text-on-primary-muted">{{ t('pages.home.ctaText') }}</p>
				<AppButton :to="localePath('/tarifs-devis')" class="mt-8">{{ t('pages.home.ctaButton') }}</AppButton>
			</div>
		</section>
	</div>
</template>
