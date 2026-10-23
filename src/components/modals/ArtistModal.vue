<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCrudModal } from '@/composables/useCrudModal'
import CrudModal from '@/components/app/CrudModal.vue'
import ArtistForm from '@/components/forms/ArtistForm.vue'
import Artists from '@/api/artists'
import type { Artist } from '@/types/artist'

const { handleSubmit, loading, allErrors } = useCrudModal({
  api: Artists,
  queryKey: 'artists',
  messages: { created: 'Artista creato con successo', updated: 'Artista aggiornato con successo' },
})

const modalStore = useModalStore()
const current = computed(() => modalStore.currentData as Artist | null)
</script>

<template>
  <CrudModal
    title-create="Nuovo artista"
    title-edit="Modifica artista"
    form-id="artist-form"
    :loading="loading"
  >
    <template #default="{ mode }">
      <ArtistForm :artist="current" :variant="mode" :errors="allErrors" @submit="handleSubmit" />
    </template>
  </CrudModal>
</template>
