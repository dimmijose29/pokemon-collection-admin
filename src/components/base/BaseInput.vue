<script setup lang="ts">
import { computed, useId } from 'vue'
import { useField } from 'vee-validate'
import BaseField from './BaseField.vue'

// Campo di testo collegato al form VeeValidate tramite `name` (chiave dello schema Zod).
// Come la modalità "dirty" di FormKit: all'uscita valida solo un campo modificato
// (passare su un campo vuoto non mostra errori), dopo il primo errore rivalida mentre si
// scrive; l'invio del form valida comunque tutti i campi.
const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'date'
    placeholder?: string
    help?: string
    required?: boolean
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'email'
    maxlength?: number
  }>(),
  { type: 'text' },
)

const emit = defineEmits<{ keydown: [event: KeyboardEvent] }>()

const inputId = useId()

const { value, errorMessage, meta, handleBlur, handleChange } = useField<string | number>(
  () => props.name,
  undefined,
  { validateOnValueUpdate: false },
)

const hasError = computed(() => !!errorMessage.value)

function onInput(e: Event) {
  handleChange((e.target as HTMLInputElement).value, hasError.value)
}
</script>

<template>
  <BaseField
    :input-id="inputId"
    :label="label"
    :help="help"
    :error="errorMessage"
    :required="required"
  >
    <label
      class="input app-field-control flex w-full items-center gap-2"
      :class="{ 'is-invalid': hasError }"
    >
      <slot name="prefix" />
      <input
        :id="inputId"
        class="grow min-w-0"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :value="value"
        :aria-invalid="hasError"
        :aria-label="label ? undefined : placeholder"
        @input="onInput"
        @blur="handleBlur($event, meta.dirty)"
        @keydown="emit('keydown', $event)"
      />
      <slot name="suffix" />
    </label>
  </BaseField>
</template>
