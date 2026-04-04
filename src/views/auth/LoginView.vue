<script setup lang="ts">
import AuthPage from '@/layouts/AuthPage.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import Pokemon3DCard from '@/components/utils/Pokemon3DCard.vue'
</script>

<template>
  <AuthPage :two-columns="true">
    <LoginForm />

    <template #sidebar>
      <Pokemon3DCard />
    </template>
  </AuthPage>
</template>
