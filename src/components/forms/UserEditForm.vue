<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, X } from 'lucide-vue-next'
import ErrorAlert from '@/components/utils/ErrorAlert.vue'
import type { User } from '@/types/user'

const props = defineProps<{
  user: User
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [data: FormData | Record<string, unknown>]
}>()

const username = ref(props.user.username)
const isAdmin = ref(props.user.is_admin)
const country = ref(props.user.country ?? '')
const bio = ref(props.user.bio ?? '')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(props.user.avatar_url ?? null)

watch(() => props.user, (u) => {
  username.value = u.username
  isAdmin.value = u.is_admin
  country.value = u.country ?? ''
  bio.value = u.bio ?? ''
  avatarPreview.value = u.avatar_url ?? null
  avatarFile.value = null
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

function clearAvatar() {
  avatarFile.value = null
  avatarPreview.value = props.user.avatar_url ?? null
}

function handleSubmit() {
  if (avatarFile.value) {
    const fd = new FormData()
    fd.append('username', username.value)
    fd.append('is_admin', isAdmin.value ? '1' : '0')
    fd.append('country', country.value)
    fd.append('bio', bio.value)
    fd.append('avatar', avatarFile.value)
    emit('submit', fd)
  } else {
    emit('submit', {
      username: username.value,
      is_admin: isAdmin.value,
      country: country.value || null,
      bio: bio.value || null,
    })
  }
}
</script>

<template>
  <ErrorAlert :errors="errors ?? []" />

  <form id="user-edit-form" class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Avatar -->
    <div class="flex items-center gap-4">
      <div class="avatar placeholder shrink-0">
        <div class="bg-neutral text-neutral-content rounded-full w-16 overflow-hidden">
          <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
          <span v-else class="text-xl">{{ user.username.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1 text-base-content/70">Avatar</label>
        <div class="flex items-center gap-2">
          <label class="btn btn-sm btn-ghost gap-1 cursor-pointer">
            <Upload class="w-3.5 h-3.5" />
            Scegli file
            <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onFileChange" />
          </label>
          <button v-if="avatarFile" type="button" class="btn btn-ghost btn-xs" @click="clearAvatar">
            <X class="w-3.5 h-3.5" /> Annulla
          </button>
          <span v-if="avatarFile" class="text-xs text-base-content/50 truncate max-w-[120px]">
            {{ avatarFile.name }}
          </span>
        </div>
        <p class="text-xs text-base-content/40 mt-1">JPG, PNG, WebP — max 2MB</p>
      </div>
    </div>

    <div class="divider my-2" />

    <!-- Username -->
    <div class="form-control">
      <label class="label py-1">
        <span class="label-text font-medium">Username</span>
      </label>
      <input
        v-model="username"
        type="text"
        class="input input-bordered input-sm w-full"
        required
        maxlength="50"
      />
    </div>

    <!-- Paese -->
    <div class="form-control">
      <label class="label py-1">
        <span class="label-text font-medium">Paese</span>
      </label>
      <input
        v-model="country"
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="Es. Italia"
        maxlength="100"
      />
    </div>

    <!-- Bio -->
    <div class="form-control">
      <label class="label py-1">
        <span class="label-text font-medium">Bio</span>
      </label>
      <textarea
        v-model="bio"
        class="textarea textarea-bordered textarea-sm w-full resize-none"
        rows="3"
        maxlength="1000"
        placeholder="Descrizione breve..."
      />
    </div>

    <!-- Admin -->
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-3 py-1">
        <input v-model="isAdmin" type="checkbox" class="checkbox checkbox-sm checkbox-warning" />
        <span class="label-text font-medium">Amministratore</span>
      </label>
    </div>
  </form>
</template>
