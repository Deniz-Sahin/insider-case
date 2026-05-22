<script setup lang="ts">
import './ButtonProperties.css';
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



