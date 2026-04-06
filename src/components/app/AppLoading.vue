<script setup lang="ts">
defineProps<{
  visible: boolean
  message?: string
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div v-motion-pop class="p-8 flex flex-col items-center gap-4">
          <span class="loading loading-ring loading-lg text-secondary w-36" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
