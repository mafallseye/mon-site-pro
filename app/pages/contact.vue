<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const contactDetails = computed(() => ({
	email: config.public.contactEmail,
	phone: config.public.contactPhone,
	location: config.public.contactLocation
}))
const hasContactDetails = computed(() => Object.values(contactDetails.value).some(Boolean))

usePageSeo(
	() => `${t('pages.contact.title')} | ${t('brand.name')}`,
	() => t('pages.contact.description')
)
</script>

<template>
	<div>
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.contact.title') }}</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('pages.contact.intro') }}</p>
			</div>
		</section>
		<section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
			<ContactMessageForm />
			<aside class="h-fit rounded-2xl bg-primary p-6 text-white">
				<h2 class="text-xl font-bold">{{ t('pages.contact.detailsTitle') }}</h2>
				<ul v-if="hasContactDetails" class="mt-5 space-y-4 text-sm leading-6 text-slate-200">
					<li v-if="contactDetails.email"><a class="underline decoration-accent underline-offset-4" :href="`mailto:${contactDetails.email}`">{{ contactDetails.email }}</a></li>
					<li v-if="contactDetails.phone"><a class="underline decoration-accent underline-offset-4" :href="`tel:${contactDetails.phone.replace(/\\s/g, '')}`">{{ contactDetails.phone }}</a></li>
					<li v-if="contactDetails.location">{{ contactDetails.location }}</li>
				</ul>
				<p v-else class="mt-4 text-sm leading-6 text-slate-200">{{ t('pages.contact.missingDetails') }}</p>
			</aside>
		</section>
	</div>
</template>