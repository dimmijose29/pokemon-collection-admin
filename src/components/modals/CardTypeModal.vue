<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useCardTypeModal } from '@/composables/useCardTypeModal'
import AppModal from '@/components/app/AppModal.vue'
import CardTypeForm from '@/components/forms/CardTypeForm.vue'
import type { CardType } from '@/types/card-type'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useCardTypeModal()

const currentCardType = computed(() => modalStore.currentData as CardType | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuovo tipo carta' : 'Modifica tipo carta'))
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
    <CardTypeForm
      :card-type="currentCardType"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="card-type-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
