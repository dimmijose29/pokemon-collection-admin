<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { forgotPassword } from '@/api/auth'
import { useErrorList } from '@/composables/useErrorList'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { emailField } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import { ArrowLeft, Mail } from 'lucide-vue-next'

const { allErrors, setErrors, clearErrors } = useErrorList()
const loading = ref(false)
const emailSent = ref(false)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(z.object({ email: emailField('Inserisci la tua email') })),
  initialValues: { email: '' },
})

const onSubmit = handleSubmit(async ({ email }) => {
  loading.value = true
  clearErrors()
  try {
    await forgotPassword(email)
    emailSent.value = true
  } catch (err) {
    setErrors(err)
  } finally {
    loading.value = false
  }
})
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

        <ErrorAlert :errors="allErrors" />

        <form novalidate @submit="onSubmit">
          <div class="mb-2">
            <BaseInput name="email" type="email" placeholder="La tua email" autocomplete="email">
              <template #prefix><Mail class="w-4 h-4 opacity-50" /></template>
            </BaseInput>
          </div>

          <button
            type="submit"
            class="btn btn-secondary w-full text-lg font-heading"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Invia link
          </button>
        </form>

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
