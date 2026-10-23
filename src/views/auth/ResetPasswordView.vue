<script setup lang="ts">
import AuthPage from '@/layouts/AuthPage.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
</script>

<template>
  <AuthPage :two-columns="false">
    <ResetPasswordForm />
  </AuthPage>
</template>
