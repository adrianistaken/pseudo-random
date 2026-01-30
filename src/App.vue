<script setup lang="ts">
import '@/chartConfig'
import { useSimulation } from '@/composables/useSimulation'
import PresetButtons from '@/components/PresetButtons.vue'
import HistogramChart from '@/components/HistogramChart.vue'
import type { Preset } from '@/simulation/types'
import { calculateC } from '@/simulation/prd'

const { procChance, result, error, applyPreset } = useSimulation()

function handlePreset(preset: Preset) {
  applyPreset(preset)
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

      <!-- Error -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

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

      <!-- Explanation (hidden for now) -->
      <!-- <section v-if="result" class="explanation-section">
        <p class="explanation-text">
          In Dota 2's PRD system, each failed attempt increases your proc chance by <strong>C = {{ (getPrdConstant() * 100).toFixed(1) }}%</strong>.
          This creates a more consistent experience compared to pure random chance.
        </p>
      </section> -->

      <!-- Controls -->
      <section class="controls-section">
        <!-- Custom Input -->
        <div class="input-group">
          <label class="input-label">Proc Chance</label>
          <div class="input-wrapper">
            <input
              type="number"
              v-model.number="procChance"
              min="1"
              max="99"
              class="proc-input"
            />
            <span class="input-suffix">%</span>
          </div>
          <div class="c-value">
            <span class="c-label">C =</span>
            <span class="c-number">{{ (getPrdConstant() * 100).toFixed(1) }}%</span>
          </div>
        </div>

        <!-- Presets -->
        <div class="presets-group">
          <span class="presets-label">Quick Select</span>
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
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin: 0;
  padding: 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #f8fafc 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 400;
  letter-spacing: 0.02em;
}

/* Error Message */
.error-message {
  text-align: center;
  color: #ef4444;
  font-size: 0.9rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  animation: fadeIn 0.4s ease-out;
}

/* Chart Container */
.chart-container {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(34, 211, 238, 0.1);
  animation: fadeIn 0.8s ease-out 0.2s both;
  transition: all 0.3s ease;
}

.chart-container:hover {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(34, 211, 238, 0.2),
    0 0 40px rgba(34, 211, 238, 0.1);
}

/* Explanation Section */
.explanation-section {
  text-align: center;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

.explanation-text {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.explanation-text strong {
  color: #22d3ee;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
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
  width: 90px;
  height: 48px;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid #1e293b;
  border-radius: 10px;
  color: #f8fafc;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  padding: 0 1rem 0 1rem;
  outline: none;
  transition: all 0.25s ease;
}

.proc-input:hover {
  border-color: rgba(34, 211, 238, 0.3);
  background: rgba(17, 24, 39, 0.95);
}

.proc-input:focus {
  border-color: #22d3ee;
  box-shadow:
    0 0 0 3px rgba(34, 211, 238, 0.15),
    0 4px 12px rgba(34, 211, 238, 0.2);
  background: rgba(17, 24, 39, 1);
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
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.75rem;
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid #1e293b;
  border-radius: 10px;
  backdrop-filter: blur(10px);
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
  color: #22d3ee;
  font-weight: 600;
  white-space: nowrap;
}

/* Presets Group */
.presets-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.presets-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
    padding: 1.5rem;
  }

  .input-group {
    gap: 1rem;
  }

  .proc-input {
    width: 80px;
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
    padding: 1rem;
  }
}
</style>
