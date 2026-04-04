<script setup lang="ts">
import AuthPage from '@/layouts/AuthPage.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
</script>

<template>
  <AuthPage :two-columns="false">
    <ForgotPasswordForm />
  </AuthPage>
</template>
