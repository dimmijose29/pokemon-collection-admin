<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import CardTypeTable from '@/components/tables/CardTypeTable.vue'
import CardTypeModal from '@/components/modals/CardTypeModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci i tipi delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuovo tipo carta
      </button>
    </template>
    <CardTypeTable />
    <CardTypeModal />
  </AppPage>
</template>
