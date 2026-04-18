<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useRarityModal } from '@/composables/useRarityModal'
import AppModal from '@/components/app/AppModal.vue'
import RarityForm from '@/components/forms/RarityForm.vue'
import type { Rarity } from '@/types/rarity'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useRarityModal()

const currentRarity = computed(() => modalStore.currentData as Rarity | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuova rarità' : 'Modifica rarità'))
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
    <RarityForm
      :rarity="currentRarity"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="rarity-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
