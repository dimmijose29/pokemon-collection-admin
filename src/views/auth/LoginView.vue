<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import type { LoginCredentials } from '@/types/auth'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import { KeyRound, User } from 'lucide-vue-next'
import Pokemon3DCard from '@/components/utils/Pokemon3DCard.vue'

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
  loading.value = true

  const payload: LoginCredentials = {
    login: form.value.login.trim(),
    password: form.value.password,
  }

  if (twoFactorRequired.value) {
    payload.code = form.value.code.trim()
  }

  const res = await auth.attemptLogin(payload)

  if (!res.success) {
    error.value = res.error || 'Errore sconosciuto'
    loading.value = false
    return
  }
  if (res.twoFactorRequired) {
    twoFactorRequired.value = true
    loading.value = false
    return
  }
  // router.push('/admin')
  loading.value = false
  return
  // Login ok → redirect adminading.value = false
}
</script>

<template>
  <div class="hero min-h-screen bg-base-200 px-4 py-12">
    <div class="hero-content max-w-full">
      <div class="grid md:grid-cols-12 gap-12">
        <div v-motion-slide-left class="md:col-start-1 md:col-end-5">
          <div class="card rounded-box grid grow place-items-center min-h-full">
            <div class="card w-full max-w-lg bg-base-100 shadow-2xl">
              <div class="card-body p-8 md:p-10">
                <!-- Titolo grande con font-heading -->
                <img src="/img/logo.png" alt="Logo" class="w-75 mx-auto mb-6" />

                <!-- Errore con alert DaisyUI -->
                <ErrorAlert :errors="error ? [error] : []" />

                <!-- {{ randomCard.name }} -->

                <FormKit
                  type="form"
                  @submit.prevent="handleSubmit"
                  submit-label="Accedi"
                  :submit-attrs="{ style: { display: 'none' } }"
                >
                  <!-- Campo login unico -->
                  <div class="mb-8">
                    <FormKit
                      type="text"
                      name="login"
                      prefix-icon="avatarMan"
                      value=""
                      placeholder="Inserire la username o l'email"
                      input-class="outline-0"
                      v-model="form.login"
                      :validation="'required'"
                      validation-visibility="dirty"
                      :validation-messages="{
                        required: 'E\' obbligatorio inserire la password o la username',
                      }"
                      message-class="text-error font-bold text-sm mt-1"
                    />
                  </div>

                  <!-- Password -->
                  <div class="mb-8">
                    <FormKit
                      type="password"
                      name="password"
                      suffix-icon="password"
                      value=""
                      placeholder="Inserire la password"
                      input-class="outline-0"
                      v-model="form.password"
                      :validation="'required'"
                      validation-visibility="dirty"
                      :validation-messages="{
                        required: 'E\' obbligatorio inserire la password',
                      }"
                      message-class="text-error font-bold text-sm mt-1"
                    />
                  </div>

                  <!-- 2FA condizionale con transizione -->
                  <div v-if="twoFactorRequired" v-motion-pop class="mb-8">
                    <FormKit
                      type="number"
                      name="code"
                      label="Inserire codice 2FA"
                      value=""
                      placeholder=""
                      input-class="outline-0 text-center text-2xl tracking-wide"
                      v-model="form.code"
                      :validation="'required|number|length:6,6'"
                      validation-visibility="dirty"
                      :validation-messages="{
                        required: 'E\' obbligatorio inserire il codice',
                      }"
                      message-class="text-error font-bold text-sm mt-1"
                    />
                  </div>

                  <!-- Bottone -->
                  <button
                    type="submit"
                    class="btn btn-secondary btn-lg w-full text-xl font-heading"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="loading loading-spinner loading-lg"></span>
                    {{ twoFactorRequired ? 'Verifica Codice' : 'Accedi' }}
                  </button>
                </FormKit>
              </div>
            </div>
          </div>
        </div>
        <div class="md:col-start-5 md:col-end-13">
          <div class="card rounded-box grid grow place-items-center">
            <Pokemon3DCard :pokemon-image-url="pokemonImageUrl" />
          </div>
        </div>
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

.login-title {
  /* Colore con sfumatura */
  -webkit-text-stroke: 10px var(--color-black);
  paint-order: stroke fill;
}
</style>
