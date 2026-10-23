<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { UserPlus, ShieldCheck, ShieldOff, Pencil } from 'lucide-vue-next'
import AppTable from '@/components/app/AppTable.vue'
import ActionColumn from '@/components/shared/ActionColumn.vue'
import StatusFilter from '@/components/shared/StatusFilter.vue'
import type { StatusFilterValue } from '@/components/shared/StatusFilter.vue'
import SortableHeader from '@/components/shared/SortableHeader.vue'
import type { SortState } from '@/components/shared/SortableHeader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import UserModal from '@/components/modals/UserModal.vue'
import UserEditModal from '@/components/modals/UserEditModal.vue'
import { formatDate } from '@/utils/dates'
import { filterBySearch } from '@/utils/search'
import { useToast } from '@/composables/useToast'
import { useUserModal } from '@/composables/useUserModal'
import { useUserEditModal } from '@/composables/useUserEditModal'
import { useAuthStore } from '@/stores/auth'
import Users from '@/api/users'

const queryClient = useQueryClient()
const { show } = useToast()
const auth = useAuthStore()
const userModal = useUserModal()
const userEditModal = useUserEditModal()

const search = ref('')
const statusFilter = ref<StatusFilterValue>('active')
const sort = ref<SortState | null>(null)

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: () => Users.get({ withTrashed: true }),
  staleTime: Infinity,
  placeholderData: (prev) => prev,
})

const allUsers = computed(() => data.value ?? [])

const users = computed(() => {
  let filtered = allUsers.value

  if (statusFilter.value === 'active') {
    filtered = filtered.filter((u) => !u.deleted_at)
  } else if (statusFilter.value === 'deleted') {
    filtered = filtered.filter((u) => !!u.deleted_at)
  }

  return filterBySearch(filtered, search.value, {
    excludeKeys: ['deleted_at', 'avatar_url', 'bio'],
    transformers: {
      created_at: (v) => formatDate(v as string),
    },
  })
})

const total = computed(() => users.value.length)

const { mutate: remove, isPending: isRemoving } = useMutation({
  mutationFn: (id: number) => Users.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    show('Utente eliminato', 'error')
  },
})

const { mutate: restore, isPending: isRestoring } = useMutation({
  mutationFn: (id: number) => Users.restore(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    show('Utente ripristinato')
  },
})

const { mutate: toggleAdmin, isPending: isTogglingAdmin } = useMutation({
  mutationFn: ({ id, isAdmin }: { id: number; isAdmin: boolean }) => Users.toggleAdmin(id, isAdmin),
  onSuccess: (_, { isAdmin }) => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    show(isAdmin ? 'Utente promosso ad admin' : 'Privilegi admin rimossi')
  },
})

const isMutating = computed(() => isRemoving.value || isRestoring.value || isTogglingAdmin.value)

const sortedUsers = computed(() => {
  if (!sort.value) return users.value
  const { field, direction } = sort.value
  const mult = direction === 'asc' ? 1 : -1
  return [...users.value].sort((a, b) => {
    if (field === 'created_at')
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult
    return (
      String(a[field as keyof typeof a] ?? '').localeCompare(
        String(b[field as keyof typeof b] ?? ''),
      ) * mult
    )
  })
})
</script>

<template>
  <AppTable
    v-model:search="search"
    search-placeholder="Cerca utente..."
    :total="total"
    :loading="isLoading || isFetching"
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

    <template #head>
      <tr>
        <SortableHeader
          field="username"
          label="Utente"
          :model-value="sort"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="email"
          label="Email"
          :model-value="sort"
          class="hidden md:table-cell"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="country"
          label="Paese"
          :model-value="sort"
          class="hidden md:table-cell"
          @update:model-value="sort = $event"
        />
        <SortableHeader
          field="created_at"
          label="Registrato il"
          :model-value="sort"
          class="hidden lg:table-cell"
          @update:model-value="sort = $event"
        />
        <th class="w-28"></th>
      </tr>
    </template>

    <template #body>
      <tr v-for="user in sortedUsers" :key="user.id" class="hover">
        <!-- Avatar + username + badge admin -->
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-8">
                <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.username" />
                <span v-else class="text-xs">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div>
              <div class="font-medium flex items-center gap-1">
                {{ user.username }}
                <span v-if="user.is_admin" class="badge badge-warning badge-xs">admin</span>
              </div>
              <div class="text-base-content/40 text-xs md:hidden">{{ user.email }}</div>
            </div>
          </div>
        </td>

        <!-- Email -->
        <td class="hidden md:table-cell text-sm text-base-content/70">{{ user.email }}</td>

        <!-- Paese -->
        <td class="hidden md:table-cell text-sm text-base-content/60">{{ user.country ?? '—' }}</td>

        <!-- Data registrazione -->
        <td class="hidden lg:table-cell text-sm text-base-content/60">
          {{ formatDate(user.created_at) }}
        </td>

        <!-- Azioni -->
        <td>
          <div class="flex items-center gap-1">
            <!-- Toggle admin (non su se stesso) -->
            <button
              v-if="!user.deleted_at && user.id !== auth.user?.id"
              class="btn btn-ghost btn-xs tooltip"
              :data-tip="user.is_admin ? 'Rimuovi admin' : 'Promuovi ad admin'"
              @click="toggleAdmin({ id: user.id, isAdmin: !user.is_admin })"
            >
              <ShieldCheck v-if="!user.is_admin" class="w-4 h-4 text-warning" />
              <ShieldOff v-else class="w-4 h-4 text-base-content/40" />
            </button>

            <!-- Modifica -->
            <button
              v-if="!user.deleted_at"
              class="btn btn-ghost btn-xs btn-square tooltip tooltip-success"
              data-tip="Modifica"
              @click="userEditModal.openEdit(user)"
            >
              <Pencil class="w-3.5 h-3.5 text-success" />
            </button>

            <ActionColumn
              :actions="user.deleted_at ? ['restore'] : user.id !== auth.user?.id ? ['delete'] : []"
              @delete="remove(user.id)"
              @restore="restore(user.id)"
            />
          </div>
        </td>
      </tr>
    </template>
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
