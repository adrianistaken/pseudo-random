import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useAnimatedNumber(source: Ref<number>, duration = 350) {
  const display = ref(source.value)
  let frameId: number | null = null

  function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 3)
  }

  watch(source, (to, from) => {
    if (frameId) cancelAnimationFrame(frameId)
    const startTime = performance.now()
    const diff = to - from

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      display.value = from + diff * easeOut(progress)
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        display.value = to
        frameId = null
      }
    }

    frameId = requestAnimationFrame(tick)
  })

  onUnmounted(() => {
    if (frameId) cancelAnimationFrame(frameId)
  })

  return display
}
