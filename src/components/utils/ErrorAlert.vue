<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  errors: string[]
}>()

const hasErrors = computed(() => props.errors.length > 0)
</script>

<template>
  <div
    v-if="hasErrors"
    v-motion-pop
    class="alert bg-red-300 text-red-500 border-red-600 mb-6 shake"
  >
    <div class="font-body">
      <ul class="list">
        <li v-for="(msg, index) in errors" :key="index">
          <span class="font-semibold mt-3">{{ msg }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
