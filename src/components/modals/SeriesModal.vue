<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useSeriesModal } from '@/composables/useSeriesModal'
import AppModal from '@/components/app/AppModal.vue'
import SeriesForm from '@/components/forms/SeriesForm.vue'
import type { Series } from '@/types/series'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useSeriesModal()

const currentSeries = computed(() => modalStore.currentData as Series | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuova serie' : 'Modifica serie'))
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
    <SeriesForm
      :series="currentSeries"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="series-form"
        class="btn btn-sm"
        :class="[btnClass, { loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
