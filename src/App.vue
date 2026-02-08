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
const currentView = ref<'main' | 'learn'>('main')

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
    <!-- Top Bar -->
    <div class="top-bar">
      <!-- Nav Link -->
      <div class="nav-link">
        <a v-if="currentView === 'main'" class="nav-btn" @click="currentView = 'learn'">
          How It Works <span class="nav-arrow nav-arrow-forward">&rarr;</span>
        </a>
        <a v-else class="nav-btn" @click="currentView = 'main'">
          <span class="nav-arrow nav-arrow-back">&larr;</span> Calculator
        </a>
      </div>

      <!-- Social Links -->
      <div class="social-links">
        <a href="https://www.youtube.com/@zzadrianzz" target="_blank" rel="noopener" class="social-icon" aria-label="YouTube">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        <a href="https://discord.com/invite/7CWCUh4qgg" target="_blank" rel="noopener" class="social-icon" aria-label="Discord">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
        </a>
      </div>
    </div>

    <!-- Main View -->
    <div v-if="currentView === 'main'" class="content-wrapper">
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

    <!-- Learn View -->
    <div v-else class="content-wrapper">
      <header class="header">
        <div class="title-group">
          <h1 class="main-title">How It Works</h1>
          <p class="subtitle">
            Understanding Pseudo-Random Distribution in Dota 2
          </p>
        </div>
      </header>

      <section class="learn-content">
        <!-- What is PRD -->
        <div class="learn-section">
          <h2 class="learn-heading">What is Pseudo-Random Distribution?</h2>
          <p class="learn-text">
            In Dota 2, many abilities and items have a chance to trigger a special effect on each attack — a "proc." You'd think a 25% chance means pure randomness, like flipping a weighted coin every time. But pure randomness feels terrible in practice. You can get unlucky and miss 10 times in a row, or get absurdly lucky and proc 3 times back to back.
          </p>
          <p class="learn-text">
            Pseudo-Random Distribution (PRD) fixes this. Instead of rolling the same odds every time, PRD starts with a <em>lower</em> chance on your first attempt and <em>increases</em> it with each consecutive failure. If you keep not proccing, your chance keeps climbing until it eventually becomes a guarantee. The moment you proc, it resets back to the low starting value.
          </p>
          <p class="learn-text">
            The result? The <strong>average</strong> proc rate stays the same as advertised (25% still means roughly 1 in 4 attacks), but the outcomes feel much fairer. You won't go on massive dry streaks, and you won't get absurd lucky chains either. It smooths out the randomness.
          </p>
        </div>

        <!-- How it works -->
        <div class="learn-section">
          <h2 class="learn-heading">How It Works (The Simple Version)</h2>
          <p class="learn-text">
            Think of it like a staircase. Each time you attack and don't proc, you step up to a higher chance. When you finally proc, you jump back down to the bottom.
          </p>
          <div class="learn-example">
            <p class="learn-example-title">Example: Skull Basher (25% bash chance)</p>
            <div class="learn-steps">
              <p>Attack 1 — your chance is only <strong>8.5%</strong></p>
              <p>Attack 2 — climbs to <strong>17.0%</strong></p>
              <p>Attack 3 — now <strong>25.5%</strong></p>
              <p>Attack 4 — <strong>34.0%</strong></p>
              <p>Attack 5 — <strong>42.5%</strong></p>
              <p class="learn-steps-note">...and so on, going up by 8.5% each time, until you proc and it resets.</p>
            </div>
          </div>
          <p class="learn-text">
            That <strong>8.5%</strong> step size is called the <strong>C value</strong> — it's the constant that PRD is built around. It's not the same as the listed proc chance, and not the same for every ability. Instead, it's a carefully calculated number that makes the average proc rate come out to exactly 25% over time.
          </p>
        </div>

        <!-- The math -->
        <div class="learn-section">
          <h2 class="learn-heading">The Actual Math</h2>
          <p class="learn-text">
            On attempt <strong>N</strong> (counting from the last proc or the start of the game), your probability of proccing is:
          </p>
          <div class="learn-formula">
            P(N) = C &times; N
          </div>
          <div class="learn-formula-legend">
            <span><strong>P(N)</strong> = proc chance on attempt N</span>
            <span><strong>C</strong> = step size (the PRD constant)</span>
            <span><strong>N</strong> = attempts since last proc</span>
          </div>
          <p class="learn-text">
            That's it. Your proc chance on attempt N is just the C value multiplied by the attempt number (capped at 100%). So if C is 8.5%:
          </p>
          <div class="learn-formula-table">
            <div class="formula-row">
              <span class="formula-cell">Attempt 1:</span>
              <span class="formula-cell-val">8.5% &times; 1 = 8.50%</span>
            </div>
            <div class="formula-row">
              <span class="formula-cell">Attempt 2:</span>
              <span class="formula-cell-val">8.5% &times; 2 = 17.00%</span>
            </div>
            <div class="formula-row">
              <span class="formula-cell">Attempt 3:</span>
              <span class="formula-cell-val">8.5% &times; 3 = 25.50%</span>
            </div>
            <div class="formula-row">
              <span class="formula-cell">Attempt 12:</span>
              <span class="formula-cell-val">8.5% &times; 12 = 100% (guaranteed)</span>
            </div>
          </div>
          <p class="learn-text">
            The tricky part is figuring out what C should be. You can't just use the listed proc chance — if Skull Basher started at 25% and went up by 25% each time, you'd proc way more than 25% on average. The C value has to be <em>lower</em> than the listed chance so that when you average it all out — the early low-chance attempts and the later high-chance attempts — the overall rate lands on 25%.
          </p>
          <p class="learn-text">
            Finding C involves solving for the value where the expected number of attempts between procs equals <strong>1 / P</strong> (for 25%, that's 1 / 0.25 = 4 attempts on average). This is done using binary search — the same method this calculator uses. There's no clean closed-form formula, so even the game itself computes C through iteration.
          </p>
        </div>

        <!-- Learn more -->
        <div class="learn-links">
          <a href="https://www.youtube.com/@zzadrianzz" target="_blank" rel="noopener" class="learn-link-card">
            <span class="link-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </span>
            <span class="link-card-text">
              <strong>Watch the Video</strong>
              <span>My full PRD breakdown in Dota 2</span>
            </span>
          </a>
          <a href="https://www.youtube.com/@zzadrianzz" target="_blank" rel="noopener" class="learn-link-card">
            <span class="link-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </span>
            <span class="link-card-text">
              <strong>YouTube Channel</strong>
              <span>More Dota 2 content and analysis</span>
            </span>
          </a>
          <a href="https://discord.com/invite/7CWCUh4qgg" target="_blank" rel="noopener" class="learn-link-card">
            <span class="link-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
            </span>
            <span class="link-card-text">
              <strong>Join the Discord</strong>
              <span>Discuss Dota 2 mechanics and more</span>
            </span>
          </a>
          <a class="learn-link-card" @click="currentView = 'main'">
            <span class="link-card-icon">
              <span class="back-arrow-icon">&larr;</span>
            </span>
            <span class="link-card-text">
              <strong>Back to Calculator</strong>
              <span>Try different proc chances</span>
            </span>
          </a>
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

/* Top Bar */
.top-bar {
  display: contents;
}

/* Social Links */
.social-links {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  gap: 0.6rem;
  z-index: 50;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #64748b;
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid #4f4f4f3b;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.social-icon:hover {
  color: #f1f5f9;
  border-color: rgba(127, 176, 105, 0.3);
  background: rgba(127, 176, 105, 0.1);
}

/* Nav Link (top-left) */
.nav-link {
  position: fixed;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 50;
}

.nav-btn {
  color: #7fb069;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-btn:hover {
  color: #a8d98a;
}

.nav-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.nav-btn:hover .nav-arrow-forward {
  transform: translateX(3px);
}

.nav-btn:hover .nav-arrow-back {
  transform: translateX(-3px);
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
    linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.55) 50%, transparent 100%),
    linear-gradient(135deg, #7fb069 0%, #a8d98a 50%, #7fb069 100%);
  background-size: 65% 100%, 100% 100%;
  background-repeat: no-repeat, no-repeat;
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

.learn-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.learn-section {
  background: rgb(18 18 18);
  border: 1px solid #4f4f4f3b;
  border-radius: 10px;
  padding: 2rem 2.25rem;
  animation: fadeIn 0.6s ease-out both;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.learn-section:nth-child(1) { animation-delay: 0.1s; }
.learn-section:nth-child(2) { animation-delay: 0.2s; }
.learn-section:nth-child(3) { animation-delay: 0.3s; }
.learn-section:nth-child(4) { animation-delay: 0.4s; }

.learn-section:hover {
  border-color: rgba(127, 176, 105, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(127, 176, 105, 0.1);
}

.learn-heading {
  font-size: 1.35rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 1rem 0;
}

.learn-text {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.75;
  margin: 0 0 0.75rem 0;
}

.learn-text:last-child {
  margin-bottom: 0;
}

.learn-text em {
  color: #cbd5e1;
  font-style: italic;
}

.learn-text strong {
  color: #7fb069;
  font-weight: 600;
}

.learn-example {
  background: rgba(127, 176, 105, 0.05);
  border: 1px solid rgba(127, 176, 105, 0.15);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin: 1rem 0;
}

.learn-example-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #7fb069;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
}

.learn-steps p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin: 0.3rem 0;
  line-height: 1.6;
}

.learn-steps strong {
  color: #7fb069;
}

.learn-steps-note {
  color: #64748b !important;
  font-style: italic;
  margin-top: 0.5rem !important;
}

.learn-formula {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: #7fb069;
  text-align: center;
  padding: 1.25rem;
  margin: 1rem 0;
  background: rgba(127, 176, 105, 0.06);
  border: 1px solid rgba(127, 176, 105, 0.15);
  border-radius: 8px;
  letter-spacing: 0.03em;
}

.learn-formula-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: -0.25rem 0 1rem 0;
  font-size: 0.8rem;
  color: #64748b;
}

