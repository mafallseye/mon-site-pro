<script setup lang="ts">
/**
 * Lien texte émeraude souligné (le soulignement distingue le lien du texte voisin).
 * `to` = lien interne localisé ; `href` = lien externe (nouvel onglet).
 * `icon` ajoute une flèche décorative.
 */
withDefaults(defineProps<{
  to?: string
  href?: string
  icon?: 'arrow-right' | 'arrow-left' | 'external'
}>(), {
  to: undefined,
  href: undefined,
  icon: undefined
})

const linkClass = 'group inline-flex items-center gap-1.5 font-semibold text-primary underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary-strong hover:decoration-accent'
const iconClass = 'size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5'
</script>

<template>
  <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer" :class="linkClass">
    <slot />
    <AppIcon v-if="icon" :name="icon" :class="iconClass" />
  </a>
  <NuxtLink v-else :to="to" :class="linkClass">
    <AppIcon v-if="icon === 'arrow-left'" name="arrow-left" :class="iconClass" />
    <slot />
    <AppIcon v-if="icon && icon !== 'arrow-left'" :name="icon" :class="iconClass" />
  </NuxtLink>
</template>
