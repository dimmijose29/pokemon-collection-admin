<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import LanguageTable from '@/components/tables/LanguageTable.vue'
import LanguageModal from '@/components/modals/LanguageModal.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <AppPage subtitle="Gestisci le lingue delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2" @click="modalStore.open()">
        <Plus class="w-4 h-4" /> Nuova lingua
      </button>
    </template>
    <LanguageTable />
    <LanguageModal />
  </AppPage>
</template>
