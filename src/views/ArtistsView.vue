<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import ArtistTable from '@/components/tables/ArtistTable.vue'
</script>

<template>
  <AppPage subtitle="Gestisci gli artisti delle carte Pokémon">
    <template #actions>
      <button class="btn btn-secondary btn-outline gap-2">
        <Plus class="w-4 h-4" />
        Nuovo artista
      </button>
    </template>

    <ArtistTable />
  </AppPage>
</template>
