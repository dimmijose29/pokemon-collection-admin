<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  subtitle?: string
}>()

const route = useRoute()
const title = computed(() => String(route.meta.title ?? ''))
const icon = computed(() => route.meta.icon ?? null)
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Header: icona + titolo + subtitle + actions -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="bg-secondary/10 text-secondary rounded-2xl p-3 shrink-0">
          <component :is="icon" v-if="icon" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="font-heading font-bold text-3xl text-base-content leading-tight">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-md text-base-content/50 mt-0.5">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0 pt-1">
        <slot name="actions" />
      </div>
    </div>

    <!-- Contenuto principale -->
    <slot />
  </div>
</template>
