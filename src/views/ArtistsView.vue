<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import ArtistTable from '@/components/tables/ArtistTable.vue'
import ArtistModal from '@/components/modals/ArtistModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci gli artisti delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuovo artista
      </button>
    </template>
    <ArtistTable />
    <ArtistModal />
  </AppPage>
</template>
