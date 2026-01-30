/**
 * Calculates the PRD constant C for a given nominal probability p
 * such that the expected proc rate equals p.
 * Uses binary search: finds C where expectedAttempts(C) = 1/p.
 */
export function calculateC(p: number): number {
  let lo = 0
  let hi = p
  const targetMean = 1 / p

  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2
    const mean = computeExpectedAttempts(mid)
    if (mean > targetMean) {
      lo = mid
    } else {
      hi = mid
    }
  }

  return (lo + hi) / 2
}

/**
 * Computes the expected number of attempts for a given C value.
 * P(proc on attempt n) = min(n*C, 1) * product(1 - min(k*C, 1) for k=1..n-1)
 */
function computeExpectedAttempts(c: number): number {
  let expectedValue = 0
  let cumulativeFail = 1.0
  const maxN = Math.ceil(1 / c) + 100

  for (let n = 1; n <= maxN; n++) {
    const pn = Math.min(n * c, 1.0)
    const prob = cumulativeFail * pn
    expectedValue += n * prob
    cumulativeFail *= (1 - pn)

    if (cumulativeFail < 1e-10) break
  }

  return expectedValue
}

/**
 * Computes the exact theoretical probability distribution for PRD.
 * Returns q_N values where q_N = probability that proc occurs on attempt N.
 * Formula: q_N = S_{N-1} * p_N, where:
 *   - p_N = min(N * C, 1) = probability of proc on attempt N given N-1 failures
 *   - S_N = product of (1 - p_k) for k=1..N = survival probability through N attempts
 */
export function prdDistribution(c: number): {
  distribution: number[]
  maxAttempt: number
} {
  const maxAttempt = Math.ceil(1 / c)
  const distribution: number[] = []
  let survivalProb = 1.0

  for (let n = 1; n <= maxAttempt; n++) {
    const attemptProb = Math.min(n * c, 1.0)
    const procProb = survivalProb * attemptProb
    distribution.push(procProb)
    survivalProb *= (1 - attemptProb)
  }

  return { distribution, maxAttempt }
}

/**
 * Returns the actual proc probability for each attempt number with PRD.
 * p_N = min(N * C, 1) for attempt N
 * This shows the increasing proc chance as attempts continue without proccing.
 */
export function prdAttemptProbabilities(c: number, maxAttempts: number): number[] {
  const probabilities: number[] = []

  for (let n = 1; n <= maxAttempts; n++) {
    const attemptProb = Math.min(n * c, 1.0)
    probabilities.push(attemptProb)
  }

  return probabilities
}

/**
 * Simulates one trial of PRD.
 * Probability starts at C and increments by C each failure, capped at 1.
 * Returns the 1-indexed attempt number on which the proc occurred.
 */
export function simulatePrdTrial(c: number): number {
  let attempt = 0
  while (true) {
    attempt++
    const probability = Math.min(attempt * c, 1.0)
    if (Math.random() < probability) {
      return attempt
    }
  }
}
