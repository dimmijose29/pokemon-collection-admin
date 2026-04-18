<script setup lang="ts">
import { ref } from 'vue'
import { Shield } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { enable2FA, confirm2FA, disable2FA, me } from '@/api/auth'
import Settings2FAForm from '@/components/forms/Settings2FAForm.vue'

const authStore = useAuthStore()
const { allErrors, setErrors, clearErrors } = useErrorList()

const step = ref<'idle' | 'setup' | 'disabling'>('idle')
const loading = ref(false)
const qrCode = ref('')
const secret = ref('')

async function handleEnable() {
  loading.value = true
  clearErrors()
  try {
    const res = await enable2FA()
    qrCode.value = res.qr_code
    secret.value = res.secret
    step.value = 'setup'
  } catch (e) {
    setErrors(e)
  } finally {
    loading.value = false
  }
}

async function handleConfirm(code: string) {
  loading.value = true
  clearErrors()
  try {
    await confirm2FA(code)
    authStore.fillUser(await me())
    step.value = 'idle'
  } catch (e) {
    setErrors(e)
  } finally {
    loading.value = false
  }
}

async function handleCancelSetup() {
  authStore.fillUser(await me())
  step.value = 'idle'
}

async function handleDisable(code: string) {
  loading.value = true
  clearErrors()
  try {
    await disable2FA(code)
    authStore.fillUser(await me())
    step.value = 'idle'
  } catch (e) {
    setErrors(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body gap-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="bg-secondary/10 text-secondary rounded-xl p-2 shrink-0">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-semibold text-base-content">Autenticazione a due fattori</h2>
            <p class="text-sm text-base-content/50">Aggiungi un livello di sicurezza aggiuntivo</p>
          </div>
        </div>
        <div
          :class="[
            'badge badge-sm font-medium',
            authStore.user?.is_2fa_enabled ? 'badge-success' : 'badge-ghost',
          ]"
        >
          {{ authStore.user?.is_2fa_enabled ? 'Attiva' : 'Non attiva' }}
        </div>
      </div>

      <Settings2FAForm
        :is2fa-enabled="authStore.user?.is_2fa_enabled ?? false"
        :step="step"
        :qr-code="qrCode"
        :secret="secret"
        :errors="allErrors"
        :loading="loading"
        @enable="handleEnable"
        @confirm="handleConfirm"
        @cancel-setup="handleCancelSetup"
        @start-disable="step = 'disabling'"
        @disable="handleDisable"
        @cancel-disable="step = 'idle'"
      />
    </div>
  </div>
</template>
