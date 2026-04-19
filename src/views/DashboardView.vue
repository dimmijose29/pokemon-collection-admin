<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  Layers, BookOpen, Users, Tag,
  TrendingUp, Gem, Wallet,
  PieChart, BarChart2, CalendarDays, Coins,
  CreditCard,
} from 'lucide-vue-next'
import AppPage from '@/layouts/AppPage.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import AnimatedNumber from '@/components/dashboard/AnimatedNumber.vue'
import BarChart from '@/components/dashboard/BarChart.vue'
import ColumnChart from '@/components/dashboard/ColumnChart.vue'
import DonutChart from '@/components/dashboard/DonutChart.vue'
import TopCardsTable from '@/components/dashboard/TopCardsTable.vue'
import StatsApi from '@/api/stats'

const { data, isLoading } = useQuery({
  queryKey: ['stats'],
  queryFn: () => StatsApi.get(),
  staleTime: 1000 * 60 * 5,
})

const kpi = computed(() => data.value?.kpi)

const pricedPct = computed(() => {
  const total = kpi.value?.cards_count
  const priced = kpi.value?.cards_with_price
  if (!total || !priced) return null
  return Math.round((priced / total) * 100)
})

const cardsPerRarity = computed(() => data.value?.charts.cards_per_rarity ?? [])
const cardsPerSeries = computed(() => data.value?.charts.cards_per_series ?? [])
const setsPerYear    = computed(() => data.value?.charts.sets_per_year ?? [])
const priceRanges    = computed(() => data.value?.charts.price_ranges ?? [])
const topCards       = computed(() => data.value?.top_cards ?? [])
</script>

<template>
  <AppPage>
    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-base-200 rounded-2xl" />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-base-200 rounded-2xl" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="h-64 bg-base-200 rounded-2xl" />
      </div>
      <div class="h-96 bg-base-200 rounded-2xl" />
    </div>

    <div v-else class="space-y-6">

      <!-- KPI principali -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Espansioni" accent="secondary" :icon="Layers">
          <AnimatedNumber :value="kpi?.sets_count ?? null" />
        </StatCard>
        <StatCard label="Carte nel catalogo" :icon="CreditCard">
          <AnimatedNumber :value="kpi?.cards_count ?? null" />
        </StatCard>
        <StatCard label="Serie" :icon="BookOpen">
          <AnimatedNumber :value="kpi?.series_count ?? null" />
        </StatCard>
        <StatCard label="Utenti registrati" accent="info" :icon="Users">
          <AnimatedNumber :value="kpi?.users_count ?? null" />
        </StatCard>
      </div>

      <!-- KPI prezzi -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Carte con prezzo"
          accent="success"
          :icon="Tag"
          :sub="pricedPct != null ? pricedPct + '% del catalogo' : undefined"
        >
          <AnimatedNumber :value="kpi?.cards_with_price ?? null" />
        </StatCard>
        <StatCard label="Prezzo medio" sub="Cardmarket" :icon="TrendingUp">
          <span v-if="kpi?.avg_price == null">—</span>
          <span v-else>€ <AnimatedNumber :value="kpi.avg_price" :decimals="2" :duration="1200" /></span>
        </StatCard>
        <StatCard label="Carta più costosa" accent="warning" :icon="Gem">
          <span v-if="kpi?.max_price == null">—</span>
          <span v-else>€ <AnimatedNumber :value="kpi.max_price" :decimals="2" :duration="1400" /></span>
        </StatCard>
        <StatCard label="Valore totale catalogo" accent="success" sub="somma prezzi Cardmarket" :icon="Wallet">
          <span v-if="kpi?.total_value == null">—</span>
          <span v-else>€ <AnimatedNumber :value="kpi.total_value" :decimals="2" :duration="1600" /></span>
        </StatCard>
      </div>

      <!-- Grafici fila 1 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DonutChart
          title="Distribuzione per rarità"
          :icon="PieChart"
          :data="cardsPerRarity"
          :limit="10"
        />
        <BarChart
          title="Carte per serie (top 15)"
          :icon="BarChart2"
          :data="cardsPerSeries"
          :limit="15"
        />
      </div>

      <!-- Grafici fila 2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColumnChart
          title="Espansioni per anno di uscita"
          :icon="CalendarDays"
          :data="setsPerYear"
        />
        <BarChart
          title="Distribuzione fasce di prezzo"
          :icon="Coins"
          :data="priceRanges"
          :format-value="(v) => v.toLocaleString('it-IT') + ' carte'"
        />
      </div>

      <!-- Top 10 -->
      <TopCardsTable :cards="topCards" />

    </div>
  </AppPage>
</template>
