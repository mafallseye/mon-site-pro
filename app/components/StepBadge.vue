<script setup lang="ts">
/** Pastille numérotée or (01, 02…), décorative : l'ordre est porté par la liste <ol> ou le titre. */
defineProps<{ index: number }>()
</script>

<template>
  <span aria-hidden="true" class="inline-flex size-tap shrink-0 items-center justify-center rounded-badge bg-accent text-small font-semibold tabular-nums text-ink">{{ String(index + 1).padStart(2, '0') }}</span>
</template>
