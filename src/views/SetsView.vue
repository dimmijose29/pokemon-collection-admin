<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import SetTable from '@/components/tables/SetTable.vue'
import SetModal from '@/components/modals/SetModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci i set del gioco di carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuovo set
      </button>
    </template>
    <SetTable />
    <SetModal />
  </AppPage>
</template>
