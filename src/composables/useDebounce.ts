import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 400): Ref<T> {
  const debouncedValue = ref<T>(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(source, (newVal) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })

  return debouncedValue
}
