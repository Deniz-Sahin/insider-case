<script setup lang="ts">
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

// Preset placeholder images
const presetImages = [
  { name: '300x200', url: 'https://via.placeholder.com/300x200' },
  { name: '400x300', url: 'https://via.placeholder.com/400x300' },
  { name: '500x400', url: 'https://via.placeholder.com/500x400' },
  { name: 'Landscape', url: 'https://via.placeholder.com/600x400?text=Landscape' },
  { name: 'Portrait', url: 'https://via.placeholder.com/400x600?text=Portrait' },
  { name: 'Square', url: 'https://via.placeholder.com/500x500?text=Square' },
];

function applyPresetImage(presetUrl: string) {
  url.value = presetUrl;
  updateUrl();
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
          ⚠️ Failed to load image. Check URL.
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

      <!-- Preset Images -->
      <div class="property-group">
        <label>Quick Placeholders</label>
        <div class="preset-images">
          <button
            v-for="preset in presetImages"
            :key="preset.url"
            class="preset-image-btn"
            @click="applyPresetImage(preset.url)"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div class="property-group">
        <label>Preview</label>
        <div class="image-preview">
          <img
            v-if="url && !imageError"
            :src="url"
            :alt="altText || 'Preview'"
            @error="handleImageError"
            @load="handleImageLoad"
            class="preview-image"
          />
          <div v-else class="preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
              <polyline points="21 15 16 10 5 21" stroke-width="2"/>
            </svg>
            <p>{{ imageError ? 'Failed to load' : 'No image' }}</p>
          </div>
        </div>
      </div>

      <!-- Image Tips -->
      <div class="property-group tips">
        <label>💡 Tips</label>
        <ul class="tips-list">
          <li>Use HTTPS URLs for security</li>
          <li>Optimize images for web (use compressed formats)</li>
          <li>Always provide descriptive alt text</li>
          <li>Test the URL before using</li>
        </ul>
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

.error-message {
  font-size: 0.8rem;
  color: #e74c3c;
  margin: 0;
  padding: 0.5rem;
  background-color: #fee;
  border-radius: 4px;
}

.help-text {
  font-size: 0.8rem;
  color: #95a5a6;
  margin: 0;
  font-style: italic;
}

.preset-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.preset-image-btn {
  padding: 0.5rem;
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  color: #2c3e50;
  font-weight: 500;
}

.preset-image-btn:hover {
  border-color: #007acc;
  color: #007acc;
  background-color: #f0f8ff;
}

.image-preview {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #95a5a6;
}

.preview-placeholder svg {
  opacity: 0.5;
}

.preview-placeholder p {
  font-size: 0.875rem;
  margin: 0;
}

.property-group.tips {
  background-color: #fff9e6;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ffe066;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.tips-list li {
  margin-bottom: 0.25rem;
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
