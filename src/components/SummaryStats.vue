<script setup lang="ts">
import type { SimulationStats } from '@/simulation/types'

defineProps<{
  trueRngStats: SimulationStats
  prdStats: SimulationStats
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-text-muted text-xs uppercase tracking-wide">
          <th class="text-left py-2 px-3"></th>
          <th class="text-center py-2 px-3">Average</th>
          <th class="text-center py-2 px-3">Median</th>
          <th class="text-center py-2 px-3">90th %ile</th>
          <th class="text-center py-2 px-3">Max Drought</th>
          <th class="text-center py-2 px-3">1st Attempt</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t border-border">
          <td class="py-3 px-3 flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm bg-chart-rng inline-block"></span>
            <span class="text-text-muted text-xs">True RNG</span>
          </td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ trueRngStats.average }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ trueRngStats.median }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ trueRngStats.p90 }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ trueRngStats.maxDrought }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ trueRngStats.firstAttemptPercent }}%</td>
        </tr>
        <tr class="border-t border-border">
          <td class="py-3 px-3 flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm bg-chart-prd inline-block"></span>
            <span class="text-text-muted text-xs">PRD</span>
          </td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ prdStats.average }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ prdStats.median }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ prdStats.p90 }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ prdStats.maxDrought }}</td>
          <td class="text-center py-3 px-3 font-mono text-text">{{ prdStats.firstAttemptPercent }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
