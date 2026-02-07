<script setup lang="ts">
import { computed } from 'vue'
import type { Preset } from '@/simulation/types'
import { PRESETS } from '@/composables/useSimulation'

defineEmits<{
  select: [preset: Preset]
}>()

const items = computed(() => PRESETS.filter(p => p.category === 'item'))
const spells = computed(() => PRESETS.filter(p => p.category === 'spell'))
</script>

<template>
  <div class="preset-sections">
    <!-- Items -->
    <div class="preset-group">
      <span class="group-label">Items</span>
      <div class="preset-grid">
        <button
          v-for="preset in items"
          :key="preset.label"
          @click="$emit('select', preset)"
          class="preset-card"
        >
          <img
            v-if="preset.image"
            :src="preset.image"
            :alt="preset.label"
            class="preset-icon"
          />
          <div class="preset-info">
            <span class="preset-label">{{ preset.label }}</span>
            <span class="preset-value">{{ preset.procChance }}%</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Spells -->
    <div class="preset-group">
      <span class="group-label">Spells</span>
      <div class="preset-grid">
        <button
          v-for="preset in spells"
          :key="preset.label"
          @click="$emit('select', preset)"
          class="preset-card"
        >
          <img
            v-if="preset.image"
            :src="preset.image"
            :alt="preset.label"
            class="preset-icon"
          />
          <div class="preset-info">
            <span class="preset-label">{{ preset.label }}</span>
            <span class="preset-value">{{ preset.procChance }}%</span>
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
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid #1e293b;
  border-radius: 8px;
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
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.preset-card:hover {
  background: rgba(17, 24, 39, 0.85);
  border-color: rgba(34, 211, 238, 0.4);
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(34, 211, 238, 0.15);
}

.preset-card:hover::before {
  opacity: 1;
}

.preset-card:active {
  transform: translateY(0);
}

.preset-icon {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease;
}

.preset-card:hover .preset-icon {
  border-color: rgba(34, 211, 238, 0.3);
}

.preset-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
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

.preset-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #22d3ee;
  transition: all 0.2s ease;
}

.preset-card:hover .preset-value {
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
}

/* Responsive */
@media (max-width: 640px) {
  .preset-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.375rem;
  }

  .preset-card {
    padding: 0.4rem 0.6rem;
    gap: 0.5rem;
  }

  .preset-icon {
    width: 28px;
    height: 28px;
  }

  .preset-label {
    font-size: 0.75rem;
  }

  .preset-value {
    font-size: 0.7rem;
  }
}
</style>
