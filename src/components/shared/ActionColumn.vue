<script setup lang="ts">
import { ref } from 'vue'
import { X, BadgeAlert, Pencil, Trash2, RotateCcw } from 'lucide-vue-next'

type Action = 'edit' | 'delete' | 'restore'

const props = defineProps<{
  actions?: Action[]
}>()

const emit = defineEmits<{
  edit: []
  delete: []
  restore: []
}>()

const show = (action: Action) => !props.actions || props.actions.includes(action)

// --- Delete confirm ---
const pendingDelete = ref(false)
const deleteX = ref(0)
const deleteY = ref(0)
let deleteTimer: ReturnType<typeof setTimeout>

function requestDelete(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  deleteX.value = rect.left + rect.width / 2 - 30
  deleteY.value = rect.top - 8
  pendingDelete.value = true
  deleteTimer = setTimeout(() => {
    pendingDelete.value = false
  }, 5000)
}

function confirmDelete() {
  clearTimeout(deleteTimer)
  pendingDelete.value = false
  emit('delete')
}

function cancelDelete() {
  clearTimeout(deleteTimer)
  pendingDelete.value = false
}

// --- Restore confirm ---
const pendingRestore = ref(false)
const restoreX = ref(0)
const restoreY = ref(0)
let restoreTimer: ReturnType<typeof setTimeout>

function requestRestore(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  restoreX.value = rect.left + rect.width / 2 - 30
  restoreY.value = rect.top - 8
  pendingRestore.value = true
  restoreTimer = setTimeout(() => {
    pendingRestore.value = false
  }, 5000)
}

function confirmRestore() {
  clearTimeout(restoreTimer)
  pendingRestore.value = false
  emit('restore')
}

function cancelRestore() {
  clearTimeout(restoreTimer)
  pendingRestore.value = false
}
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-if="show('edit')"
      class="btn btn-ghost btn-xs btn-square text-success tooltip tooltip-success"
      data-tip="Modifica"
      title="Modifica"
      @click="emit('edit')"
    >
      <Pencil class="w-3.5 h-3.5" />
    </button>

    <button
      v-if="show('delete')"
      class="btn btn-ghost btn-xs btn-square text-error tooltip tooltip-error"
      data-tip="Elimina"
      title="Elimina"
      @click="requestDelete($event)"
    >
      <Trash2 class="w-3.5 h-3.5" />
    </button>

    <button
      v-if="show('restore')"
      class="btn btn-ghost btn-xs btn-square text-warning tooltip tooltip-warning"
      data-tip="Ripristina"
      title="Ripristina"
      @click="requestRestore($event)"
    >
      <RotateCcw class="w-3.5 h-3.5" />
    </button>
  </div>

  <!-- Popover delete -->
  <div v-if="pendingDelete">
    <div class="fixed inset-0 z-[9998]" @click="cancelDelete" />
    <div
      v-motion-slide-bottom
      class="fixed z-[9999] -translate-x-1/2 -translate-y-full"
      :style="{ top: `${deleteY}px`, left: `${deleteX}px` }"
    >
      <div class="bg-base-100 border border-base-300 rounded-xl shadow-xl p-2 w-52">
        <div class="flex gap-2">
          <button class="btn btn-error btn-xs flex-1" @click="confirmDelete">
            <BadgeAlert class="w-3 h-3" /> Conferma
          </button>
          <button class="btn btn-ghost btn-xs flex-1" @click="cancelDelete">
            <X class="w-3 h-3" /> Annulla
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Popover restore -->
  <div v-if="pendingRestore">
    <div class="fixed inset-0 z-[9998]" @click="cancelRestore" />
    <div
      v-motion-slide-bottom
      class="fixed z-[9999] -translate-x-1/2 -translate-y-full"
      :style="{ top: `${restoreY}px`, left: `${restoreX}px` }"
    >
      <div class="bg-base-100 border border-base-300 rounded-xl shadow-xl p-2 w-52">
        <div class="flex gap-2">
          <button class="btn btn-warning btn-xs flex-1" @click="confirmRestore">
            <RotateCcw class="w-3 h-3" /> Ripristina
          </button>
          <button class="btn btn-ghost btn-xs flex-1" @click="cancelRestore">
            <X class="w-3 h-3" /> Annulla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
