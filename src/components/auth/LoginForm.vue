<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import type { LoginCredentials } from '@/types/auth'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import OtpInput from '@/components/auth/OtpInput.vue'
import { parseErrors } from '@/utils/parseErrors'
import { useCapsLock } from '@/composables/useCapsLock'
import { CircleAlert } from 'lucide-vue-next'

const auth = useAuth()
const router = useRouter()
const { capsLockOn, checkCapsLock } = useCapsLock()

const form = ref({
  login: '',
  password: '',
  code: '',
})

const errors = ref<string[]>([])
const twoFactorRequired = ref(false)
const tempToken = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  errors.value = []

  // Fase 2: verifica codice OTP
  if (twoFactorRequired.value) {
    const res = await auth.verify2FACode(form.value.code, tempToken.value)
    if (!res.success) errors.value = [res.error || 'Codice 2FA non valido']
    else router.push({ name: 'dashboard' })

    loading.value = false
    return
  }

  // Fase 1: login normale
  const payload: LoginCredentials = {
    login: form.value.login.trim(),
    password: form.value.password,
  }

  const res = await auth.attemptLogin(payload)

  if (res.twoFactorRequired) {
    twoFactorRequired.value = true
    tempToken.value = res.tempToken || ''
    loading.value = false
    return
  }

  if (!res.success) {
    errors.value = parseErrors(res.error, 'Errore durante il login')
    loading.value = false
    return
  }

  loading.value = false
  router.push({ name: 'dashboard' })
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

      <FormKit
        type="form"
        @submit="handleSubmit"
        submit-label="Accedi"
        :submit-attrs="{ style: { display: 'none' } }"
      >
        <!-- Username / Email -->
        <div v-if="!twoFactorRequired" class="mb-5">
          <FormKit
            type="text"
            name="login"
            prefix-icon="avatarMan"
            placeholder="Username o email"
            outer-class="max-w-full"
            input-class="outline-0"
            v-model="form.login"
            validation="required"
            validation-visibility="dirty"
            :validation-messages="{ required: 'Inserisci username o email' }"
            message-class="text-error text-sm mt-1"
          />
        </div>

        <!-- Password -->
        <div v-if="!twoFactorRequired" class="mb-5">
          <FormKit
            type="password"
            name="password"
            suffix-icon="password"
            placeholder="Password"
            outer-class="max-w-full"
            input-class="outline-0"
            v-model="form.password"
            validation="required"
            validation-visibility="dirty"
            :validation-messages="{ required: 'Inserisci la password' }"
            message-class="text-error text-sm mt-1"
            @click="checkCapsLock"
            @keydown="checkCapsLock"
          />
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
          <OtpInput v-model="form.code" :length="6" @complete="handleSubmit" />
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
      </FormKit>

      <!-- Link recupero password -->
      <div v-if="!twoFactorRequired" class="text-center mt-4">
        <RouterLink to="/password-dimenticata" class="link link-hover text-sm text-base-content/60">
          Password dimenticata?
        </RouterLink>
      </div>
    </div>
  </div>
</template>
