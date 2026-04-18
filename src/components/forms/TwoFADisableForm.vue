<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ disable: [code: string]; cancel: [] }>()

const code = ref('')

function submit() {
  emit('disable', code.value)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-base-content/70">
      Inserisci il codice dall'app authenticator per confermare la disattivazione.
    </p>

    <div class="flex items-end gap-2 flex-wrap">
      <FormKit
        v-model="code"
        type="text"
        name="code"
        label="Codice 2FA"
        inputmode="numeric"
        maxlength="6"
        placeholder="000000"
        outer-class="mb-0 max-w-[160px]"
        input-class="font-mono tracking-[0.3em] text-center"
        @keydown.enter.prevent="submit"
      />

      <div class="flex gap-2 pb-5">
        <button
          type="button"
          class="btn btn-sm btn-error"
          :disabled="loading || code.length < 6"
          @click="submit"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs" />
          <X v-else class="w-4 h-4" />
          Conferma disattivazione
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Annulla
        </button>
      </div>
    </div>
  </div>
</template>
