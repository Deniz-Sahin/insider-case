<script setup lang="ts">
import './TextProperties.css';
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { TextElement } from '@/types/template.types';

const props = defineProps<{
  element: TextElement;
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
  const size = Math.max(8, Math.min(72, fontSize.value));
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
      <h3>Text Properties</h3>
    </div>

    <div class="properties-form">
      <!-- Content -->
      <div class="property-group">
        <label for="text-content">Content</label>
        <textarea
          id="text-content"
          v-model="content"
          @input="updateContent"
          class="property-input textarea"
          rows="4"
          placeholder="Enter text content..."
        />
      </div>

      <!-- Font Size -->
      <div class="property-group">
        <label for="text-font-size">Font Size</label>
        <div class="input-with-unit">
          <input
            id="text-font-size"
            v-model.number="fontSize"
            @input="updateFontSize"
            type="number"
            min="8"
            max="72"
            class="property-input"
          />
          <span class="unit">px</span>
        </div>
        <input
          v-model.number="fontSize"
          @input="updateFontSize"
          type="range"
          min="8"
          max="72"
          class="property-slider"
        />
      </div>

      <!-- Color -->
      <div class="property-group">
        <label for="text-color">Text Color</label>
        <div class="color-picker-group">
          <input
            id="text-color"
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



