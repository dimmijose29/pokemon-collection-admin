<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, type Component } from 'vue'
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { getChartColors } from '@/utils/chartHelpers'
import { useThemeChange } from '@/composables/useThemeChange'
import type { ChartPoint } from '@/types/stats'

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps<{
  data: ChartPoint[]
  title: string
  icon?: Component
}>()

const canvasRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

// Gradiente da grigio-blu (anni vecchi) a primary (anni recenti)
const barColors = computed(() =>
  props.data.map((_, i) => {
    const n = props.data.length
    const t = n > 1 ? i / (n - 1) : 1
    const l = (0.40 + t * 0.22).toFixed(2)
    const c = (0.10 + t * 0.15).toFixed(2)
    return `oklch(${l} ${c} 265)`
  }),
)

function buildChart() {
  if (!canvasRef.value) return
  if (chart) { chart.destroy(); chart = null }

  const { text, textFaint, grid } = getChartColors()

  chart = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.data.map((i) => i.label),
      datasets: [{
        data: props.data.map((i) => i.value),
        backgroundColor: barColors.value.map((c) => c.replace(')', ' / 0.80)')),
        hoverBackgroundColor: barColors.value,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
        delay: (ctx) => ctx.dataIndex * 25,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          bodyFont: { family: 'Manrope, system-ui, sans-serif' },
          callbacks: {
            label: (ctx) => '  ' + (ctx.parsed.y ?? 0).toLocaleString('it-IT') + ' set',
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textFaint, font: { size: 11 }, maxRotation: 45 },
        },
        y: {
          grid: { color: grid },
          ticks: { color: text, font: { size: 11 }, precision: 0 },
        },
      },
    },
  })
}

onMounted(buildChart)
onUnmounted(() => chart?.destroy())
watch(() => props.data, buildChart, { deep: true })
useThemeChange(buildChart)
</script>

<template>
  <div class="card bg-base-100 border border-base-300 shadow-sm">
    <div class="card-body p-5">
      <div class="flex items-center gap-1.5 mb-3">
        <component :is="icon" v-if="icon" class="w-4 h-4 text-base-content/40 shrink-0" />
        <h3 class="font-semibold text-sm text-base-content/70">{{ title }}</h3>
      </div>
      <div style="height: 220px">
        <canvas ref="canvasRef" />
      </div>
    </div>
  </div>
</template>
