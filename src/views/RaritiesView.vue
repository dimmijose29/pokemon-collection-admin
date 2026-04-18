<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import RarityTable from '@/components/tables/RarityTable.vue'
import RarityModal from '@/components/modals/RarityModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le rarità delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova rarità
      </button>
    </template>
    <RarityTable />
    <RarityModal />
  </AppPage>
</template>
