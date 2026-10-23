<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import RarityForm from '@/components/forms/RarityForm.vue'
import Rarities from '@/api/rarities'
import type { Rarity } from '@/types/rarity'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Rarities,
  queryKey: 'rarities',
  messages: { created: 'Rarità creata con successo', updated: 'Rarità aggiornata con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Rarity | null)
</script>

<template>
  <CrudModal
    title-create="Nuova rarità"
    title-edit="Modifica rarità"
    form-id="rarity-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <RarityForm :rarity="current" :variant="mode" :errors="allErrors" @submit="handleSubmit" />
    </template>
  </CrudModal>
</template>
