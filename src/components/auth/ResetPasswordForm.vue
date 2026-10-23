<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
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

async function handleSubmit(data: Record<string, unknown>) {
  loading.value = true
  clearErrors()
  try {
    await resetPassword({
      token: token.value,
      email: email.value,
      password: data.password as string,
      password_confirmation: data.password_confirmation as string,
    })
    done.value = true
  } catch (e) {
    setErrors(e)
  } finally {
    loading.value = false
  }
}
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
          Scegli una nuova password per <strong>{{ email }}</strong>.
        </p>

        <ErrorAlert :errors="allErrors" />

        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <FormKit
            type="password"
            name="password"
            label="Nuova password"
            placeholder="••••••••"
            autocomplete="new-password"
            validation="required|length:8"
            validation-visibility="dirty"
            :validation-messages="{
              required: 'Campo obbligatorio',
              length: 'Minimo 8 caratteri',
            }"
          />
          <FormKit
            type="password"
            name="password_confirmation"
            label="Conferma password"
            placeholder="••••••••"
            autocomplete="new-password"
            validation="required|confirm:password"
            validation-visibility="dirty"
            :validation-messages="{
              required: 'Campo obbligatorio',
              confirm: 'Le password non coincidono',
            }"
          />

          <button
            type="submit"
            class="btn btn-secondary w-full text-lg font-heading mt-2"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Reimposta password
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
