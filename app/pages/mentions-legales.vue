<script setup lang="ts">
const { t } = useI18n()
usePageSeo(
	() => `${t('pages.legal.title')} | ${t('brand.name')}`,
	() => t('pages.legal.description')
)
</script>

<template>
	<LegalPage page-key="legal" />
</template>
