<script setup lang="ts">
import { TRIAL_OPTIONS } from '@/composables/useSimulation'

defineProps<{
  procChance: number
  trials: number
}>()

const emit = defineEmits<{
  'update:procChance': [value: number]
  'update:trials': [value: number]
}>()

function formatTrials(n: number): string {
  return n >= 1000 ? `${n / 1000}k` : String(n)
}

function handleProcChanceInput(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  emit('update:procChance', value)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Proc Chance Input -->
    <div class="flex items-center gap-4">
      <label class="text-text-muted text-sm shrink-0">Proc %:</label>
      <input
        type="number"
        :value="procChance"
        @input="handleProcChanceInput"
        min="1"
        max="99"
        class="w-20 px-3 py-2 rounded-lg bg-surface-alt border border-border text-text font-mono text-center focus:outline-none focus:border-primary transition-colors"
      />
    </div>

    <!-- Trials Selector -->
    <div class="flex items-center gap-3">
      <span class="text-text-muted text-sm shrink-0">Trials:</span>
      <div class="flex gap-2">
        <button
          v-for="option in TRIAL_OPTIONS"
          :key="option"
          @click="emit('update:trials', option)"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-mono transition-colors border cursor-pointer',
            trials === option
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-surface-alt border-border hover:bg-surface-hover text-text-muted',
          ]"
        >
          {{ formatTrials(option) }}
        </button>
      </div>
    </div>
  </div>
</template>
