<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { CHART_COLORS, ANIMATION_CONFIG, generateLabels } from '@/chartConfig'

const MAX_BUCKET = 30

const props = defineProps<{
  trueRngHistogram: number[] // Attempt probabilities (0-1) for each attempt
  prdHistogram: number[] // Attempt probabilities (0-1) for each attempt
  displayBuckets: number
  prdConstant: number // C value
  procChance: number // Base proc chance
}>()

const labels = computed(() => generateLabels(props.displayBuckets, MAX_BUCKET))

// Convert probability (0-1) to percentage (0-100)
function toPercent(histogram: number[], buckets: number): number[] {
  return histogram.slice(0, buckets).map((prob) => prob * 100)
}

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: labels.value,
  datasets: [
    // Commenting out True RNG for now - focusing on PRD only
    // {
    //   label: 'True RNG',
    //   data: toPercent(props.trueRngHistogram, props.displayBuckets),
    //   backgroundColor: CHART_COLORS.trueRng,
    //   borderColor: CHART_COLORS.trueRngBorder,
    //   borderWidth: 1,
    //   borderRadius: 2,
    // },
    {
      label: 'PRD',
      data: toPercent(props.prdHistogram, props.displayBuckets),
      backgroundColor: CHART_COLORS.prd,
      borderColor: CHART_COLORS.prdBorder,
      borderWidth: 1,
      borderRadius: 2,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: ANIMATION_CONFIG,
  plugins: {
    legend: {
      display: false, // Hide legend since we're only showing PRD now
    },
    tooltip: {
      callbacks: {
        title: (ctx) => {
          const attemptNumber = ctx[0].dataIndex + 1
          return `Attempt ${attemptNumber}`
        },
        label: (ctx) => {
          const prob = (ctx.raw as number).toFixed(2)
          return `Proc chance: ${prob}%`
        },
        afterLabel: (ctx) => {
          const attemptNumber = ctx.dataIndex + 1
          const lines: string[] = []

          // Show how the C value scales
          const rawC = attemptNumber * props.prdConstant
          const cappedC = Math.min(rawC, 1) * 100
          lines.push(`Formula: ${attemptNumber} × ${(props.prdConstant * 100).toFixed(2)}% = ${cappedC.toFixed(2)}%`)

          return lines
        },
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Attempt Number', color: '#6b7280' },
      grid: { display: false },
    },
    y: {
      title: { display: true, text: 'Proc Chance (%)', color: '#6b7280' },
      grid: { color: 'rgba(31, 41, 55, 0.6)' },
      beginAtZero: true,
      max: 100, // Cap at 100% to show the full range
    },
  },
}))
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 320px;
}
</style>
