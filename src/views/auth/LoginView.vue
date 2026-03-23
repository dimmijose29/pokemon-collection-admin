<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const form = ref({
  login: '',
  password: '',
  code: '',
})

const error = ref('')
const twoFactorRequired = ref(false)
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  const payload: any = {
    login: form.value.login.trim(),
    password: form.value.password,
  }

  if (twoFactorRequired.value) {
    payload.code = form.value.code.trim()
  }

  try {
    const res = await auth.login_check(payload)

    if (res.twoFactorRequired) {
      twoFactorRequired.value = true
      loading.value = false
      return
    }

    // Login ok → redirect admin
    router.push('/admin')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Errore durante il login'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
    <div class="card w-full max-w-lg bg-base-100 shadow-2xl">
      <div class="card-body p-8 md:p-10">
        <button class="btn btn-primary">Primary (blu)</button>
        <button class="btn btn-secondary">Secondary (giallo)</button>
        <button class="btn btn-accent">Accent (azzurro Cristallo)</button>
        <button class="btn btn-success">Success (verde Foglia)</button>
        <button class="btn btn-error">Error (rosso Fuoco)</button>
        <button class="btn btn-warning">Warning (arancione)</button>
        <button class="btn btn-neutral">Neutral (grigio)</button>
        <button class="btn btn-info">Info (blu)</button>
        <h1 class="text-5xl font-heading text-theme-color">Titolo Giallo</h1>
        <p class="font-body text-lg">Testo Manrope</p>

        <!-- Titolo grande con font-heading -->
        <h2 class="card-title text-5xl font-heading text-primary justify-center mb-8 tracking-wide">
          Login Admin
        </h2>

        <!-- Errore con alert DaisyUI -->
        <div v-if="error" class="alert alert-error shadow-lg mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-body">{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Campo login unico -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text font-body text-lg">Email o Username</span>
            </label>
            <input
              v-model="form.login"
              type="text"
              placeholder="Username o Email"
              class="input input-bordered input-lg w-full font-body"
              required
              autofocus
            />
          </div>

          <!-- Password -->
          <div class="form-control mb-8">
            <label class="label">
              <span class="label-text font-body text-lg">Password</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered input-lg w-full font-body"
              required
            />
          </div>

          <!-- 2FA condizionale con transizione -->
          <transition name="fade">
            <div v-if="twoFactorRequired" class="form-control mb-8">
              <label class="label">
                <span class="label-text font-body text-lg">Codice 2FA (6 cifre)</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="123456"
                class="input input-bordered input-lg w-full text-center text-3xl tracking-widest font-mono focus:input-primary"
                required
                autofocus
              />
            </div>
          </transition>

          <!-- Bottone -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full text-xl font-heading"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-lg"></span>
            {{ twoFactorRequired ? 'Verifica Codice' : 'Accedi' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
