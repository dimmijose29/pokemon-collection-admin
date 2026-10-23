<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxViewport,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxItemIndicator,
} from 'reka-ui'
import { Check, ChevronDown, X } from 'lucide-vue-next'

// Select ricercabile (selezione singola) su Reka UI Combobox, vestita daisyUI.
// v-model: valore stringa, '' = nessuna selezione. Usata da BaseSelect nei form.
const props = withDefaults(
  defineProps<{
    modelValue: string
    options: { value: string; label: string }[]
    placeholder?: string
    clearable?: boolean
    invalid?: boolean
    inputId?: string
    ariaLabel?: string
  }>(),
  { placeholder: 'Seleziona…', clearable: true, invalid: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? '',
)

// Apertura e testo di ricerca gestiti qui: chiuso mostra l'etichetta scelta,
// aperto riparte da una ricerca vuota.
const open = ref(false)
const searchTerm = ref(selectedLabel.value)

// Dopo una selezione Reka può chiedere subito di riaprire il pannello: si ignora.
let suppressReopen = false

function onOpenUpdate(value: boolean) {
  if (value && suppressReopen) return
  open.value = value
}

function onUpdate(val: unknown) {
  emit('update:modelValue', (val ?? '') as string)
  suppressReopen = true
  open.value = false
  setTimeout(() => (suppressReopen = false), 0)
}

watch(open, (isOpen) => {
  searchTerm.value = isOpen ? '' : selectedLabel.value
})

// Le opzioni possono arrivare dopo il valore (query in corso): aggiorna l'etichetta.
watch(selectedLabel, (label) => {
  if (!open.value) searchTerm.value = label
})
</script>

<template>
  <ComboboxRoot
    :open="open"
    :model-value="modelValue || undefined"
    :open-on-click="true"
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    class="relative w-full"
    @update:open="onOpenUpdate"
    @update:model-value="onUpdate"
  >
    <ComboboxAnchor
      class="input app-field-control flex w-full items-center gap-1"
      :class="{ 'is-invalid': invalid }"
    >
      <ComboboxInput
        :id="inputId"
        v-model="searchTerm"
        class="min-w-0 grow bg-transparent outline-none placeholder:text-base-content/50"
        :placeholder="placeholder"
        :aria-label="ariaLabel ?? placeholder"
      />
      <div class="ml-auto flex shrink-0 items-center gap-1">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="text-base-content/40 hover:text-base-content"
          aria-label="Cancella selezione"
          @click.stop="emit('update:modelValue', '')"
        >
          <X class="w-3.5 h-3.5" />
        </button>
        <ComboboxTrigger class="flex items-center text-base-content/50" aria-label="Apri opzioni">
          <ChevronDown class="w-3.5 h-3.5" />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>

    <!-- popper: esce dagli overflow della modale -->
    <ComboboxContent
      position="popper"
      :side-offset="4"
      class="z-[60] max-h-60 min-w-[var(--reka-popper-anchor-width)] overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-lg"
    >
      <ComboboxViewport class="max-h-60 overflow-y-auto p-1">
        <ComboboxEmpty class="px-3 py-2 text-sm text-base-content/50"
          >Nessun risultato</ComboboxEmpty
        >
        <ComboboxItem
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none data-[highlighted]:bg-base-200 data-[state=checked]:font-medium data-[state=checked]:text-secondary"
        >
          <span class="flex-1">{{ opt.label }}</span>
          <ComboboxItemIndicator>
            <Check class="w-4 h-4 text-secondary" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