.learn-formula-legend strong {
  color: #7fb069;
  font-weight: 600;
}

.learn-formula-table {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 1rem 0;
  padding: 1rem 1.25rem;
  background: rgba(127, 176, 105, 0.04);
  border: 1px solid rgba(127, 176, 105, 0.1);
  border-radius: 8px;
}

.formula-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.8;
}

.formula-cell {
  color: #64748b;
  min-width: 90px;
}

.formula-cell-val {
  color: #cbd5e1;
}

.learn-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.learn-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: rgb(18 18 18);
  border: 1px solid #4f4f4f3b;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.learn-link-card:hover {
  border-color: rgba(127, 176, 105, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(127, 176, 105, 0.1);
}

.link-card-icon {
  color: #7fb069;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-arrow-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.link-card-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.link-card-text strong {
  color: #f1f5f9;
  font-size: 0.9rem;
  font-weight: 600;
}

.link-card-text span {
  color: #64748b;
  font-size: 0.8rem;
}

@media (max-width: 900px) {
  .learn-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .learn-section {
    padding: 1.5rem 1.25rem;
  }

  .learn-links {
    grid-template-columns: 1fr;
  }

  .learn-formula {
    font-size: 1.1rem;
  }
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
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0 1rem 2rem;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .nav-link,
  .social-links {
    position: static;
    z-index: auto;
  }

  .social-icon {
    background: transparent;
    border-color: transparent;
    backdrop-filter: none;
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
