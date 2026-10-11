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
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.process.title') }}</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.process.intro') }}</p>
			</div>
		</section>
		<section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
			<ol class="space-y-5">
				<li v-for="(step, index) in steps" :key="step.title" class="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
					<span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">0{{ index + 1 }}</span>
					<div>
						<h2 class="text-xl font-bold text-primary">{{ step.title }}</h2>
						<p class="mt-2 leading-7 text-slate-600">{{ step.text }}</p>
					</div>
				</li>
			</ol>
		</section>
	</div>
</template>