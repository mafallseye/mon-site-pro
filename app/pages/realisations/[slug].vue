<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug))
const { data: project } = await useAsyncData(
	() => `realisation-${slug.value}`,
	() => queryCollection('realisations').where('slug', '=', slug.value).first()
)

if (!project.value) {
	throw createError({ statusCode: 404, statusMessage: 'Réalisation introuvable' })
}

useSeoMeta({
	title: () => `${project.value?.title || t('pages.project.title')} | DIGISERVICE`,
	description: () => project.value?.summary || t('pages.project.description'),
	ogTitle: () => `${project.value?.title || t('pages.project.title')} | DIGISERVICE`,
	ogDescription: () => project.value?.summary || t('pages.project.description'),
	ogImage: '/logo.svg'
})
</script>

<template>
	<article v-if="project">
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<NuxtLink :to="localePath('/realisations')" class="text-sm font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('common.backToProjects') }}</NuxtLink>
				<p class="mt-8 text-sm font-semibold text-primary-light">{{ project.sector }}</p>
				<h1 class="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ project.title }}</h1>
				<p class="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{{ project.summary }}</p>
			</div>
		</section>

		<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div class="flex aspect-[16/7] items-center justify-center rounded-2xl bg-slate-100 px-6 text-center text-sm text-slate-500">{{ t('pages.portfolio.imagePlaceholder') }}</div>
			<div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<div class="space-y-5 leading-7 text-slate-600">
					<ContentRenderer :value="project" />
				</div>
				<aside class="h-fit rounded-2xl border border-slate-200 bg-white p-6">
					<dl class="space-y-5">
						<div>
							<dt class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ t('pages.portfolio.clientLabel') }}</dt>
							<dd class="mt-1 font-semibold text-primary">{{ project.client }}</dd>
						</div>
						<div>
							<dt class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ t('pages.portfolio.sectorLabel') }}</dt>
							<dd class="mt-1 font-semibold text-primary">{{ project.sector }}</dd>
						</div>
						<div>
							<dt class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ t('pages.portfolio.technologyLabel') }}</dt>
							<dd class="mt-2 flex flex-wrap gap-2">
								<span v-for="technology in project.technologies" :key="technology" class="rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">{{ technology }}</span>
							</dd>
						</div>
					</dl>
					<a :href="project.link" target="_blank" rel="noopener noreferrer" class="mt-7 inline-flex font-semibold text-primary-light underline decoration-accent decoration-2 underline-offset-4">{{ t('pages.portfolio.visitWebsite') }} ↗</a>
				</aside>
			</div>
		</div>
	</article>
</template>