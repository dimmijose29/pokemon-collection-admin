<script setup lang="ts">
import { ref } from 'vue'
import { forgotPassword } from '@/api/auth'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import { ArrowLeft, Mail } from 'lucide-vue-next'

const email = ref('')
const errors = ref<string[]>([])
const loading = ref(false)
const emailSent = ref(false)

async function handleSubmit() {
  loading.value = true
  errors.value = []

  try {
    await forgotPassword(email.value.trim())
    emailSent.value = true
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } }
      }
      if (axiosErr.response?.data?.errors) {
        errors.value = Object.values(axiosErr.response.data.errors).flat()
      } else if (axiosErr.response?.data?.message) {
        errors.value = [axiosErr.response.data.message]
      } else {
        errors.value = ["Errore durante l'invio"]
      }
    } else {
      errors.value = ['Errore di connessione']
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-2xl">
    <div class="card-body p-8">
      <!-- Stato: email inviata -->
      <template v-if="emailSent">
        <div v-motion-pop class="text-center py-4">
          <Mail class="w-16 h-16 mx-auto text-success mb-4" />
          <h2 class="text-2xl font-heading mb-2">Email inviata!</h2>
          <p class="text-base-content/60 mb-6">
            Se l'indirizzo è registrato, riceverai a breve un link per reimpostare la password.
          </p>
          <RouterLink to="/" class="btn btn-secondary btn-outline">
            <ArrowLeft class="w-4 h-4" />
            Torna al login
          </RouterLink>
        </div>
      </template>

      <!-- Stato: form -->
      <template v-else>
        <h2 class="text-2xl font-heading text-center mb-2">Recupera password</h2>
        <p class="text-sm text-base-content/60 text-center mb-6">
          Inserisci la tua email e ti invieremo un link per reimpostare la password.
        </p>

        <ErrorAlert :errors="errors" />

        <FormKit
          type="form"
          @submit="handleSubmit"
          submit-label="Invia"
          :submit-attrs="{ style: { display: 'none' } }"
        >
          <div class="mb-5">
            <FormKit
              type="email"
              name="email"
              prefix-icon="email"
              placeholder="La tua email"
              outer-class="max-w-full"
              input-class="outline-0 input-secondary"
              v-model="email"
              validation="required|email"
              validation-visibility="dirty"
              :validation-messages="{
                required: 'Inserisci la tua email',
                email: 'Inserisci un\'email valida',
              }"
              message-class="text-error text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            class="btn btn-secondary w-full text-lg font-heading"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Invia link
          </button>
        </FormKit>

        <div class="text-center mt-4">
          <RouterLink to="/" class="link link-hover text-sm text-base-content/60">
            <ArrowLeft class="w-3 h-3 inline-block mr-1" />
            Torna al login
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>
