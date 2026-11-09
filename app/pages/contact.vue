<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const contactDetails = computed(() => ({
	email: config.public.contactEmail,
	phone: config.public.contactPhone,
	location: config.public.contactLocation
}))
const whatsappLink = useWhatsAppLink()
const hasContactDetails = computed(() => Object.values(contactDetails.value).some(Boolean) || Boolean(whatsappLink.value))

usePageSeo(
	() => `${t('pages.contact.title')} | ${t('brand.name')}`,
	() => t('pages.contact.description')
)
</script>

<template>
	<div>
		<PageHeader :title="t('pages.contact.title')" :lead="t('pages.contact.intro')" />
		<section class="mx-auto grid max-w-content gap-8 px-4 pb-section-sm md:px-6 md:pb-section xl:grid-cols-main-aside xl:px-8">
			<ContactMessageForm />
			<aside class="zone-dark h-fit rounded-card bg-primary-strong p-6 text-on-primary md:p-8">
				<h2 class="text-h3 font-display">{{ t('pages.contact.detailsTitle') }}</h2>
				<ul v-if="hasContactDetails" class="mt-5 space-y-4 text-small">
					<li v-if="contactDetails.email"><a class="break-all underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent" :href="`mailto:${contactDetails.email}`">{{ contactDetails.email }}</a></li>
					<li v-if="contactDetails.phone"><a class="underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent" :href="`tel:${contactDetails.phone.replace(/\s/g, '')}`">{{ contactDetails.phone }}</a></li>
					<li v-if="whatsappLink"><a class="underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent" :href="whatsappLink" target="_blank" rel="noopener noreferrer">{{ t('pages.contact.whatsapp') }}</a></li>
					<li v-if="contactDetails.location" class="text-on-primary-muted">{{ contactDetails.location }}</li>
				</ul>
				<p v-else class="mt-4 text-small text-on-primary-muted">{{ t('pages.contact.missingDetails') }}</p>
			</aside>
		</section>
	</div>
</template>
