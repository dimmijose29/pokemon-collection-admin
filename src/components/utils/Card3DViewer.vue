<script setup lang="ts">
defineProps<{
  imageUrl: string | null
  alt?: string
  maxWidth?: string
}>()
</script>

<template>
  <div v-if="imageUrl" class="hover-3d mx-auto w-full" :style="maxWidth ? `max-width: ${maxWidth}` : 'max-width: 180px'">
    <figure class="rounded-2xl overflow-hidden">
      <img :src="imageUrl" :alt="alt ?? 'Card'" class="w-full h-full object-cover" />
    </figure>
    <!-- 8 empty divs necessari per l'effetto 3D (interazione mouse) -->
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-else class="w-[140px] h-[196px] bg-base-200 rounded-2xl flex items-center justify-center mx-auto text-base-content/20 text-xs">
    Nessuna immagine
  </div>
</template>
