<script setup lang="ts">
/**
 * Champ de formulaire accessible : libellé visible, astérisque décoratif,
 * message d'erreur relié par aria-describedby, état aria-invalid.
 * Les attributs (name, autocomplete, maxlength, placeholder, @input…) sont transmis au contrôle.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id: string
  label: string
  as?: 'input' | 'select' | 'textarea'
  required?: boolean
  optionalLabel?: string
  error?: string
}>(), {
  as: 'input',
  required: false,
  optionalLabel: undefined,
  error: undefined
})

const model = defineModel<string>({ required: true })
const errorId = computed(() => `${props.id}-error`)
const controlBindings = computed(() => ({
  id: props.id,
  required: props.required,
  'aria-invalid': Boolean(props.error),
  'aria-describedby': props.error ? errorId.value : undefined
}))
const controlClass = 'block w-full rounded-control border border-line-strong bg-surface px-3.5 py-3 text-body text-ink transition-colors placeholder:text-ink-muted hover:border-ink-muted focus:border-primary aria-invalid:border-2 aria-invalid:border-error-line disabled:bg-surface-muted disabled:text-ink-muted'
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-small font-semibold text-ink">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
      <span v-else-if="optionalLabel" class="font-normal text-ink-muted">({{ optionalLabel }})</span>
    </label>

    <div v-if="as === 'select'" class="relative">
      <select v-model="model" v-bind="{ ...$attrs, ...controlBindings }" :class="[controlClass, 'appearance-none pr-10']">
        <slot />
      </select>
      <AppIcon name="chevron-down" class="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink" />
    </div>
    <textarea v-else-if="as === 'textarea'" v-model="model" v-bind="{ ...$attrs, ...controlBindings }" :class="[controlClass, 'resize-y']" />
    <input v-else v-model="model" v-bind="{ ...$attrs, ...controlBindings }" :class="controlClass">

    <FormFieldError v-if="error" :id="errorId" :message="error" />
  </div>
</template>
