<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  value: number | null
  format?: (n: number) => string
  duration?: number
  decimals?: number
}>()

const current = ref(0)
const started = ref(false)

watch(
  () => props.value,
  (target) => {
    if (target == null) return
    const start = started.value ? current.value : 0
    const end = target
    const dur = props.duration ?? 1000
    const startTime = performance.now()
    started.value = true

    function tick(now: number) {
      const t = Math.min((now - startTime) / dur, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      current.value = start + (end - start) * eased
      if (t < 1) requestAnimationFrame(tick)
      else current.value = end
    }
    requestAnimationFrame(tick)
  },
  { immediate: true },
)

const displayed = computed(() => {
  if (props.value == null) return '—'
  const n = props.decimals ? current.value : Math.round(current.value)
  if (props.format) return props.format(n)
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: props.decimals ?? 0,
    maximumFractionDigits: props.decimals ?? 0,
  })
})
</script>

<template>
  <span>{{ displayed }}</span>
</template>
