<script setup lang="ts">
import { ref } from 'vue'
import { ZoomIn } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()
const isOpen = ref(false)
const popoverX = ref(0)
const popoverY = ref(0)

function toggle(event: MouseEvent) {
  if (isOpen.value) {
    isOpen.value = false
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  popoverX.value = rect.left + rect.width / 2
  popoverY.value = rect.bottom + 8
  isOpen.value = true
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <div class="tooltip tooltip-bottom" data-tip="Dimensione testo">
    <button class="btn btn-ghost btn-sm btn-square" @click="toggle($event)">
      <ZoomIn class="w-5 h-5" />
    </button>
  </div>

  <template v-if="isOpen">
    <div class="fixed inset-0 z-[9998]" @click="close" />
    <div
      v-motion-slide-bottom
      class="fixed z-[9999] -translate-x-1/2"
      :style="{ top: `${popoverY}px`, left: `${popoverX}px` }"
    >
      <div
        class="bg-base-100 border border-base-300 rounded-xl shadow-xl px-4 py-3 flex items-center gap-3"
      >
        <span class="text-xs font-semibold text-base-content/50 select-none">A</span>

        <div class="flex items-end gap-2">
          <button
            v-for="(_, i) in 6"
            :key="i"
            class="rounded-full transition-all duration-150"
            :class="
              layout.fontSizeLevel === i ? 'bg-secondary' : 'bg-base-300 hover:bg-base-content/20'
            "
            :style="{ width: `${8 + i * 4}px`, height: `${8 + i * 4}px` }"
            @click="layout.setFontSizeLevel(i)"
          />
        </div>

        <span class="text-base font-semibold text-base-content/50 select-none">A</span>
      </div>
    </div>
  </template>
</template>
