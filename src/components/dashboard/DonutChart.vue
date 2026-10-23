<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Component } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { getChartColors } from '@/utils/chartHelpers'
import { useThemeChange } from '@/composables/useThemeChange'
import type { ChartPoint } from '@/types/stats'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

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
  'oklch(0.55 0.05 265)', // slate
]

const props = defineProps<{
  data: ChartPoint[]
  title: string
  icon?: Component
  limit?: number
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
  const { text, bg } = getChartColors()

  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: d.map((i) => i.label),
      datasets: [
        {
          data: d.map((i) => i.value),
          backgroundColor: PALETTE.slice(0, d.length),
          hoverOffset: 8,
          borderWidth: 3,
          borderColor: bg,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 900,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: text,
            font: { size: 11.5, family: 'Manrope, system-ui, sans-serif' },
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: 3,
            padding: 8,
            usePointStyle: false,
            generateLabels: (chart) => {
              const dataset = chart.data.datasets[0]
              if (!dataset) return []
              const labels = chart.data.labels as string[]
              const values = dataset.data as number[]
              const colors = dataset.backgroundColor as string[]
              const total = values.reduce((a, b) => a + b, 0)
              return labels.map((label, i) => ({
                text: `${label}  ${total > 0 ? (((values[i] ?? 0) / total) * 100).toFixed(1) : 0}%`,
                fillStyle: colors[i],
                hidden: false,
                index: i,
              }))
            },
          },
        },
        tooltip: {
          bodyFont: { family: 'Manrope, system-ui, sans-serif' },
          callbacks: {
            label: (ctx) => {
              const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0)
              const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0'
              return `  ${ctx.parsed.toLocaleString('it-IT')} carte (${pct}%)`
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
      <div style="height: 220px">
        <canvas ref="canvasRef" />
      </div>
    </div>
  </div>
</template>
