<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import Pokemon3DCard from '@/components/utils/Pokemon3DCard.vue'
</script>

<template>
  <AuthLayout :two-columns="true">
    <LoginForm />

    <template #sidebar>
      <Pokemon3DCard />
    </template>
  </AuthLayout>
</template>
