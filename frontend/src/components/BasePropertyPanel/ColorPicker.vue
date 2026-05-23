<script setup lang="ts">
import { computed } from 'vue';

/**
 * ColorPicker - Reusable color picker with both visual picker and text input
 */
const props = defineProps<{
  modelValue: string;
  id?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="color-picker-group">
    <input :id="id" v-model="localValue" type="color" class="color-input" />
    <input
      v-model="localValue"
      type="text"
      class="property-input color-text"
      :placeholder="placeholder || '#000000'"
    />
  </div>
</template>

<style scoped>
.color-picker-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input {
  width: 48px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  padding: 2px;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.color-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
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
</style>
