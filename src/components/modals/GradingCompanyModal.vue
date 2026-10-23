<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import GradingCompanyForm from '@/components/forms/GradingCompanyForm.vue'
import GradingCompanies from '@/api/grading-companies'
import type { GradingCompany } from '@/types/grading-company'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: GradingCompanies,
  queryKey: 'grading-companies',
  messages: {
    created: 'Compagnia di grading creata con successo',
    updated: 'Compagnia di grading aggiornata con successo',
  },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as GradingCompany | null)
</script>

<template>
  <CrudModal
    title-create="Nuova compagnia di grading"
    title-edit="Modifica compagnia di grading"
    form-id="grading-company-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <GradingCompanyForm
        :grading-company="current"
        :variant="mode"
        :errors="allErrors"
        @submit="handleSubmit"
      />
    </template>
  </CrudModal>
</template>
