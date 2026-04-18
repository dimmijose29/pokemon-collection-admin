<script setup lang="ts">
import { ref } from 'vue'
import { Lock, Check } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { updatePassword } from '@/api/auth'
import SettingsPasswordForm from '@/components/forms/SettingsPasswordForm.vue'

const authStore = useAuthStore()
const loading = ref(false)
const success = ref(false)
const { allErrors, setErrors, clearErrors } = useErrorList()

async function handleSubmit(data: Record<string, unknown>) {
  loading.value = true
  success.value = false
  clearErrors()
  try {
    await updatePassword(authStore.user!.id, {
      password: data.new_password as string,
      password_confirmation: data.new_password_confirm as string,
    })
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
          <Lock class="w-5 h-5" />
        </div>
        <div>
          <h2 class="font-semibold text-base-content">Password</h2>
          <p class="text-sm text-base-content/50">Cambia la tua password di accesso</p>
        </div>
      </div>

      <SettingsPasswordForm :errors="allErrors" :loading="loading" @submit="handleSubmit" />
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
        <Check class="w-4 h-4 shrink-0" /> Password aggiornata con successo
      </div>
    </div>
  </Transition>
</template>
