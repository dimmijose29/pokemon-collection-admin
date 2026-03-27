<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  errors: string[]
}>()

const hasErrors = computed(() => props.errors.length > 0)
</script>

<template>
  <div v-if="hasErrors" v-motion-pop class="alert alert-error shadow-lg mb-6">
    <div class="font-body">
      <ul class="list">
        <li v-for="(msg, index) in errors" :key="index">
          <X class="shrink-0 h-5 w-5 inline-block" />
          <span class="font-semibold mt-3">{{ msg }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
