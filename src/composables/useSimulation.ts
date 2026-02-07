import { ref, watch, onMounted } from 'vue'
import type { CombinedResult, Preset } from '@/simulation/types'
import { computeDistributions } from '@/simulation/runner'

// ─── PRESETS ────────────────────────────────────────────────────────
// Adjust level values here to match actual in-game percentages.
// Single-element arrays = no level selection shown.
// Multi-element arrays = level pips shown (index 0 = level 1, etc.)
export const PRESETS: Preset[] = [
  // ── Items (single level) ──
  { label: 'Skull Basher',  levels: [25],     description: 'Bash',             image: '/images/items/Skull_Basher_Bash_abilityicon_dota2_wikiasset.png',              category: 'item' },
  { label: 'Maelstrom',     levels: [25],     description: 'Chain Lightning',   image: '/images/items/Maelstrom_Chain_Lightning_abilityicon_dota2_wikiasset.png',      category: 'item' },
  { label: 'Mjollnir',      levels: [25],     description: 'Static Charge',     image: '/images/items/Mjollnir_Static_Charge_abilityicon_dota2_wikiasset.png',         category: 'item' },
  { label: 'Crystalys',     levels: [30],     description: 'Critical Strike',   image: '/images/items/Crystalys_Critical_Strike_abilityicon_dota2_wikiasset.png',      category: 'item' },
  { label: 'Daedalus',      levels: [30],     description: 'Critical Strike',   image: '/images/items/Daedalus_Critical_Strike_abilityicon_dota2_wikiasset.png',       category: 'item' },
  { label: 'Butterfly',     levels: [35],     description: 'Evasion',           image: '/images/items/Butterfly_Flutter_abilityicon_dota2_wikiasset.png',              category: 'item' },

  // ── Spells (4 levels) ──
  { label: 'Coup de Grace',      levels: [10, 13, 15, 17],  description: 'Phantom Assassin',  image: '/images/spells/Phantom_Assassin_Coup_de_Grace_abilityicon_dota2_gameasset.png',    category: 'spell' },
  { label: 'Greater Bash',       levels: [11, 14, 17, 20],  description: 'Spirit Breaker',    image: '/images/spells/Spirit_Breaker_Greater_Bash_abilityicon_dota2_gameasset.png',        category: 'spell' },
  { label: 'Time Lock',          levels: [19, 22, 25, 28],  description: 'Faceless Void',     image: '/images/spells/Faceless_Void_Time_Lock_abilityicon_dota2_gameasset.png',            category: 'spell' },
  { label: 'Moment of Courage',  levels: [19, 22, 25, 28],  description: 'Legion Commander',  image: '/images/spells/Legion_Commander_Moment_of_Courage_abilityicon_dota2_gameasset.png', category: 'spell' },
  { label: 'Headshot',           levels: [28, 32, 36, 40],  description: 'Sniper',            image: '/images/spells/Sniper_Headshot_abilityicon_dota2_gameasset.png',                    category: 'spell' },
  { label: 'Juxtapose',          levels: [28, 32, 36, 40],  description: 'Phantom Lancer',    image: '/images/spells/Phantom_Lancer_Juxtapose_abilityicon_dota2_gameasset.png',           category: 'spell' },
  { label: 'Smoke Screen',       levels: [21, 24, 27, 30],  description: 'Riki',              image: '/images/spells/Riki_Smoke_Screen_abilityicon_dota2_gameasset.png',                  category: 'spell' },
]

export const TRIAL_OPTIONS = [1_000, 10_000, 100_000] as const

export function useSimulation() {
  const procChance = ref(25)
  const trials = ref<number>(10_000) // Kept for UI compatibility, but not used in computation
  const result = ref<CombinedResult | null>(null)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function applyPreset(value: number) {
    procChance.value = value
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
