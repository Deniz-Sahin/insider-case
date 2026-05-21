<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { HeadingElement } from '@/types/template.types';

const props = defineProps<{
  element: HeadingElement;
}>();

const templateStore = useTemplateStore();

// Local state for form inputs
const content = ref(props.element.content);
const fontSize = ref(props.element.fontSize);
const color = ref(props.element.color);
const alignment = ref(props.element.alignment);

// Watch for external changes (e.g., switching selection)
watch(() => props.element, (newElement) => {
  content.value = newElement.content;
  fontSize.value = newElement.fontSize;
  color.value = newElement.color;
  alignment.value = newElement.alignment;
}, { deep: true });

// Update methods - apply changes immediately to store
function updateContent() {
  templateStore.updateElement(props.element.id, { content: content.value });
}

function updateFontSize() {
  const size = Math.max(8, Math.min(120, fontSize.value));
  fontSize.value = size;
  templateStore.updateElement(props.element.id, { fontSize: size });
}

function updateColor() {
  templateStore.updateElement(props.element.id, { color: color.value });
}

function updateAlignment(align: 'left' | 'center' | 'right') {
  alignment.value = align;
  templateStore.updateElement(props.element.id, { alignment: align });
}
</script>

<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>Heading Properties</h3>
    </div>

    <div class="properties-form">
      <!-- Content -->
      <div class="property-group">
        <label for="heading-content">Content</label>
        <textarea
          id="heading-content"
          v-model="content"
          @input="updateContent"
          class="property-input textarea"
          rows="3"
          placeholder="Enter heading text..."
        />
      </div>

      <!-- Font Size -->
      <div class="property-group">
        <label for="heading-font-size">Font Size</label>
        <div class="input-with-unit">
          <input
            id="heading-font-size"
            v-model.number="fontSize"
            @input="updateFontSize"
            type="number"
            min="8"
            max="120"
            class="property-input"
          />
          <span class="unit">px</span>
        </div>
        <input
          v-model.number="fontSize"
          @input="updateFontSize"
          type="range"
          min="8"
          max="120"
          class="property-slider"
        />
      </div>

      <!-- Color -->
      <div class="property-group">
        <label for="heading-color">Text Color</label>
        <div class="color-picker-group">
          <input
            id="heading-color"
            v-model="color"
            @input="updateColor"
            type="color"
            class="color-input"
          />
          <input
            v-model="color"
            @input="updateColor"
            type="text"
            class="property-input color-text"
            placeholder="#000000"
          />
        </div>
      </div>

      <!-- Alignment -->
      <div class="property-group">
        <label>Alignment</label>
        <div class="alignment-buttons">
          <button
            :class="['alignment-btn', { active: alignment === 'left' }]"
            @click="updateAlignment('left')"
            title="Align Left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v2H2V3zm0 4h8v2H2V7zm0 4h12v2H2v-2z"/>
            </svg>
          </button>
          <button
            :class="['alignment-btn', { active: alignment === 'center' }]"
            @click="updateAlignment('center')"
            title="Align Center"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v2H2V3zm2 4h8v2H4V7zm-2 4h12v2H2v-2z"/>
            </svg>
          </button>
          <button
            :class="['alignment-btn', { active: alignment === 'right' }]"
            @click="updateAlignment('right')"
            title="Align Right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v2H2V3zm4 4h8v2H6V7zm-4 4h12v2H2v-2z"/>
            </svg>
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

.textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
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

.alignment-buttons {
  display: flex;
  gap: 0.5rem;
}

.alignment-btn {
  flex: 1;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  transition: all 0.2s;
}

.alignment-btn:hover {
  border-color: #007acc;
  color: #007acc;
}

.alignment-btn.active {
  background-color: #007acc;
  border-color: #007acc;
  color: white;
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
