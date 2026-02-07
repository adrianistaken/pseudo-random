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

const cycleLength = computed(() => Math.ceil(1 / props.prdConstant))

const labels = computed(() => generateLabels(props.displayBuckets, MAX_BUCKET))

// Convert probability (0-1) to percentage (0-100)
function toPercent(histogram: number[], buckets: number): number[] {
  return histogram.slice(0, buckets).map((prob) => prob * 100)
}

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: labels.value,
  datasets: [
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
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (ctx) => {
          const attemptNumber = (ctx[0]?.dataIndex ?? 0) + 1
          return `Attempt ${attemptNumber}`
        },
        label: (ctx) => {
          const prob = (ctx.raw as number).toFixed(2)
          return `Proc chance: ${prob}%`
        },
        afterLabel: (ctx) => {
          const attemptNumber = ctx.dataIndex + 1
          const cyclePos = ((attemptNumber - 1) % cycleLength.value) + 1
          const lines: string[] = []

          const cPercent = (props.prdConstant * 100).toFixed(2)
          const rawResult = cyclePos * props.prdConstant
          const cappedResult = Math.min(rawResult, 1) * 100

          lines.push(`P(${cyclePos}) = ${cPercent}% × ${cyclePos} = ${cappedResult.toFixed(2)}%`)

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
      suggestedMax: 100,
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
  height: 280px;
}
</style>
