import { ref, watch, onMounted } from 'vue'
import type { CombinedResult, Preset } from '@/simulation/types'
import { computeDistributions } from '@/simulation/runner'

export const PRESETS: Preset[] = [
  { label: 'Roshan Bash', procChance: 15, description: '15% proc' },
  { label: 'Maelstrom', procChance: 25, description: '25% proc' },
  { label: 'Blade Dance', procChance: 35, description: '35% proc' },
]

export const TRIAL_OPTIONS = [1_000, 10_000, 100_000] as const

export function useSimulation() {
  const procChance = ref(25)
  const trials = ref<number>(10_000) // Kept for UI compatibility, but not used in computation
  const result = ref<CombinedResult | null>(null)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function applyPreset(preset: Preset) {
    procChance.value = preset.procChance
  }

  function compute() {
    if (procChance.value < 1 || procChance.value > 99) {
      error.value = 'Proc chance must be between 1% and 99%'
      return
    }

    error.value = null

    try {
      result.value = computeDistributions({
        procChance: procChance.value,
        trials: trials.value,
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Calculation failed'
    }
  }

  watch([procChance], () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      compute()
    }, 300)
  })

  onMounted(() => {
    compute()
  })

  return {
    procChance,
    trials,
    result,
    error,
    applyPreset,
  }
}
