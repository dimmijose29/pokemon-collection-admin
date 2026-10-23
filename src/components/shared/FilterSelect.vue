<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronDown, X, Search } from 'lucide-vue-next'

const props = defineProps<{
  options: string[]
  placeholder: string
  multiple?: boolean
}>()

const model = defineModel<string | string[] | null>()

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)

const selectedValues = computed<string[]>(() => {
  if (props.multiple) return (model.value as string[]) ?? []
  const v = model.value as string
  return v ? [v] : []
})

const filteredOptions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.toLowerCase().includes(q))
})

const label = computed(() => {
  if (selectedValues.value.length === 0) return props.placeholder
  if (!props.multiple) return selectedValues.value[0]
  if (selectedValues.value.length === 1) return selectedValues.value[0]
  return `${selectedValues.value.length} selezionati`
})

const hasSelection = computed(() => selectedValues.value.length > 0)

function isSelected(option: string) {
  return selectedValues.value.includes(option)
}

function toggle(option: string) {
  if (props.multiple) {
    const current = [...selectedValues.value]
    const idx = current.indexOf(option)
    if (idx === -1) current.push(option)
    else current.splice(idx, 1)
    model.value = current
  } else {
    model.value = isSelected(option) ? '' : option
    isOpen.value = false
  }
}

function clear() {
  model.value = props.multiple ? [] : ''
}

function openDropdown() {
  isOpen.value = true
  searchQuery.value = ''
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Trigger -->
    <button
      type="button"
      class="btn btn-sm btn-bordered border-base-300 bg-base-100 hover:bg-base-200 gap-1 min-w-[130px] justify-between font-normal"
      :class="hasSelection ? 'text-base-content' : 'text-base-content/50'"
      @click="isOpen ? (isOpen = false) : openDropdown()"
    >
      <span class="truncate max-w-[120px]">{{ label }}</span>
      <div class="flex items-center gap-0.5 shrink-0">
        <X
          v-if="hasSelection"
          class="w-3.5 h-3.5 text-base-content/40 hover:text-base-content"
          @click.stop="clear"
        />
        <ChevronDown
          class="w-3.5 h-3.5 transition-transform duration-150"
          :class="isOpen ? 'rotate-180' : ''"
        />
      </div>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      leave-active-class="transition-all duration-100 ease-in"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-1 z-50 bg-base-100 border border-base-300 rounded-xl shadow-xl min-w-[190px] max-h-72 flex flex-col"
      >
        <!-- Campo ricerca interno -->
        <div class="p-2 border-b border-base-200 shrink-0">
          <label class="flex items-center gap-1.5 bg-base-200 rounded-lg px-2.5 py-1.5">
            <Search class="w-3 h-3 text-base-content/40 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cerca..."
              class="bg-transparent outline-none text-xs w-full text-base-content placeholder:text-base-content/40"
              @click.stop
            />
          </label>
        </div>

        <!-- Lista opzioni -->
        <div class="overflow-y-auto py-1">
          <button
            v-for="option in filteredOptions"
            :key="option"
            type="button"
            class="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-base-200 transition-colors"
            :class="isSelected(option) ? 'text-secondary font-medium' : 'text-base-content'"
            @click="toggle(option)"
          >
            <span
              v-if="multiple"
              class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
              :class="isSelected(option) ? 'bg-secondary border-secondary' : 'border-base-300'"
            >
              <svg
                v-if="isSelected(option)"
                class="w-2.5 h-2.5 text-secondary-content"
                fill="none"
                viewBox="0 0 10 8"
              >
                <path
                  d="M1 4l3 3 5-5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span
              v-else
              class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors"
              :class="isSelected(option) ? 'border-secondary' : 'border-base-300'"
            >
              <span v-if="isSelected(option)" class="w-2 h-2 rounded-full bg-secondary" />
            </span>
            {{ option }}
          </button>

          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-3 text-xs text-base-content/40 text-center"
          >
            Nessun risultato
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
