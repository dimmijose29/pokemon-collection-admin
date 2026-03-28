import { ref } from 'vue'

export function useCapsLock() {
  const capsLockOn = ref(false)

  function checkCapsLock(event: KeyboardEvent) {
    capsLockOn.value = event.getModifierState('CapsLock')
  }

  return { capsLockOn, checkCapsLock }
}
