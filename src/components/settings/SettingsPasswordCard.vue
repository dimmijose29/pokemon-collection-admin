<script setup lang="ts">
import { ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import { updatePassword } from '@/api/auth'
import SettingsPasswordForm from '@/components/forms/SettingsPasswordForm.vue'

const authStore = useAuthStore()
const loading = ref(false)
const { allErrors, setErrors, clearErrors } = useErrorList()
const { show } = useToast()

async function handleSubmit(data: Record<string, unknown>) {
  loading.value = true
  clearErrors()
  try {
    await updatePassword(authStore.user!.id, {
      password: data.new_password as string,
      password_confirmation: data.new_password_confirm as string,
    })
    show('Password aggiornata con successo')
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
</template>
