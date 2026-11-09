<script setup lang="ts">
/**
 * Bouton d'action. Avec `to` : lien NuxtLink (passer un chemin déjà localisé via localePath),
 * sinon <button>. Variante « primary » = or (texte encre), « secondary » = contour émeraude.
 * `block` : pleine largeur sous 768 px.
 */
const props = withDefaults(defineProps<{
  to?: string
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  block?: boolean
  disabled?: boolean
}>(), {
  to: undefined,
  variant: 'primary',
  type: 'button',
  block: false,
  disabled: false
})

const classes = computed(() => [
  'inline-flex min-h-control items-center justify-center gap-2 rounded-control px-6 py-3 text-center text-body font-semibold transition-colors motion-safe:active:translate-y-px disabled:cursor-wait disabled:opacity-60',
  props.variant === 'primary'
    ? 'bg-accent text-ink hover:bg-accent-strong hover:shadow-card active:bg-accent-strong'
    : 'border-2 border-primary text-primary hover:bg-primary-soft',
  props.block ? 'w-full md:w-auto' : ''
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
