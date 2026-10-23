<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import SetForm from '@/components/forms/SetForm.vue'
import Sets from '@/api/sets'
import type { Set } from '@/types/set'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Sets,
  queryKey: 'sets',
  messages: { created: 'Set creato con successo', updated: 'Set aggiornato con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Set | null)
</script>

<template>
  <CrudModal
    title-create="Nuovo set"
    title-edit="Modifica set"
    form-id="set-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <SetForm :set="current" :variant="mode" :errors="allErrors" @submit="handleSubmit" />
    </template>
  </CrudModal>
</template>
