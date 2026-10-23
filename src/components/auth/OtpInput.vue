<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  length?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}>()

const digits = ref<string[]>(Array(props.length ?? 6).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const len = props.length ?? 6

// Sincronizza verso fuori
watch(
  digits,
  (val) => {
    const code = val.join('')
    emit('update:modelValue', code)
    if (code.length === len && val.every((d) => d !== '')) {
      emit('complete', code)
    }
  },
  { deep: true },
)

function onInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(-1) // solo cifre, ultimo carattere
  digits.value[index] = val

  if (val && index < len - 1) {
    nextTick(() => inputs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, e: KeyboardEvent) {
  // Blocca tutto tranne: cifre, Backspace, Delete, Tab, ArrowLeft, ArrowRight
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight']
  if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
    e.preventDefault()
    return
  }

  if (e.key === 'Backspace') {
    if (digits.value[index]) {
      digits.value[index] = ''
    } else if (index > 0) {
      digits.value[index - 1] = ''
      nextTick(() => inputs.value[index - 1]?.focus())
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1]?.focus()
  } else if (e.key === 'ArrowRight' && index < len - 1) {
    inputs.value[index + 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, len) ?? ''
  if (!pasted) return

  pasted.split('').forEach((char, i) => {
    digits.value[i] = char
  })

  const nextEmpty = pasted.length < len ? pasted.length : len - 1
  nextTick(() => inputs.value[nextEmpty]?.focus())
}

function setInputRef(el: Element | null, index: number) {
  if (el) inputs.value[index] = el as HTMLInputElement
}
</script>

<template>
  <div class="flex gap-2 justify-center">
    <input
      v-for="(_, index) in digits"
      :key="index"
      :ref="(el) => setInputRef(el as Element | null, index)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :aria-label="`Cifra ${index + 1} di ${len}`"
      :value="digits[index]"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste"
      class="w-11 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-base-100 border-base-300 focus:border-secondary focus:outline-none transition-colors duration-150 caret-transparent select-none"
    />
  </div>
</template>
