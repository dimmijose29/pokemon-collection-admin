<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import CardTypeForm from '@/components/forms/CardTypeForm.vue'
import CardTypes from '@/api/card-types'
import type { CardType } from '@/types/card-type'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: CardTypes,
  queryKey: 'card-types',
  messages: {
    created: 'Tipo carta creato con successo',
    updated: 'Tipo carta aggiornato con successo',
  },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as CardType | null)
</script>

<template>
  <CrudModal
    title-create="Nuovo tipo carta"
    title-edit="Modifica tipo carta"
    form-id="card-type-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <CardTypeForm
        :card-type="current"
        :variant="mode"
        :errors="allErrors"
        @submit="handleSubmit"
      />
    </template>
  </CrudModal>
</template>
