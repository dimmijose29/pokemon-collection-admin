<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import ConditionTable from '@/components/tables/ConditionTable.vue'
import ConditionModal from '@/components/modals/ConditionModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le condizioni delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova condizione
      </button>
    </template>
    <ConditionTable />
    <ConditionModal />
  </AppPage>
</template>
