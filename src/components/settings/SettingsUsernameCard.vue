<script setup lang="ts">
import { ref } from 'vue'
import { User, Check } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { updateProfile } from '@/api/auth'
import SettingsUsernameForm from '@/components/forms/SettingsUsernameForm.vue'

const authStore = useAuthStore()
const loading = ref(false)
const success = ref(false)
const { allErrors, setErrors, clearErrors } = useErrorList()

async function handleSubmit(data: Record<string, unknown>) {
  loading.value = true
  success.value = false
  clearErrors()
  try {
    const updated = await updateProfile({ username: data.username as string })
    authStore.fillUser(updated)
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2500)
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
      <div class="flex items-center gap-3">
        <div class="bg-secondary/10 text-secondary rounded-xl p-2 shrink-0">
          <User class="w-5 h-5" />
        </div>
        <div>
          <h2 class="font-semibold text-base-content">Username</h2>
          <p class="text-sm text-base-content/50">Modifica il tuo nome utente</p>
        </div>
      </div>

      <SettingsUsernameForm
        :username="authStore.user?.username"
        :errors="allErrors"
        :loading="loading"
        @submit="handleSubmit"
      />
    </div>
  </div>

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div v-if="success" class="toast toast-end z-50">
      <div class="alert alert-success shadow-lg">
        <Check class="w-4 h-4 shrink-0" /> Username aggiornato con successo
      </div>
    </div>
  </Transition>
</template>
