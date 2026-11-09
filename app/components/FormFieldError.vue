<script setup lang="ts">
defineProps<{ id: string, message: string }>()
</script>

<template>
  <p :id="id" class="mt-1.5 flex items-start gap-1.5 text-small text-error-ink">
    <AppIcon name="alert" class="mt-0.5 size-4 shrink-0 text-error-line" />
    <span>{{ message }}</span>
  </p>
</template>
