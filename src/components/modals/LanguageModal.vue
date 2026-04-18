<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useLanguageModal } from '@/composables/useLanguageModal'
import AppModal from '@/components/app/AppModal.vue'
import LanguageForm from '@/components/forms/LanguageForm.vue'
import type { Language } from '@/types/language'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useLanguageModal()

const currentLanguage = computed(() => modalStore.currentData as Language | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuova lingua' : 'Modifica lingua'))
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
    <LanguageForm
      :language="currentLanguage"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="language-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
