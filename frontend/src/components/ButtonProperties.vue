<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { ButtonElement } from '@/types/template.types';

const props = defineProps<{
  element: ButtonElement;
}>();

const templateStore = useTemplateStore();

// Local state for form inputs
const text = ref(props.element.text);
const backgroundColor = ref(props.element.backgroundColor);
const textColor = ref(props.element.textColor);
const borderRadius = ref(props.element.borderRadius);

// Watch for external changes (e.g., switching selection)
watch(() => props.element, (newElement) => {
  text.value = newElement.text;
  backgroundColor.value = newElement.backgroundColor;
  textColor.value = newElement.textColor;
  borderRadius.value = newElement.borderRadius;
}, { deep: true });

// Update methods - apply changes immediately to store
function updateText() {
  templateStore.updateElement(props.element.id, { text: text.value });
}

function updateBackgroundColor() {
  templateStore.updateElement(props.element.id, { backgroundColor: backgroundColor.value });
}

function updateTextColor() {
  templateStore.updateElement(props.element.id, { textColor: textColor.value });
}

function updateBorderRadius() {
  const radius = Math.max(0, Math.min(50, borderRadius.value));
  borderRadius.value = radius;
  templateStore.updateElement(props.element.id, { borderRadius: radius });
}

// Preset color buttons
const presetBackgrounds = [
  { name: 'Blue', color: '#007acc' },
  { name: 'Green', color: '#28a745' },
  { name: 'Red', color: '#dc3545' },
  { name: 'Orange', color: '#fd7e14' },
  { name: 'Purple', color: '#6f42c1' },
  { name: 'Dark', color: '#343a40' },
];

function applyPresetBackground(color: string) {
  backgroundColor.value = color;
  updateBackgroundColor();
}
</script>

<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>Button Properties</h3>
    </div>

    <div class="properties-form">
      <!-- Button Text -->
      <div class="property-group">
        <label for="button-text">Button Text</label>
        <input
          id="button-text"
          v-model="text"
          @input="updateText"
          type="text"
          class="property-input"
          placeholder="Enter button text..."
        />
      </div>

      <!-- Background Color -->
      <div class="property-group">
        <label for="button-bg-color">Background Color</label>
        <div class="color-picker-group">
          <input
            id="button-bg-color"
            v-model="backgroundColor"
            @input="updateBackgroundColor"
            type="color"
            class="color-input"
          />
          <input
            v-model="backgroundColor"
            @input="updateBackgroundColor"
            type="text"
            class="property-input color-text"
            placeholder="#007acc"
          />
        </div>

        <!-- Preset colors -->
        <div class="preset-colors">
          <button
            v-for="preset in presetBackgrounds"
            :key="preset.color"
            :style="{ backgroundColor: preset.color }"
            :title="preset.name"
            class="preset-color-btn"
            @click="applyPresetBackground(preset.color)"
          ></button>
        </div>
      </div>

      <!-- Text Color -->
      <div class="property-group">
        <label for="button-text-color">Text Color</label>
        <div class="color-picker-group">
          <input
            id="button-text-color"
            v-model="textColor"
            @input="updateTextColor"
            type="color"
            class="color-input"
          />
          <input
            v-model="textColor"
            @input="updateTextColor"
            type="text"
            class="property-input color-text"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <!-- Border Radius -->
      <div class="property-group">
        <label for="button-border-radius">Border Radius</label>
        <div class="input-with-unit">
          <input
            id="button-border-radius"
            v-model.number="borderRadius"
            @input="updateBorderRadius"
            type="number"
            min="0"
            max="50"
            class="property-input"
          />
          <span class="unit">px</span>
        </div>
        <input
          v-model.number="borderRadius"
          @input="updateBorderRadius"
          type="range"
          min="0"
          max="50"
          class="property-slider"
        />
      </div>

      <!-- Preview -->
      <div class="property-group">
        <label>Preview</label>
        <div class="button-preview">
          <button
            class="preview-button"
            :style="{
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius: `${borderRadius}px`,
            }"
          >
            {{ text || 'Button Preview' }}
          </button>
        </div>
      </div>

      <!-- Element Info -->
      <div class="property-group info">
        <label>Position</label>
        <span class="info-text">
          X: {{ Math.round(element.position.x) }}px, Y: {{ Math.round(element.position.y) }}px
        </span>
      </div>

      <div class="property-group info">
        <label>Size</label>
        <span class="info-text">
          {{ Math.round(element.size.width) }}×{{ Math.round(element.size.height) }}px
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  margin-bottom: 1.5rem;
}

.panel-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.properties-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #7f8c8d;
}

.property-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.property-input:focus {
  outline: none;
  border-color: #007acc;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-with-unit .property-input {
  flex: 1;
}

.unit {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
}

.property-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e1e8ed;
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
}

.property-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #007acc;
  cursor: pointer;
  border: none;
}

.color-picker-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 48px;
  height: 40px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-text {
  flex: 1;
}

.preset-colors {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-color-btn {
  width: 36px;
  height: 36px;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.preset-color-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-preview {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-button {
  padding: 0.5rem 1.5rem;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: default;
  font-family: inherit;
  transition: none;
}

.property-group.info {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.property-group.info label {
  margin-bottom: 0.25rem;
}

.info-text {
  font-size: 0.875rem;
  color: #2c3e50;
}
</style>
