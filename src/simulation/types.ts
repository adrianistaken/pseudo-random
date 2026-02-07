export interface SimulationParams {
  procChance: number // 0-100 (percentage)
  trials: number // 1000, 10000, or 100000
}

export interface SimulationStats {
  average: number
  median: number
  p90: number
  maxDrought: number
  firstAttemptPercent: number
}

export interface CombinedResult {
  trueRng: { histogram: number[]; stats: SimulationStats }
  prd: { histogram: number[]; stats: SimulationStats }
  /** Number of meaningful buckets to display (dynamic, <= MAX_BUCKET) */
  displayBuckets: number
}

export type ProgressCallback = (progress: number) => void

export interface Preset {
  label: string
  levels: number[]       // proc chance at each level, e.g. [25] or [10, 15, 20, 25]
  description: string
  image?: string
  category?: 'item' | 'spell'
}
