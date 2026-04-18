<script setup lang="ts">
import AppPage from '@/layouts/AppPage.vue'
import SettingsUsernameCard from '@/components/settings/SettingsUsernameCard.vue'
import SettingsPasswordCard from '@/components/settings/SettingsPasswordCard.vue'
import Settings2FACard from '@/components/settings/Settings2FACard.vue'
</script>

<template>
  <AppPage subtitle="Gestisci le impostazioni del tuo account">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl">
      <SettingsUsernameCard />
      <SettingsPasswordCard />
      <Settings2FACard class="xl:col-span-2" />
    </div>
  </AppPage>
</template>
