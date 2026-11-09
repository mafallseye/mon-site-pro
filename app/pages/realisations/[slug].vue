<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug))
const { data: project } = await useAsyncData(
	() => `realisation-${locale.value}-${slug.value}`,
	() => queryCollection('realisations').where('language', '=', locale.value).where('slug', '=', slug.value).first()
)

if (!project.value) {
	throw createError({ statusCode: 404, statusMessage: t('pages.project.notFound') })
}

usePageSeo(
	() => `${project.value?.title || t('pages.project.title')} | ${t('brand.name')}`,
	() => project.value?.summary || t('pages.project.description')
)
</script>

<template>
	<article v-if="project">
		<PageHeader :title="project.title" :lead="project.summary" :eyebrow="project.sector">
			<template #before>
				<TextLink :to="localePath('/realisations')" icon="arrow-left" class="mb-8 text-small">{{ t('common.backToProjects') }}</TextLink>
			</template>
		</PageHeader>

		<div class="mx-auto max-w-content px-4 pb-section-sm md:px-6 md:pb-section xl:px-8">
			<ProjectGallery :title="project.title" :image="project.image" :image-mobile="project.imageMobile" />
			<div class="mt-10 grid gap-10 xl:grid-cols-main-aside">
				<div class="max-w-prose-content space-y-5 text-ink">
					<ContentRenderer :value="project" />
				</div>
				<aside class="h-fit rounded-card border border-line border-t-4 border-t-accent bg-surface p-6 shadow-card">
					<dl class="space-y-5">
						<div>
							<dt class="text-eyebrow font-semibold uppercase text-ink-muted">{{ t('pages.portfolio.clientLabel') }}</dt>
							<dd class="mt-1 font-semibold text-primary">{{ project.client }}</dd>
						</div>
						<div>
							<dt class="text-eyebrow font-semibold uppercase text-ink-muted">{{ t('pages.portfolio.sectorLabel') }}</dt>
							<dd class="mt-1 font-semibold text-primary">{{ project.sector }}</dd>
						</div>
						<div>
							<dt class="text-eyebrow font-semibold uppercase text-ink-muted">{{ t('pages.portfolio.technologyLabel') }}</dt>
							<dd class="mt-2"><TechBadges :items="project.technologies" /></dd>
						</div>
					</dl>
					<TextLink :href="project.link" icon="external" class="mt-7 break-all">{{ t('pages.portfolio.visitWebsite') }}</TextLink>
				</aside>
			</div>
		</div>
	</article>
</template>
