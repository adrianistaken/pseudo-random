import type { SimulationParams, CombinedResult } from './types'
import { calculateC, prdDistribution, prdAttemptProbabilities } from './prd'
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

  // Determine display buckets (show enough attempts to see the PRD ramp-up)
  const displayBuckets = Math.min(prdResult.maxAttempt + 5, 30)

  // Generate attempt probabilities instead of first-proc distributions
  const trueRngHist = trueRngAttemptProbabilities(p, displayBuckets)
  const prdHist = prdAttemptProbabilities(c, displayBuckets)

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
