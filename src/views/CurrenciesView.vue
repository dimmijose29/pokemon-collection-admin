<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import CurrencyTable from '@/components/tables/CurrencyTable.vue'
import CurrencyModal from '@/components/modals/CurrencyModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le valute utilizzate nell'app">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova valuta
      </button>
    </template>
    <CurrencyTable />
    <CurrencyModal />
  </AppPage>
</template>
