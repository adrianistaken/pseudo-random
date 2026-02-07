import type { SimulationParams, CombinedResult } from './types'
import { calculateC, prdDistribution } from './prd'
import { trueRngDistribution, trueRngAttemptProbabilities } from './trueRng'
import { computeStatsFromDistribution } from './stats'

/**
 * Computes theoretical distributions for both True RNG and PRD.
 * No Monte Carlo simulation - pure mathematical calculation.
 * Returns exact probability distributions instantly.
 */
export function computeDistributions(params: SimulationParams): CombinedResult {
  const p = params.procChance / 100

  // Calculate PRD constant
  const c = calculateC(p)
  const prdResult = prdDistribution(c)

  // Show ~3 full PRD cycles so the sawtooth reset pattern is visible
  const cycleLength = prdResult.maxAttempt
  const displayBuckets = Math.min(cycleLength * 3, 30)

  // Generate attempt probabilities with PRD cycle wrapping
  const trueRngHist = trueRngAttemptProbabilities(p, displayBuckets)
  const prdHist: number[] = []
  for (let n = 1; n <= displayBuckets; n++) {
    const cyclePos = ((n - 1) % cycleLength) + 1
    prdHist.push(Math.min(cyclePos * c, 1.0))
  }

  // Compute stats from theoretical first-proc distributions (for mean/variance if needed)
  const trueRngDistForStats = trueRngDistribution(p, displayBuckets)
  const trueRngStats = computeStatsFromDistribution(trueRngDistForStats)
  const prdStats = computeStatsFromDistribution(prdResult.distribution)

  return {
    trueRng: { histogram: trueRngHist, stats: trueRngStats },
    prd: { histogram: prdHist, stats: prdStats },
    displayBuckets,
  }
}
