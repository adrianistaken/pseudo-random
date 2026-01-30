<script setup lang="ts">
import type { Preset } from '@/simulation/types'
import { PRESETS } from '@/composables/useSimulation'

defineEmits<{
  select: [preset: Preset]
}>()
</script>

<template>
  <div class="preset-buttons">
    <button
      v-for="preset in PRESETS"
      :key="preset.label"
      @click="$emit('select', preset)"
      class="preset-button"
    >
      <span class="preset-label">{{ preset.label }}</span>
      <span class="preset-value">{{ preset.procChance }}%</span>
    </button>
  </div>
</template>

<style scoped>
.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.preset-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid #1e293b;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.preset-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.preset-button:hover {
  background: rgba(17, 24, 39, 0.9);
  border-color: rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(34, 211, 238, 0.2);
}

.preset-button:hover::before {
  opacity: 1;
}

.preset-button:active {
  transform: translateY(0);
}

.preset-label {
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: #cbd5e1;
  transition: color 0.25s ease;
}

.preset-button:hover .preset-label {
  color: #f8fafc;
}

.preset-value {
  position: relative;
  z-index: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: #22d3ee;
  transition: all 0.25s ease;
}

.preset-button:hover .preset-value {
  color: #06b6d4;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}

/* Responsive */
@media (max-width: 640px) {
  .preset-button {
    padding: 0.75rem 1.25rem;
    gap: 0.5rem;
  }

  .preset-label {
    font-size: 0.85rem;
  }

  .preset-value {
    font-size: 0.9rem;
  }
}
</style>
