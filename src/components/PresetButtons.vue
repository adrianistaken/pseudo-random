<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { Preset } from '@/simulation/types'
import { PRESETS } from '@/composables/useSimulation'

const emit = defineEmits<{
  select: [procChance: number]
}>()

const items = computed(() => PRESETS.filter(p => p.category === 'item'))
const spells = computed(() => PRESETS.filter(p => p.category === 'spell'))

// Track selected level per preset (defaults to max level)
const selectedLevels = reactive<Record<string, number>>({})

// Track talent toggle per preset
const talentActive = reactive<Record<string, boolean>>({})

function getLevel(preset: Preset): number {
  return selectedLevels[preset.label] ?? preset.levels.length - 1
}

function isTalentOn(preset: Preset): boolean {
  if (!preset.talent) return false
  if (preset.talent.locked) return true
  return !!talentActive[preset.label]
}

function getEffectiveChance(preset: Preset, levelIndex: number): number {
  const base = preset.levels[levelIndex] ?? preset.levels[preset.levels.length - 1] ?? 0
  const bonus = isTalentOn(preset) ? preset.talent!.bonus : 0
  return base + bonus
}

function selectLevel(preset: Preset, levelIndex: number) {
  selectedLevels[preset.label] = levelIndex
  emit('select', getEffectiveChance(preset, levelIndex))
}

function selectPreset(preset: Preset) {
  emit('select', getEffectiveChance(preset, getLevel(preset)))
}

function toggleTalent(preset: Preset) {
  if (preset.talent?.locked) return
  talentActive[preset.label] = !talentActive[preset.label]
  emit('select', getEffectiveChance(preset, getLevel(preset)))
}
</script>

<template>
  <div class="preset-sections">
    <!-- Spells -->
    <div class="preset-group">
      <span class="group-label">Spells</span>
      <div class="preset-grid">
        <button
          v-for="preset in spells"
          :key="preset.label"
          @click="selectPreset(preset)"
          class="preset-card"
        >
          <div class="card-top">
            <img
              v-if="preset.image"
              :src="preset.image"
              :alt="preset.label"
              class="preset-icon"
            />
            <div class="preset-info">
              <span class="preset-label">{{ preset.label }}</span>
              <div class="preset-value-row">
                <span class="preset-value">{{ getEffectiveChance(preset, getLevel(preset)) }}%</span>
                <img
                  v-if="preset.talent"
                  :src="preset.talent.icon"
                  :alt="`+${preset.talent.bonus}% talent`"
                  class="talent-icon"
                  :class="{ active: isTalentOn(preset), locked: preset.talent.locked }"
                  @click.stop="toggleTalent(preset)"
                />
              </div>
            </div>
          </div>
          <div v-if="preset.category === 'spell'" class="level-pips">
            <span
              v-for="(_, i) in preset.levels"
              :key="i"
              class="level-pip"
              :class="{ active: i <= getLevel(preset) }"
              @click.stop="selectLevel(preset, i)"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Items -->
    <div class="preset-group">
      <span class="group-label">Items</span>
      <div class="preset-grid">
        <button
          v-for="preset in items"
          :key="preset.label"
          @click="selectPreset(preset)"
          class="preset-card"
        >
          <div class="card-top">
            <img
              v-if="preset.image"
              :src="preset.image"
              :alt="preset.label"
              class="preset-icon"
            />
            <div class="preset-info">
              <span class="preset-label">{{ preset.label }}</span>
              <div class="preset-value-row">
                <span class="preset-value">{{ getEffectiveChance(preset, getLevel(preset)) }}%</span>
                <img
                  v-if="preset.talent"
                  :src="preset.talent.icon"
                  :alt="`+${preset.talent.bonus}% talent`"
                  class="talent-icon"
                  :class="{ active: isTalentOn(preset), locked: preset.talent.locked }"
                  @click.stop="toggleTalent(preset)"
                />
              </div>
            </div>
          </div>
          <div v-if="preset.category === 'spell'" class="level-pips">
            <span
              v-for="(_, i) in preset.levels"
              :key="i"
              class="level-pip"
              :class="{ active: i <= getLevel(preset) }"
              @click.stop="selectLevel(preset, i)"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.preset-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding-left: 0.25rem;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.5rem;
}

.preset-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgb(25 25 25);
  backdrop-filter: blur(10px);
  border: 1px solid #4f4f4f3b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  text-align: left;
}

.preset-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(127, 176, 105, 0.08) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.preset-card:hover {
  background: rgba(17, 24, 39, 0.85);
  border-color: rgba(127, 176, 105, 0.4);
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(127, 176, 105, 0.15);
}

.preset-card:hover::before {
  opacity: 1;
}

.preset-card:active {
  transform: translateY(0);
}

/* Top row: icon + info */
.card-top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  position: relative;
  z-index: 1;
}

.preset-icon {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease;
}

.preset-card:hover .preset-icon {
  border-color: rgba(127, 176, 105, 0.3);
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  flex: 1;
}

.preset-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #cbd5e1;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-card:hover .preset-label {
  color: #f8fafc;
}

.preset-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preset-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #7fb069;
  transition: all 0.2s ease;
}

.preset-card:hover .preset-value {
  text-shadow: 0 0 8px rgba(127, 176, 105, 0.4);
}

/* Talent icon */
.talent-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.25;
  filter: grayscale(1);
  flex-shrink: 0;
}

.talent-icon:hover {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.talent-icon.active {
  opacity: 1;
  filter: grayscale(0) brightness(1.1) drop-shadow(0 0 4px rgba(200, 168, 78, 0.6));
}

.talent-icon.locked {
  cursor: default;
}

/* Dota-style level pips */
.level-pips {
  display: flex;
  align-items: center;
  gap: 3px;
  position: relative;
  z-index: 1;
  width: 100%;
}

.level-pip {
  flex: 1;
  max-width: 25%;
  height: 8px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
  position: relative;
}

.level-pip::before {
  content: '';
  position: absolute;
  inset: -8px -4px;
}

.level-pip:hover {
  border-color: #c8a84e;
}

.level-pip.active {
  background: #c8a84e;
  border-color: #b8942e;
  box-shadow: 0 0 6px rgba(200, 168, 78, 0.6);
}

/* Responsive */
@media (max-width: 640px) {
  .preset-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.375rem;
  }

  .preset-card {
    padding: 0.4rem 0.6rem;
    gap: 0.4rem;
  }

  .preset-icon {
    width: 34px;
    height: 34px;
  }

  .preset-label {
    font-size: 0.75rem;
  }

  .preset-value {
    font-size: 0.7rem;
  }
}
</style>
