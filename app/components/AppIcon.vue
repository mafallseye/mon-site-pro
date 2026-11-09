<script setup lang="ts">
/** Icônes décoratives (toujours aria-hidden) : le sens est porté par le texte voisin. */
defineProps<{ name: 'alert' | 'check' | 'menu' | 'close' | 'arrow-right' | 'arrow-left' | 'external' | 'chevron-down' }>()
</script>

<template>
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'alert'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </template>
    <path v-else-if="name === 'check'" d="m5 12.5 4.5 4.5L19 7.5" />
    <path v-else-if="name === 'menu'" d="M4 6h16M4 12h16M4 18h16" />
    <path v-else-if="name === 'close'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'arrow-right'" d="M5 12h14M13 6l6 6-6 6" />
    <path v-else-if="name === 'arrow-left'" d="M19 12H5M11 6l-6 6 6 6" />
    <path v-else-if="name === 'external'" d="M8 16 16 8M9 8h7v7" />
    <path v-else-if="name === 'chevron-down'" d="m6 9 6 6 6-6" />
  </svg>
</template>
