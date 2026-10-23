<script setup lang="ts">
import { ref } from 'vue'
import { Check, X } from 'lucide-vue-next'

defineProps<{ qrCode: string; secret: string; loading: boolean }>()
const emit = defineEmits<{ confirm: [code: string]; cancel: [] }>()

const code = ref('')

function submit() {
  emit('confirm', code.value)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-6 items-start">
    <div class="shrink-0 p-2 bg-white rounded-xl border border-base-300">
      <img :src="qrCode" alt="QR Code 2FA" class="w-42 h-42" />
    </div>

    <div class="flex flex-col gap-3 flex-1">
      <p class="text-sm text-base-content/70">
        Scansiona il QR con la tua app authenticator, poi inserisci il codice a 6 cifre per
        completare l'attivazione.
      </p>

      <div v-if="secret" class="flex items-center gap-2">
        <span class="text-xs text-base-content/40">Codice manuale:</span>
        <code class="bg-base-200 px-2 py-0.5 rounded text-xs font-mono tracking-widest select-all">
          {{ secret }}
        </code>
      </div>

      <div class="flex items-end gap-2 flex-wrap">
        <label class="flex flex-col gap-1 max-w-[160px]">
          <span class="text-sm font-medium">Codice authenticator</span>
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
            class="btn btn-sm btn-success"
            :disabled="loading || code.length < 6"
            @click="submit"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs" />
            <Check v-else class="w-4 h-4" />
            Conferma
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            :disabled="loading"
            @click="emit('cancel')"
          >
            <X class="w-4 h-4" /> Annulla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
