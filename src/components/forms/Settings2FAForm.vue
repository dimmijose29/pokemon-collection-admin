<script setup lang="ts">
import { Shield, X } from 'lucide-vue-next'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import TwoFASetupForm from '@/components/forms/TwoFASetupForm.vue'
import TwoFADisableForm from '@/components/forms/TwoFADisableForm.vue'

defineProps<{
  is2faEnabled: boolean
  step: 'idle' | 'setup' | 'disabling'
  qrCode: string
  secret: string
  errors: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  enable: []
  confirm: [code: string]
  cancelSetup: []
  startDisable: []
  disable: [code: string]
  cancelDisable: []
}>()
</script>

<template>
  <ErrorAlert :errors="errors" />

  <!-- Non attiva -->
  <template v-if="!is2faEnabled && step === 'idle'">
    <p class="text-sm text-base-content/60 max-w-lg">
      Usa un'app come Google Authenticator o Authy per generare codici temporanei ad ogni accesso.
    </p>
    <div>
      <button class="btn btn-sm btn-secondary" :disabled="loading" @click="emit('enable')">
        <span v-if="loading" class="loading loading-spinner loading-xs" />
        <Shield v-else class="w-4 h-4" />
        Attiva 2FA
      </button>
    </div>
  </template>

  <!-- Setup QR -->
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-1"
    leave-active-class="transition-all duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-1"
  >
    <TwoFASetupForm
      v-if="step === 'setup'"
      :qr-code="qrCode"
      :secret="secret"
      :loading="loading"
      @confirm="(code) => emit('confirm', code)"
      @cancel="emit('cancelSetup')"
    />
  </Transition>

  <!-- Attiva -->
  <template v-if="is2faEnabled && step === 'idle'">
    <p class="text-sm text-base-content/60 max-w-lg">
      Il tuo account è protetto. Ad ogni accesso ti verrà chiesto il codice dall'app authenticator.
    </p>
    <div>
      <button
        class="btn btn-sm btn-error btn-outline"
        :disabled="loading"
        @click="emit('startDisable')"
      >
        <X class="w-4 h-4" /> Disattiva 2FA
      </button>
    </div>
  </template>

  <!-- Disattivazione -->
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-1"
    leave-active-class="transition-all duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-1"
  >
    <TwoFADisableForm
      v-if="step === 'disabling'"
      :loading="loading"
      @disable="(code) => emit('disable', code)"
      @cancel="emit('cancelDisable')"
    />
  </Transition>
</template>
