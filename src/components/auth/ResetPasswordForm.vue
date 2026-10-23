<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { passwordField, requiredString, validationMessages } from '@/validation/schemas'
import BaseInput from '@/components/base/BaseInput.vue'
import { resetPassword } from '@/api/auth'
import { useErrorList } from '@/composables/useErrorList'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import { ArrowLeft, CircleCheck } from 'lucide-vue-next'

// Token ed email arrivano dal link nell'email di recupero
const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const linkValid = computed(() => !!token.value && !!email.value)

const { allErrors, setErrors, clearErrors } = useErrorList()
const loading = ref(false)
const done = ref(false)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z
      .object({
        password: passwordField(8, 'Campo obbligatorio'),
        password_confirmation: requiredString('Campo obbligatorio'),
      })
      .refine((v) => v.password === v.password_confirmation, {
        message: validationMessages.confirm,
        path: ['password_confirmation'],
      }),
  ),
  initialValues: { password: '', password_confirmation: '' },
})

const onSubmit = handleSubmit(async (data) => {
  loading.value = true
  clearErrors()
  try {
    await resetPassword({ token: token.value, email: email.value, ...data })
    done.value = true
  } catch (e) {
    setErrors(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="card bg-base-100 shadow-2xl">
    <div class="card-body p-8">
      <!-- Stato: password reimpostata -->
      <template v-if="done">
        <div v-motion-pop class="text-center py-4">
          <CircleCheck class="w-16 h-16 mx-auto text-success mb-4" />
          <h2 class="text-2xl font-heading mb-2">Password reimpostata</h2>
          <p class="text-base-content/60 mb-6">Ora puoi accedere con la nuova password.</p>
          <RouterLink to="/" class="btn btn-secondary btn-outline">
            <ArrowLeft class="w-4 h-4" />
            Vai al login
          </RouterLink>
        </div>
      </template>

      <!-- Stato: link incompleto -->
      <template v-else-if="!linkValid">
        <div class="text-center py-4">
          <h2 class="text-2xl font-heading mb-2">Link non valido</h2>
          <p class="text-base-content/60 mb-6">
            Il link di reset è incompleto. Richiedine uno nuovo.
          </p>
          <RouterLink to="/password-dimenticata" class="btn btn-secondary btn-outline">
            Richiedi un nuovo link
          </RouterLink>
        </div>
      </template>

      <!-- Stato: form -->
      <template v-else>
        <h2 class="text-2xl font-heading text-center mb-2">Nuova password</h2>
        <p class="text-sm text-base-content/60 text-center mb-6">
          Scegli una nuova password per <strong>{{ email }}</strong
          >.
        </p>

        <ErrorAlert :errors="allErrors" />

        <form novalidate @submit="onSubmit">
          <BaseInput
            name="password"
            type="password"
            label="Nuova password"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
          <BaseInput
            name="password_confirmation"
            type="password"
            label="Conferma password"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />

          <button
            type="submit"
            class="btn btn-secondary w-full text-lg font-heading mt-2"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Reimposta password
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
