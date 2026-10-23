<script setup lang="ts">
import { computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UserPlus, ShieldCheck, ShieldOff, Pencil } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import type { DataColumn } from '@/components/base/dataTable'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import UserModal from '@/components/modals/UserModal.vue'
import UserEditModal from '@/components/modals/UserEditModal.vue'
import { formatDate } from '@/utils/dates'
import { useToast } from '@/composables/useToast'
import { useCrudTable } from '@/composables/useCrudTable'
import { useUserModal } from '@/composables/useUserModal'
import { useUserEditModal } from '@/composables/useUserEditModal'
import { useAuthStore } from '@/stores/auth'
import Users from '@/api/users'
import type { User } from '@/types/user'

const queryClient = useQueryClient()
const { show } = useToast()
const auth = useAuthStore()
const userModal = useUserModal()
const userEditModal = useUserEditModal()

const {
  search,
  statusFilter,
  rows,
  total,
  isLoading,
  isFetching,
  refetch,
  remove,
  restore,
  isMutating: isCrudMutating,
} = useCrudTable({
  api: Users,
  queryKey: 'users',
  messages: { removed: 'Utente eliminato', restored: 'Utente ripristinato' },
  search: {
    excludeKeys: ['deleted_at', 'avatar_url', 'bio'],
    transformers: { created_at: (v) => formatDate(v as string) },
  },
})

const { mutate: toggleAdmin, isPending: isTogglingAdmin } = useMutation({
  mutationFn: ({ id, isAdmin }: { id: number; isAdmin: boolean }) => Users.toggleAdmin(id, isAdmin),
  onSuccess: (_, { isAdmin }) => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    show(isAdmin ? 'Utente promosso ad admin' : 'Privilegi admin rimossi')
  },
  onError: () => show('Operazione non riuscita', 'error'),
})

const isMutating = computed(() => isCrudMutating.value || isTogglingAdmin.value)

const columns: DataColumn<User>[] = [
  { id: 'username', label: 'Utente' },
  { id: 'email', label: 'Email', class: 'hidden md:table-cell' },
  { id: 'country', label: 'Paese', class: 'hidden md:table-cell' },
  { id: 'created_at', label: 'Registrato il', class: 'hidden lg:table-cell' },
  { id: 'actions', class: 'w-28' },
]
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca utente..."
    :total="total"
    :refreshing="isFetching"
    @refresh="refetch()"
  >
    <template #actions>
      <button class="btn btn-secondary btn-sm gap-1" @click="userModal.openCreate()">
        <UserPlus class="w-4 h-4" /> Nuovo utente
      </button>
    </template>

    <template #filters>
      <StatusFilter v-model="statusFilter" />
    </template>

    <BaseDataTable :rows="rows" :columns="columns" :loading="isLoading">
      <!-- Avatar + username + badge admin -->
      <template #cell-username="{ row }">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-8">
              <img v-if="row.avatar_url" :src="row.avatar_url" :alt="row.username" />
              <span v-else class="text-xs">{{ row.username.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div>
            <div class="font-medium flex items-center gap-1">
              {{ row.username }}
              <span v-if="row.is_admin" class="badge badge-warning badge-xs">admin</span>
            </div>
            <div class="text-base-content/40 text-xs md:hidden">{{ row.email }}</div>
          </div>
        </div>
      </template>
      <template #cell-email="{ row }">
        <span class="text-sm text-base-content/70">{{ row.email }}</span>
      </template>
      <template #cell-country="{ row }">
        <span class="text-sm text-base-content/60">{{ row.country ?? '—' }}</span>
      </template>
      <template #cell-created_at="{ row }">
        <span class="text-sm text-base-content/60">{{ formatDate(row.created_at) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-1">
          <!-- Toggle admin (non su se stesso) -->
          <button
            v-if="!row.deleted_at && row.id !== auth.user?.id"
            class="btn btn-ghost btn-xs tooltip"
            :data-tip="row.is_admin ? 'Rimuovi admin' : 'Promuovi ad admin'"
            :aria-label="row.is_admin ? 'Rimuovi admin' : 'Promuovi ad admin'"
            @click="toggleAdmin({ id: row.id, isAdmin: !row.is_admin })"
          >
            <ShieldCheck v-if="!row.is_admin" class="w-4 h-4 text-warning" />
            <ShieldOff v-else class="w-4 h-4 text-base-content/40" />
          </button>

          <button
            v-if="!row.deleted_at"
            class="btn btn-ghost btn-xs btn-square tooltip tooltip-success"
            data-tip="Modifica"
            aria-label="Modifica"
            @click="userEditModal.openEdit(row)"
          >
            <Pencil class="w-3.5 h-3.5 text-success" />
          </button>

          <ActionColumn
            :actions="row.deleted_at ? ['restore'] : row.id !== auth.user?.id ? ['delete'] : []"
            @delete="remove(row.id)"
            @restore="restore(row.id)"
          />
        </div>
      </template>
    </BaseDataTable>
  </AppTable>

  <UserModal
    v-model="userModal.isOpen.value"
    :loading="userModal.loading.value"
    :errors="userModal.allErrors.value"
    @submit="userModal.handleSubmit"
  />

  <UserEditModal
    v-model="userEditModal.isOpen.value"
    :user="userEditModal.editingUser.value"
    :loading="userEditModal.loading.value"
    :errors="userEditModal.allErrors.value"
    @submit="userEditModal.handleSubmit"
  />

  <AppLoading :visible="isMutating" />
</template>
