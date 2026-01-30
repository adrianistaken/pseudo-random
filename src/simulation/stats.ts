import type { SimulationStats } from './types'

/**
 * Computes summary statistics from theoretical probability distribution.
 * @param distribution - Array of probabilities q_N where q_N = P(proc on attempt N)
 */
export function computeStatsFromDistribution(distribution: number[]): SimulationStats {
  const n = distribution.length

  if (n === 0) {
    return { average: 0, median: 0, p90: 0, maxDrought: 0, firstAttemptPercent: 0 }
  }

  // Average (expected value): E[N] = Σ(N × q_N)
  const average = distribution.reduce((acc, prob, idx) => acc + prob * (idx + 1), 0)

  // Median: smallest N where cumulative probability >= 0.5
  let cumulative = 0
  let median = 1
  for (let i = 0; i < n; i++) {
    cumulative += distribution[i] ?? 0
    if (cumulative >= 0.5) {
      median = i + 1
      break
    }
  }

  // 90th percentile: smallest N where cumulative probability >= 0.9
  cumulative = 0
  let p90 = 1
  for (let i = 0; i < n; i++) {
    cumulative += distribution[i] ?? 0
    if (cumulative >= 0.9) {
      p90 = i + 1
      break
    }
  }

  // Max drought: last attempt with non-zero probability
  const maxDrought = n

  // First attempt percentage
  const firstAttemptPercent = (distribution[0] ?? 0) * 100

  return {
    average: Math.round(average * 100) / 100,
    median,
    p90,
    maxDrought,
    firstAttemptPercent: Math.round(firstAttemptPercent * 100) / 100,
  }
}
