<script setup lang="ts">
defineProps<{
  twoColumns?: boolean
}>()
</script>

<template>
  <div class="hero min-h-screen bg-base-200 px-4 py-12 overflow-x-hidden">
    <div class="hero-content max-w-full w-full">
      <!-- Layout a due colonne -->
      <div v-if="twoColumns" class="grid md:grid-cols-12 gap-12 w-full">
        <div v-motion-slide-left class="md:col-start-1 md:col-end-5">
          <div class="grid place-items-center min-h-full">
            <div class="w-full max-w-lg">
              <img src="/img/logo.png" alt="Logo" class="w-75 mx-auto mb-6" />
              <slot />
            </div>
          </div>
        </div>
        <div class="md:col-start-5 md:col-end-13">
          <div class="grid place-items-center">
            <slot name="sidebar" />
          </div>
        </div>
      </div>

      <!-- Layout centrato (senza sidebar) -->
      <div v-else class="flex flex-col items-center w-full">
        <div v-motion-slide-left class="w-full max-w-lg">
          <img src="/img/logo.png" alt="Logo" class="w-75 mx-auto mb-6" />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
