<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import SeriesForm from '@/components/forms/SeriesForm.vue'
import SeriesApi from '@/api/series'
import type { Series } from '@/types/series'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: SeriesApi,
  queryKey: 'series',
  messages: { created: 'Serie creata con successo', updated: 'Serie aggiornata con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Series | null)
</script>

<template>
  <CrudModal
    title-create="Nuova serie"
    title-edit="Modifica serie"
    form-id="series-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <SeriesForm :series="current" :variant="mode" :errors="allErrors" @submit="handleSubmit" />
    </template>
  </CrudModal>
</template>
