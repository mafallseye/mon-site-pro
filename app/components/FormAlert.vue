<script setup lang="ts">
/** Bannière d'envoi : succès (role="status") ou erreur (role="alert"). */
defineProps<{ tone: 'success' | 'error' }>()
</script>

<template>
  <p
    :role="tone === 'error' ? 'alert' : 'status'"
    :aria-live="tone === 'error' ? undefined : 'polite'"
    :class="[
      'flex items-start gap-2.5 rounded-control border-l-4 px-4 py-3 text-small',
      tone === 'error' ? 'border-error-line bg-error-bg text-error-ink' : 'border-success-line bg-success-bg text-success-ink'
    ]"
  >
    <AppIcon :name="tone === 'error' ? 'alert' : 'check'" :class="['mt-0.5 size-4 shrink-0', tone === 'error' ? 'text-error-line' : 'text-success-line']" />
    <span><slot /></span>
  </p>
</template>
