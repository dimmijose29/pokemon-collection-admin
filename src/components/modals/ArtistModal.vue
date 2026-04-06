<script setup lang="ts">
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'
import { useModalStore } from '@/stores/modal'
import { useArtistModal } from '@/composables/useArtistModal'
import AppModal from '@/components/app/AppModal.vue'
import ArtistForm from '@/components/forms/ArtistForm.vue'
import type { Artist } from '@/types/artist'

const modalStore = useModalStore()
const { handleSubmit, loading, allErrors } = useArtistModal()

const currentArtist = computed(() => modalStore.currentData as Artist | null)
const title = computed(() => (modalStore.mode === 'create' ? 'Nuovo artista' : 'Modifica artista'))
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
    <ArtistForm
      :artist="currentArtist"
      :variant="modalStore.mode"
      :errors="allErrors"
      @submit="handleSubmit"
    />

    <template #footer>
      <button
        type="submit"
        form="artist-form"
        class="btn btn-sm"
        :class="[btnClass, { loading: loading }]"
        :disabled="loading"
      >
        <Save class="w-4 h-4" /> Salva
      </button>
    </template>
  </AppModal>
</template>
