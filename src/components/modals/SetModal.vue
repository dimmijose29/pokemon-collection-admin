<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useSetModal } from '@/composables/useSetModal'
import AppModal from '@/components/app/AppModal.vue'
import SetForm from '@/components/forms/SetForm.vue'
import type { Set } from '@/types/set'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useSetModal()

const currentSet = computed(() => modalStore.currentData as Set | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuovo set' : 'Modifica set'))
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
    <SetForm
      :set="currentSet"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="set-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
