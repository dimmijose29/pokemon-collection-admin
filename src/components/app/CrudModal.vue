<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import AppModal from '@/components/app/AppModal.vue'

// Guscio comune delle modali di catalogo: titolo, apertura/chiusura e pulsante Salva.
// Il form arriva dallo slot, che riceve la modalità (create/edit).
const props = defineProps<{
  titleCreate: string
  titleEdit: string
  /** id del form nello slot: il pulsante Salva lo invia con l'attributo `form`. */
  formId: string
  loading: boolean
}>()

const modalStore = useModalStore()

const title = computed(() => (modalStore.mode === 'create' ? props.titleCreate : props.titleEdit))
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
    <slot :mode="modalStore.mode" />

    <template #footer>
      <button
        type="submit"
        :form="formId"
        class="btn btn-sm"
        :class="[btnClass, { loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
