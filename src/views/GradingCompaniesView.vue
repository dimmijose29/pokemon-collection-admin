<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import GradingCompanyTable from '@/components/tables/GradingCompanyTable.vue'
import GradingCompanyModal from '@/components/modals/GradingCompanyModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le compagnie di grading delle carte">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova compagnia
      </button>
    </template>
    <GradingCompanyTable />
    <GradingCompanyModal />
  </AppPage>
</template>
