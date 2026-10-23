<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import CurrencyForm from '@/components/forms/CurrencyForm.vue'
import Currencies from '@/api/currencies'
import type { Currency } from '@/types/currency'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Currencies,
  queryKey: 'currencies',
  messages: { created: 'Valuta creata con successo', updated: 'Valuta aggiornata con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Currency | null)
</script>

<template>
  <CrudModal
    title-create="Nuova valuta"
    title-edit="Modifica valuta"
    form-id="currency-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <CurrencyForm
        :currency="current"
        :variant="mode"
        :errors="allErrors"
        @submit="handleSubmit"
      />
    </template>
  </CrudModal>
</template>
