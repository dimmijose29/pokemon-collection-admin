<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ disable: [code: string, password: string]; cancel: [] }>()

const code = ref('')
const password = ref('')

function submit() {
  if (code.value.length < 6 || !password.value) return
  emit('disable', code.value, password.value)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-base-content/70">
      Inserisci la tua password e il codice dall'app authenticator per confermare la disattivazione.
    </p>

    <div class="flex items-end gap-2 flex-wrap">
      <label class="flex flex-col gap-1 max-w-[220px]">
        <span class="text-sm font-medium">Password</span>
        <input
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="input app-field-control"
          @keydown.enter.prevent="submit"
        />
      </label>
      <label class="flex flex-col gap-1 max-w-[160px]">
        <span class="text-sm font-medium">Codice 2FA</span>
        <input
          v-model="code"
          type="text"
          name="code"
          inputmode="numeric"
          maxlength="6"
          autocomplete="one-time-code"
          placeholder="000000"
          class="input app-field-control font-mono tracking-[0.3em] text-center"
          @keydown.enter.prevent="submit"
        />
      </label>

      <div class="flex gap-2">
        <button
          type="button"
          class="btn btn-sm btn-error"
          :disabled="loading || code.length < 6 || !password"
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
