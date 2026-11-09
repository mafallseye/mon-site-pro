<script setup lang="ts">
/** Titre de section (h2) et intro facultative. */
defineProps<{ title: string, intro?: string }>()
</script>

<template>
  <div class="max-w-prose-content">
    <h2 class="text-h2 text-primary">{{ title }}</h2>
    <p v-if="intro" class="mt-3 text-ink-muted">{{ intro }}</p>
  </div>
</template>
