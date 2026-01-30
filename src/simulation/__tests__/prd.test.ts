import { describe, it, expect } from 'vitest'
import { calculateC, prdDistribution } from '../prd'

describe('PRD Calculator - Liquipedia Verification', () => {
  const LIQUIPEDIA_VALUES = [
    { nominal: 0.05, expectedC: 0.003801658303553139 },
    { nominal: 0.10, expectedC: 0.014745844781072676 },
    { nominal: 0.15, expectedC: 0.032220914373087675 },
    { nominal: 0.20, expectedC: 0.05570404294978185 },
    { nominal: 0.25, expectedC: 0.08474409185231699 },
    { nominal: 0.30, expectedC: 0.11894919272540399 },
    { nominal: 0.35, expectedC: 0.15798309812574708 },
    { nominal: 0.40, expectedC: 0.20154741360775402 },
    { nominal: 0.45, expectedC: 0.24930699844401632 },
    { nominal: 0.50, expectedC: 0.3021030253487420 },
  ]

  LIQUIPEDIA_VALUES.forEach(({ nominal, expectedC }) => {
    it(`should match Liquipedia C value for ${nominal * 100}%`, () => {
      const computed = calculateC(nominal)
      expect(Math.abs(computed - expectedC)).toBeLessThan(1e-10)
    })
  })

  it('should compute correct guaranteed-by attempt', () => {
    const c = calculateC(0.25)
    const maxAttempt = Math.ceil(1 / c)
    expect(maxAttempt).toBe(12) // For 25%, guaranteed by attempt 12
  })

  it('should work for arbitrary values', () => {
    const testCases = [0.17, 0.123, 0.777, 0.42]
    testCases.forEach((p) => {
      const c = calculateC(p)
      const { distribution } = prdDistribution(c)

      // Verify distribution sums to ~1
      const sum = distribution.reduce((a, b) => a + b, 0)
      expect(Math.abs(sum - 1)).toBeLessThan(1e-10)

      // Verify expected value = 1/p
      const expectedAttempts = distribution.reduce(
        (acc, prob, idx) => acc + prob * (idx + 1),
        0,
      )
      expect(Math.abs(1 / expectedAttempts - p)).toBeLessThan(1e-10)
    })
  })
})
