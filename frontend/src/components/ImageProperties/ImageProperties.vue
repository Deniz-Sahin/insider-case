<script setup lang="ts">
import './ImageProperties.css';
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { ImageElement } from '@/types/template.types';

const props = defineProps<{
  element: ImageElement;
}>();

const templateStore = useTemplateStore();

// Local state for form inputs
const url = ref(props.element.url);
const altText = ref(props.element.altText);
const imageError = ref(false);

// Watch for external changes (e.g., switching selection)
watch(() => props.element, (newElement) => {
  url.value = newElement.url;
  altText.value = newElement.altText;
  imageError.value = false;
}, { deep: true });

// Update methods - apply changes immediately to store
function updateUrl() {
  imageError.value = false;
  templateStore.updateElement(props.element.id, { url: url.value });
}

function updateAltText() {
  templateStore.updateElement(props.element.id, { altText: altText.value });
}

function handleImageError() {
  imageError.value = true;
}

function handleImageLoad() {
  imageError.value = false;
}

</script>

<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>Image Properties</h3>
    </div>

    <div class="properties-form">
      <!-- Image URL -->
      <div class="property-group">
        <label for="image-url">Image URL</label>
        <input
          id="image-url"
          v-model="url"
          @input="updateUrl"
          type="text"
          class="property-input"
          placeholder="https://example.com/image.jpg"
        />
        <p v-if="imageError" class="error-message">
          âš ï¸ Failed to load image. Check URL.
        </p>
      </div>

      <!-- Alt Text -->
      <div class="property-group">
        <label for="image-alt">Alt Text</label>
        <input
          id="image-alt"
          v-model="altText"
          @input="updateAltText"
          type="text"
          class="property-input"
          placeholder="Describe the image..."
        />
        <p class="help-text">
          Describes the image for accessibility
        </p>
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



