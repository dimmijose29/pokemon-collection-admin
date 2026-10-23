<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Component } from 'vue'
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { getChartColors } from '@/utils/chartHelpers'
import { useThemeChange } from '@/composables/useThemeChange'
import type { ChartPoint } from '@/types/stats'

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip)

const PALETTE = [
  'oklch(0.75 0.18 85)', // amber
  'oklch(0.55 0.22 265)', // blue
  'oklch(0.65 0.18 155)', // green
  'oklch(0.60 0.22 15)', // red
  'oklch(0.60 0.20 300)', // purple
  'oklch(0.65 0.18 200)', // cyan
  'oklch(0.68 0.18 50)', // orange
  'oklch(0.65 0.18 340)', // pink
  'oklch(0.70 0.16 130)', // lime
  'oklch(0.58 0.05 265)', // slate
  'oklch(0.72 0.15 100)', // yellow-green
  'oklch(0.62 0.20 240)', // indigo
  'oklch(0.67 0.18 180)', // teal
  'oklch(0.58 0.18 330)', // rose
  'oklch(0.70 0.15 70)', // gold
]

// Il modulo garantisce un indice valido; `!` serve per noUncheckedIndexedAccess
const paletteColor = (i: number) => PALETTE[i % PALETTE.length]!

const props = defineProps<{
  data: ChartPoint[]
  title: string
  icon?: Component
  limit?: number
  formatValue?: (value: number) => string
}>()

const canvasRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

function items() {
  return props.limit ? props.data.slice(0, props.limit) : props.data
}

function buildChart() {
  if (!canvasRef.value) return
  if (chart) {
    chart.destroy()
    chart = null
  }

  const d = items()
  const { text, textFaint, grid } = getChartColors()

  chart = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: d.map((i) => i.label),
      datasets: [
        {
          data: d.map((i) => i.value),
          backgroundColor: d.map((_, i) => paletteColor(i).replace(')', ' / 0.82)')),
          hoverBackgroundColor: d.map((_, i) => paletteColor(i)),
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          bodyFont: { family: 'Manrope, system-ui, sans-serif' },
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.x ?? 0
              return (
                '  ' +
                (props.formatValue ? props.formatValue(value) : value.toLocaleString('it-IT'))
              )
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: grid },
          ticks: { color: textFaint, font: { size: 11 } },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: text,
            font: { size: 11.5 },
            callback: (_, i) => {
              const label = d[i]?.label ?? ''
              return label.length > 20 ? label.slice(0, 18) + '…' : label
            },
          },
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
      <div :style="{ height: Math.max((props.limit ?? props.data.length) * 30 + 20, 160) + 'px' }">
        <canvas ref="canvasRef" />
      </div>
    </div>
  </div>
</template>
