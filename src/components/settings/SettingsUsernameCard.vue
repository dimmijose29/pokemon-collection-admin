<script setup lang="ts">
import { ref } from 'vue'
import { User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useErrorList } from '@/composables/useErrorList'
import { useToast } from '@/composables/useToast'
import { updateProfile } from '@/api/auth'
import SettingsUsernameForm from '@/components/forms/SettingsUsernameForm.vue'

const authStore = useAuthStore()
const loading = ref(false)
const { allErrors, setErrors, clearErrors } = useErrorList()
const { show } = useToast()

async function handleSubmit(data: Record<string, unknown>) {
  loading.value = true
  clearErrors()
  try {
    const updated = await updateProfile({ username: data.username as string })
    authStore.fillUser(updated)
    show('Username aggiornato con successo')
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
</template>
