<script setup lang="ts">
const { t } = useI18n()
usePageSeo(
	() => `${t('pages.privacy.title')} | ${t('brand.name')}`,
	() => t('pages.privacy.description')
)
</script>

<template>
	<LegalPage page-key="privacy" />
</template>
