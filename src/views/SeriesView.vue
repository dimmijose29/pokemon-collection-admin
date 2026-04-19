<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import SeriesTable from '@/components/tables/SeriesTable.vue'
import SeriesModal from '@/components/modals/SeriesModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le serie del gioco di carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova serie
      </button>
    </template>
    <SeriesTable />
    <SeriesModal />
  </AppPage>
</template>
