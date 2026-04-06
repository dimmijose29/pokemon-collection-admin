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

const pendingDelete = ref(false)
const popoverX = ref(0)
const popoverY = ref(0)
let deleteTimer: ReturnType<typeof setTimeout>

function requestDelete(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  popoverX.value = rect.left + rect.width / 2 - 30
  popoverY.value = rect.top - 8
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

function cancel() {
  clearTimeout(deleteTimer)
  pendingDelete.value = false
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
      @click="emit('restore')"
    >
      <RotateCcw class="w-3.5 h-3.5" />
    </button>
  </div>

  <div v-if="pendingDelete">
    <!-- Backdrop trasparente per click-outside -->
    <div class="fixed inset-0 z-[9998]" @click="cancel" />

    <!-- Popover -->
    <div
      v-motion-slide-bottom
      class="fixed z-[9999] -translate-x-1/2 -translate-y-full"
      :style="{ top: `${popoverY}px`, left: `${popoverX}px` }"
    >
      <div class="bg-base-100 border border-base-300 rounded-xl shadow-xl p-2 w-52">
        <div class="flex gap-2">
          <button class="btn btn-error btn-xs flex-1" @click="confirmDelete">
            <BadgeAlert class="w-3 h-3" />Conferma
          </button>
          <button class="btn btn-ghost btn-xs flex-1" @click="cancel">
            <X class="w-3 h-3" />Annulla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
