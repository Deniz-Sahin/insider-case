<script setup lang="ts">
import { computed } from 'vue';

/**
 * NumberSlider - Reusable number input with range slider
 * Combines text input and slider for easy numeric value selection
 */
const props = withDefaults(
  defineProps<{
    modelValue: number;
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    // Clamp value between min and max
    const clampedValue = Math.max(props.min, Math.min(props.max, value));
    emit('update:modelValue', clampedValue);
  },
});
</script>

<template>
  <div class="number-slider">
    <div class="input-with-unit">
      <input
        :id="id"
        v-model.number="localValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        class="property-input number-input"
      />
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
    <input
      v-model.number="localValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="property-slider"
    />
  </div>
</template>

<style scoped>
.number-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.number-input {
  flex: 1;
  padding-right: 40px;
}

.unit {
  position: absolute;
  right: 12px;
  font-size: 13px;
  color: #666;
  pointer-events: none;
}

.property-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.property-input:focus {
  outline: none;
  border-color: #007acc;
}

.property-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #e0e0e0, #007acc);
  outline: none;
  -webkit-appearance: none;
}

.property-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #007acc;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.property-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #007acc;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
