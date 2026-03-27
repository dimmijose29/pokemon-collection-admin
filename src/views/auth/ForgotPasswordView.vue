<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
</script>

<template>
  <AuthLayout :two-columns="false">
    <ForgotPasswordForm />
  </AuthLayout>
</template>
