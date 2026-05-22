<script setup lang="ts">
import './DividerProperties.css';
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { DividerElement } from '@/types/template.types';

const props = defineProps<{
  element: DividerElement;
}>();

const templateStore = useTemplateStore();

// Local state for form inputs
const color = ref(props.element.color);
const thickness = ref(props.element.thickness);
const style = ref(props.element.style);

// Watch for external changes (e.g., switching selection)
watch(() => props.element, (newElement) => {
  color.value = newElement.color;
  thickness.value = newElement.thickness;
  style.value = newElement.style;
}, { deep: true });

// Update methods - apply changes immediately to store
function updateColor() {
  templateStore.updateElement(props.element.id, { color: color.value });
}

function updateThickness() {
  const size = Math.max(1, Math.min(10, thickness.value));
  thickness.value = size;
  templateStore.updateElement(props.element.id, { 
    thickness: size,
    size: { ...props.element.size, height: size }
  });
}

function updateStyle(newStyle: 'solid' | 'dashed' | 'dotted') {
  style.value = newStyle;
  templateStore.updateElement(props.element.id, { style: newStyle });
}
</script>

<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>Divider Properties</h3>
    </div>

    <div class="properties-form">
      <!-- Color -->
      <div class="property-group">
        <label for="divider-color">Line Color</label>
        <div class="color-picker-group">
          <input
            id="divider-color"
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
            placeholder="#e1e8ed"
          />
        </div>
      </div>

      <!-- Thickness -->
      <div class="property-group">
        <label for="divider-thickness">Thickness</label>
        <div class="input-with-unit">
          <input
            id="divider-thickness"
            v-model.number="thickness"
            @input="updateThickness"
            type="number"
            min="1"
            max="10"
            class="property-input"
          />
          <span class="unit">px</span>
        </div>
        <input
          v-model.number="thickness"
          @input="updateThickness"
          type="range"
          min="1"
          max="10"
          class="property-slider"
        />
      </div>

      <!-- Style -->
      <div class="property-group">
        <label>Line Style</label>
        <div class="style-buttons">
          <button
            :class="['style-btn', { active: style === 'solid' }]"
            @click="updateStyle('solid')"
          >
            <div class="style-preview solid"></div>
            Solid
          </button>
          <button
            :class="['style-btn', { active: style === 'dashed' }]"
            @click="updateStyle('dashed')"
          >
            <div class="style-preview dashed"></div>
            Dashed
          </button>
          <button
            :class="['style-btn', { active: style === 'dotted' }]"
            @click="updateStyle('dotted')"
          >
            <div class="style-preview dotted"></div>
            Dotted
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

      <!-- Z-Index Controls -->
      <div class="property-group">
        <label>Layer Order</label>
        <div class="layer-controls">
          <button
            class="layer-btn"
            @click="templateStore.bringForward(element.id)"
            title="Bring Forward"
          >
            ↑ Forward
          </button>
          <button
            class="layer-btn"
            @click="templateStore.sendBackward(element.id)"
            title="Send Backward"
          >
            ↓ Backward
          </button>
        </div>
        <span class="info-text" style="margin-top: 8px; display: block;">
          Z-Index: {{ element.zIndex || 0 }}
        </span>
      </div>
    </div>

    <!-- Delete Button -->
    <button 
      class="btn-delete-element" 
      @click="templateStore.removeElement(element.id)"
    >
      🗑️ Delete Element
    </button>
  </div>
</template>
