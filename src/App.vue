<script setup lang="ts">
import { computed, ref } from 'vue'
import '@/chartConfig'
import { useSimulation } from '@/composables/useSimulation'
import { useAnimatedNumber } from '@/composables/useAnimatedNumber'
import PresetButtons from '@/components/PresetButtons.vue'
import HistogramChart from '@/components/HistogramChart.vue'
import { calculateC } from '@/simulation/prd'

const { procChance, result, applyPreset } = useSimulation()

const isInvalid = computed(() => procChance.value < 1 || procChance.value > 99)
const inputFocused = ref(false)

const animatedProc = useAnimatedNumber(procChance, 350)
const cPercent = computed(() => getPrdConstant() * 100)
const animatedC = useAnimatedNumber(cPercent, 350)

const displayProc = computed(() => {
  if (inputFocused.value) return procChance.value
  if (Number.isInteger(procChance.value)) return Math.round(animatedProc.value)
  return Math.round(animatedProc.value * 100) / 100
})

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value
  if (raw === '' || raw.endsWith('.')) return
  let val = parseFloat(raw)
  if (isNaN(val)) return
  val = Math.round(val * 100) / 100
  val = Math.min(99, Math.max(0, val))
  procChance.value = val
}

function handleBlur(e: Event) {
  const input = e.target as HTMLInputElement
  let val = parseFloat(input.value)
  if (isNaN(val)) val = 25
  val = Math.round(val * 100) / 100
  val = Math.min(99, Math.max(1, val))
  procChance.value = val
  input.value = String(val)
}

function handlePreset(value: number) {
  applyPreset(value)
}

function getPrdConstant(): number {
  if (!result.value) return 0
  const p = procChance.value / 100
  return calculateC(p)
}
</script>

<template>
  <div class="app-container">
    <div class="content-wrapper">
      <!-- Header -->
      <header class="header">
        <div class="title-group">
          <h1 class="main-title">Pseudo-Random Distribution</h1>
          <p class="subtitle">
            How proc chance increases with each failed attempt
          </p>
        </div>
      </header>

      <!-- Graph Container -->
      <section v-if="result" class="chart-container">
        <HistogramChart
          :true-rng-histogram="result.trueRng.histogram"
          :prd-histogram="result.prd.histogram"
          :display-buckets="result.displayBuckets"
          :prd-constant="getPrdConstant()"
          :proc-chance="procChance"
        />
      </section>

      <!-- Controls -->
      <section class="controls-section">
        <!-- Custom Input -->
        <div class="input-group">
          <label class="input-label">Proc Chance</label>
          <div class="input-wrapper" :class="{ invalid: isInvalid }">
            <input
              type="number"
              :value="displayProc"
              @focus="inputFocused = true"
              @input="handleInput"
              @blur="inputFocused = false; handleBlur($event)"
              min="1"
              max="99"
              step="0.01"
              class="proc-input"
            />
            <span class="input-suffix">%</span>
          </div>
          <div class="c-value">
            <span class="c-label">C =</span>
            <span class="c-number">{{ animatedC.toFixed(1) }}%</span>
            <span class="c-info" data-tooltip="C is the step size — your proc chance increases by this amount on each failed attempt, resetting after a proc.">?</span>
          </div>
        </div>

        <!-- Presets -->
        <div class="presets-group">
          <PresetButtons @select="handlePreset" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Header Styles */
.header {
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.title-group {
  display: inline-block;
  position: relative;
}

.main-title {
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin: 0;
  padding: 0;
  line-height: 1.1;
  background:
    linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%),
    linear-gradient(135deg, #f8fafc 0%, #7fb069 50%, #a8d98a 100%);
  background-size: 200% 100%, 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 6s ease-in-out infinite;
}

.subtitle {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Invalid input indicator */
.input-wrapper.invalid .proc-input {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.12);
}

/* Chart Container */
.chart-container {
  background: rgb(18 18 18);
  backdrop-filter: blur(20px);
  border: 1px solid #4f4f4f3b;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(127, 176, 105, 0.1);
  animation: fadeIn 0.8s ease-out 0.2s both;
  transition: all 0.3s ease;
}

.chart-container:hover {
  border-color: rgba(127, 176, 105, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(127, 176, 105, 0.2),
    0 0 40px rgba(127, 176, 105, 0.08);
}

/* Controls Section */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.8s ease-out 0.4s both;
}

/* Input Group */
.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.proc-input {
  width: 110px;
  height: 48px;
  background: rgb(18 18 18);
  border: 1px solid #4f4f4f3b;
  border-radius: 6px;
  color: #f8fafc;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  padding: 0 1.75rem 0 0.25rem;
  outline: none;
  transition: all 0.25s ease;
  -moz-appearance: textfield;
  appearance: textfield;
}

.proc-input::-webkit-outer-spin-button,
.proc-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.proc-input:hover {
  border-color: rgba(127, 176, 105, 0.3);
  background: rgb(22 22 22);
}

.proc-input:focus {
  border-color: #7fb069;
  box-shadow:
    0 0 0 3px rgba(127, 176, 105, 0.15),
    0 4px 12px rgba(127, 176, 105, 0.2);
  background: rgb(22 22 22);
}

.input-suffix {
  position: absolute;
  right: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #64748b;
  pointer-events: none;
}

.c-value {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.75rem;
  background: rgb(18 18 18);
  border: 1px solid #4f4f4f3b;
  border-radius: 6px;
  justify-content: center;
}

.c-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
}

.c-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  color: #7fb069;
  font-weight: 600;
  white-space: nowrap;
}

.c-info {
  position: absolute;
  top: -8px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: 700;
  font-family: Arial, sans-serif;
  line-height: 1;
  color: #64748b;
  background: rgb(18 18 18);
  border: 1px solid #4f4f4f;
  border-radius: 50%;
  cursor: help;
  transition: all 0.2s ease;
}

.c-info:hover {
  color: #94a3b8;
  border-color: #94a3b8;
}

.c-info::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 240px;
  padding: 0.6rem 0.75rem;
  background: rgb(30 30 30);
  border: 1px solid #4f4f4f;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 400;
  font-family: inherit;
  color: #cbd5e1;
  line-height: 1.5;
  white-space: normal;
  text-align: left;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.c-info:hover::after {
  opacity: 1;
}

/* Presets Group */
.presets-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .app-container {
    padding: 2rem 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .chart-container {
    padding: 1rem;
  }

  .input-group {
    gap: 1rem;
  }

  .proc-input {
    width: 100px;
    height: 44px;
    font-size: 1.1rem;
  }
}

@media (max-width: 640px) {
  .main-title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .chart-container {
    padding: 0.75rem;
  }
}
</style>
