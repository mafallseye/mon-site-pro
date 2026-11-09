<script setup lang="ts">
/** Titre de section (h2) et intro facultative. */
withDefaults(defineProps<{ title: string, intro?: string, onDark?: boolean }>(), { intro: undefined, onDark: false })
</script>

<template>
  <div class="max-w-prose-content">
    <h2 :class="['text-h2', onDark ? 'text-on-primary' : 'text-primary']">{{ title }}</h2>
    <p v-if="intro" :class="['mt-3', onDark ? 'text-on-primary-muted' : 'text-ink-muted']">{{ intro }}</p>
  </div>
</template>
