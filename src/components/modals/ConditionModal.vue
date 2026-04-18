<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useConditionModal } from '@/composables/useConditionModal'
import AppModal from '@/components/app/AppModal.vue'
import ConditionForm from '@/components/forms/ConditionForm.vue'
import type { Condition } from '@/types/condition'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useConditionModal()

const currentCondition = computed(() => modalStore.currentData as Condition | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuova condizione' : 'Modifica condizione'))
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
    <ConditionForm
      :condition="currentCondition"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="condition-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
