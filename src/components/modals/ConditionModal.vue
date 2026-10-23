<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import ConditionForm from '@/components/forms/ConditionForm.vue'
import Conditions from '@/api/conditions'
import type { Condition } from '@/types/condition'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Conditions,
  queryKey: 'conditions',
  messages: {
    created: 'Condizione creata con successo',
    updated: 'Condizione aggiornata con successo',
  },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Condition | null)
</script>

<template>
  <CrudModal
    title-create="Nuova condizione"
    title-edit="Modifica condizione"
    form-id="condition-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <ConditionForm
        :condition="current"
        :variant="mode"
        :errors="allErrors"
        @submit="handleSubmit"
      />
    </template>
  </CrudModal>
</template>
