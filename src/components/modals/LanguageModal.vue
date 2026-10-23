<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import LanguageForm from '@/components/forms/LanguageForm.vue'
import Languages from '@/api/languages'
import type { Language } from '@/types/language'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Languages,
  queryKey: 'languages',
  messages: { created: 'Lingua creata con successo', updated: 'Lingua aggiornata con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Language | null)
</script>

<template>
  <CrudModal
    title-create="Nuova lingua"
    title-edit="Modifica lingua"
    form-id="language-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <LanguageForm
        :language="current"
        :variant="mode"
        :errors="allErrors"
        @submit="handleSubmit"
      />
    </template>
  </CrudModal>
</template>
