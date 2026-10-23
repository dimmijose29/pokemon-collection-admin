<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { requiredString } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import OtpInput from '@/components/auth/OtpInput.vue'
import { parseErrors } from '@/utils/parseErrors'
import { useCapsLock } from '@/composables/useCapsLock'
import { CircleAlert, Lock, User } from 'lucide-vue-next'

const auth = useAuth()
const router = useRouter()
const { capsLockOn, checkCapsLock } = useCapsLock()

// Fase 1: credenziali validate dallo schema. Fase 2: codice OTP (6 cifre, gestito da OtpInput)
const { handleSubmit: validateCredentials } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      login: requiredString('Inserisci username o email'),
      password: z.string().min(1, 'Inserisci la password'),
    }),
  ),
  initialValues: { login: '', password: '' },
})

const code = ref('')
const errors = ref<string[]>([])
const twoFactorRequired = ref(false)
const tempToken = ref('')
const loading = ref(false)

async function verifyCode() {
  const res = await auth.verify2FACode(code.value, tempToken.value)
  if (!res.success) errors.value = [res.error || 'Codice 2FA non valido']
  else router.push({ name: 'dashboard' })
}

const login = validateCredentials(async (credentials) => {
  const res = await auth.attemptLogin(credentials)

  if (res.twoFactorRequired) {
    twoFactorRequired.value = true
    tempToken.value = res.tempToken || ''
    return
  }

  if (!res.success) {
    errors.value = parseErrors(res.error, 'Errore durante il login')
    return
  }

  router.push({ name: 'dashboard' })
})

async function handleSubmit(e?: Event) {
  // OTP completato e pulsante premuti insieme: una sola richiesta
  if (loading.value) return
  loading.value = true
  errors.value = []
  try {
    if (twoFactorRequired.value) await verifyCode()
    else await login(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-2xl">
    <div class="card-body p-8 md:p-10">
      <h2 class="text-2xl font-heading text-center mb-2">Accedi</h2>
      <p class="text-sm text-base-content/60 text-center mb-6">
        Inserisci le tue credenziali per accedere
      </p>

      <ErrorAlert :errors="errors" />

      <form novalidate @submit.prevent="handleSubmit">
        <!-- Username / Email -->
        <div v-if="!twoFactorRequired" class="mb-5">
          <BaseInput name="login" placeholder="Username o email" autocomplete="username">
            <template #prefix><User class="w-4 h-4 opacity-50" /></template>
          </BaseInput>
        </div>

        <!-- Password -->
        <div v-if="!twoFactorRequired" class="mb-5">
          <BaseInput
            name="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            @keydown="checkCapsLock"
          >
            <template #suffix><Lock class="w-4 h-4 opacity-50" /></template>
          </BaseInput>
          <div
            v-if="capsLockOn"
            v-motion-pop
            class="flex items-center gap-1 text-warning text-md mt-1"
          >
            <CircleAlert class="inline" /><strong> CAPS LOCK attivo</strong>
          </div>
        </div>

        <!-- 2FA (condizionale) -->
        <div v-if="twoFactorRequired" v-motion-pop class="mb-5">
          <label class="block text-sm font-medium text-center mb-3">
            Inserisci il codice OTP a 6 cifre
          </label>
          <OtpInput v-model="code" :length="6" @complete="handleSubmit()" />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-secondary w-full text-lg font-heading mt-2"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ twoFactorRequired ? 'Verifica Codice' : 'Accedi' }}
        </button>
      </form>

      <!-- Link recupero password -->
      <div v-if="!twoFactorRequired" class="text-center mt-4">
        <RouterLink to="/password-dimenticata" class="link link-hover text-sm text-base-content/60">
          Password dimenticata?
        </RouterLink>
      </div>
    </div>
  </div>
</template>
