import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

ChartJS.defaults.color = '#6b7280'
ChartJS.defaults.borderColor = '#1f2937'

export const CHART_COLORS = {
  trueRng: 'rgba(239, 68, 68, 0.75)',
  trueRngBorder: 'rgba(239, 68, 68, 1)',
  prd: 'rgba(127, 176, 105, 0.75)',
  prdBorder: 'rgba(127, 176, 105, 1)',
}

export const ANIMATION_CONFIG = {
  duration: 800,
  easing: 'easeInOutCubic' as const,
}

export function generateLabels(displayBuckets: number, maxBucket: number): string[] {
  const labels: string[] = []
  for (let i = 1; i <= displayBuckets; i++) {
    if (i === displayBuckets && i === maxBucket) {
      labels.push(`${i}+`)
    } else {
      labels.push(String(i))
    }
  }
  return labels
}
