<script setup lang="ts">
/**
 * Champ piège anti-robots « contact_pref_hp » : invisible, hors tabulation, ignoré
 * des lecteurs d'écran. S'il est rempli, le serveur répond succès sans envoyer d'email.
 * Le positionnement hors écran est volontairement identique à la version d'origine.
 */
defineProps<{ id: string }>()
const model = defineModel<string>({ required: true })
const { t } = useI18n()
</script>

<template>
  <div class="pointer-events-none h-px w-px overflow-hidden" style="position: absolute; left: -10000px;" aria-hidden="true" inert>
    <label :for="id" aria-hidden="true">{{ t('forms.honeypotLabel') }}</label>
    <input :id="id" v-model="model" type="text" name="contact_pref_hp" tabindex="-1" aria-hidden="true" autocomplete="off">
  </div>
</template>
