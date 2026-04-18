<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useCurrencyModal } from '@/composables/useCurrencyModal'
import AppModal from '@/components/app/AppModal.vue'
import CurrencyForm from '@/components/forms/CurrencyForm.vue'
import type { Currency } from '@/types/currency'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useCurrencyModal()

const currentCurrency = computed(() => modalStore.currentData as Currency | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuova valuta' : 'Modifica valuta'))
const btnClass = computed(() => (modalStore.mode === 'create' ? 'btn-secondary' : 'btn-success'))
</script>

<template>
  <AppModal
    :model-value="modalStore.isOpen"
    :title="title"
    :variant="modalStore.mode"
    :loading="loading"
    @update:model-value="modalStore.close()"
  >
    <CurrencyForm
      :currency="currentCurrency"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="currency-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
