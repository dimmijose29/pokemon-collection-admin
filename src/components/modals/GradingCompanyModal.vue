<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useGradingCompanyModal } from '@/composables/useGradingCompanyModal'
import AppModal from '@/components/app/AppModal.vue'
import GradingCompanyForm from '@/components/forms/GradingCompanyForm.vue'
import type { GradingCompany } from '@/types/grading-company'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useGradingCompanyModal()

const currentGradingCompany = computed(() => modalStore.currentData as GradingCompany | null)
const title = computed(() =>
  modalStore.mode === 'create' ? 'Nuova compagnia di grading' : 'Modifica compagnia di grading',
)
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
    <GradingCompanyForm
      :grading-company="currentGradingCompany"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="grading-company-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
