<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import type { LoginCredentials } from '@/types/auth'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'

const auth = useAuth()
const router = useRouter()

const form = ref({
  login: '',
  password: '',
  code: '',
})

const errors = ref<string[]>([])
const twoFactorRequired = ref(false)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  errors.value = []

  const payload: LoginCredentials = {
    login: form.value.login.trim(),
    password: form.value.password,
  }

  if (twoFactorRequired.value) {
    payload.code = form.value.code.trim()
  }

  const res = await auth.attemptLogin(payload)

  if (!res.success && !res.twoFactorRequired) {
    if (Array.isArray(res.error)) {
      errors.value = res.error
    } else if (res.error) {
      errors.value = [res.error]
    } else {
      errors.value = ['Errore durante il login']
    }
    loading.value = false
    return
  }

  if (res.twoFactorRequired) {
    twoFactorRequired.value = true
    loading.value = false
    return
  }

  loading.value = false
  router.push({ name: 'home' })
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
        <div class="mb-5">
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
            :validation-messages="{
              required: 'Inserisci username o email',
            }"
            message-class="text-error text-sm mt-1"
          />
        </div>

        <!-- Password -->
        <div class="mb-5">
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
            :validation-messages="{
              required: 'Inserisci la password',
            }"
            message-class="text-error text-sm mt-1"
          />
        </div>

        <!-- 2FA (condizionale) -->
        <div v-if="twoFactorRequired" v-motion-pop class="mb-5">
          <FormKit
            type="number"
            name="code"
            label="Codice 2FA"
            placeholder="000000"
            input-class="outline-0 w-full text-center text-2xl tracking-widest"
            v-model="form.code"
            validation="required|number|length:6,6"
            validation-visibility="dirty"
            :validation-messages="{
              required: 'Inserisci il codice 2FA',
            }"
            message-class="text-error text-sm mt-1"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-secondary w-full text-lg font-heading"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ twoFactorRequired ? 'Verifica Codice' : 'Accedi' }}
        </button>
      </FormKit>

      <!-- Link recupero password -->
      <div class="text-center mt-4">
        <RouterLink to="/password-dimenticata" class="link link-hover text-sm text-base-content/60">
          Password dimenticata?
        </RouterLink>
      </div>
    </div>
  </div>
</template>
