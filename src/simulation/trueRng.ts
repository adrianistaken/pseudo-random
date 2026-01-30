/**
 * Computes the exact theoretical probability distribution for True RNG.
 * Returns q_N values where q_N = probability that proc occurs on attempt N.
 * Formula: q_N = (1-p)^(N-1) * p (geometric distribution)
 * Must specify maxAttempts since True RNG has infinite tail.
 */
export function trueRngDistribution(p: number, maxAttempts: number): number[] {
  const distribution: number[] = []
  const failProb = 1 - p

  for (let n = 1; n <= maxAttempts; n++) {
    const procProb = Math.pow(failProb, n - 1) * p
    distribution.push(procProb)
  }

  return distribution
}

/**
 * Returns the actual proc probability for each attempt number with True RNG.
 * p_N = p (constant) for all attempts
 * This shows that each attempt has the same independent probability.
 */
export function trueRngAttemptProbabilities(p: number, maxAttempts: number): number[] {
  const probabilities: number[] = []

  for (let n = 1; n <= maxAttempts; n++) {
    probabilities.push(p)
  }

  return probabilities
}

/**
 * Simulates one trial of True RNG.
 * Each attempt is an independent Bernoulli trial with probability p.
 * Returns the 1-indexed attempt number on which the proc occurred.
 */
export function simulateTrueRngTrial(p: number): number {
  let attempt = 0
  while (true) {
    attempt++
    if (Math.random() < p) {
      return attempt
    }
  }
}
