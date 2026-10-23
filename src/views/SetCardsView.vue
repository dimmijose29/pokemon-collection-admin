<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { ArrowLeft } from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import SetCardsTable from '@/components/tables/SetCardsTable.vue'
import Sets from '@/api/sets'

const route = useRoute()
const router = useRouter()

const setId = computed(() => Number(route.params.id))

const { data: set } = useQuery({
  queryKey: ['sets', setId],
  queryFn: () => Sets.getById(setId.value),
  staleTime: Infinity,
})

const subtitle = computed(() => {
  if (!set.value) return 'Caricamento...'
  const parts: string[] = []
  if (set.value.series?.name) parts.push(set.value.series.name)
  parts.push(`${set.value.card_count_official} carte ufficiali`)
  if (set.value.release_date) parts.push(set.value.release_date.substring(0, 4))
  return parts.join(' · ')
})
</script>

<template>
  <AppPage>
    <template #header-content>
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back button -->
        <button
          class="btn btn-ghost btn-sm btn-square shrink-0"
          @click="router.push({ name: 'sets' })"
        >
          <ArrowLeft class="w-4 h-4" />
        </button>

        <!-- Set logo box -->
        <div class="bg-secondary/10 rounded-2xl px-3 py-2 shrink-0 flex items-center justify-center min-h-[3.5rem]">
          <img
            v-if="set?.logo_url"
            :src="set.logo_url"
            :alt="set?.name"
            class="h-8 max-w-[8rem] object-contain"
          />
          <span v-else class="text-secondary font-bold text-sm">SET</span>
        </div>

        <!-- Nome + badge + subtitle -->
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="font-heading font-bold text-3xl text-base-content leading-tight">
              {{ set?.name ?? 'Caricamento...' }}
            </h1>
            <span class="badge badge-secondary badge-outline font-normal shrink-0">Master Set</span>
          </div>
          <p class="text-md text-base-content/50 mt-0.5">{{ subtitle }}</p>
        </div>
      </div>
    </template>

    <SetCardsTable v-if="setId" :set-id="setId" :set="set ?? null" />
  </AppPage>
</template>
