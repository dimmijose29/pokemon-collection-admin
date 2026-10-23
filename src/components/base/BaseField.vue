<script setup lang="ts">
// Veste comune di un campo: etichetta, controllo (slot), aiuto ed errore.
// Nessuna logica di validazione: arriva dai componenti input tramite props.
defineProps<{
  /** id del controllo, collega la label */
  inputId: string
  label?: string
  help?: string
  /** messaggio d'errore corrente */
  error?: string
  /** mostra l'asterisco dei campi obbligatori */
  required?: boolean
}>()
</script>

<template>
  <div class="w-full mb-3">
    <div v-if="label" class="mb-1 flex items-baseline gap-1">
      <label :for="inputId" class="block text-sm font-medium text-base-content">{{ label }}</label>
      <!-- fuori dalla label: "Nome *" non è il nome accessibile del campo -->
      <span v-if="required" class="text-sm leading-none text-error" title="Campo obbligatorio"
        >*</span
      >
    </div>

    <slot />

    <p v-if="help && !error" class="mt-1.5 text-xs text-base-content/60">{{ help }}</p>
    <p v-if="error" class="field-message text-sm" role="alert">{{ error }}</p>
  </div>
</template>
