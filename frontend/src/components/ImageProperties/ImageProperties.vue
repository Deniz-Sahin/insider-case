<script setup lang="ts">
import './ImageProperties.css';
import { ref } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { ImageElement } from '@/types/template.types';
import { useElementProperty } from '@/composables/useElementProperty';
import { useLayerControls } from '@/composables/useLayerControls';
import { BasePropertyPanel, PropertyGroup, LayerControls } from '@/components/BasePropertyPanel';

const props = defineProps<{
  element: ImageElement;
}>();

const templateStore = useTemplateStore();

const { property: url, updateProperty: updateUrl } = useElementProperty(
  props.element,
  'url',
  props.element.url
);

const { property: altText, updateProperty: updateAltText } = useElementProperty(
  props.element,
  'altText',
  props.element.altText
);

const imageError = ref(false);

function handleUrlChange() {
  imageError.value = false;
  updateUrl();
}

function handleAltTextChange() {
  updateAltText();
}

const { canBringForward, canSendBackward, layerPosition, totalLayers, bringForward, sendBackward } =
  useLayerControls(props.element);
</script>

<template>
  <BasePropertyPanel title="Image Properties">
    <PropertyGroup label="Image URL" html-for="image-url">
      <input
        id="image-url"
        v-model="url"
        type="text"
        class="property-input"
        placeholder="https://example.com/image.jpg"
        @input="handleUrlChange"
      />
      <p v-if="imageError" class="error-message">Failed to load image</p>
    </PropertyGroup>

    <PropertyGroup
      label="Alt Text"
      html-for="image-alt"
      help-text="Describes the image for accessibility"
    >
      <input
        id="image-alt"
        v-model="altText"
        type="text"
        class="property-input"
        placeholder="Describe the image..."
        @input="handleAltTextChange"
      />
    </PropertyGroup>

    <PropertyGroup label="Position">
      <span class="info-text">
        X: {{ Math.round(element.position.x) }}px, Y: {{ Math.round(element.position.y) }}px
      </span>
    </PropertyGroup>

    <PropertyGroup label="Size">
      <span class="info-text">
        {{ Math.round(element.size.width) }}×{{ Math.round(element.size.height) }}px
      </span>
    </PropertyGroup>

    <PropertyGroup label="Layer Order">
      <LayerControls
        :can-bring-forward="canBringForward"
        :can-send-backward="canSendBackward"
        :layer-position="layerPosition"
        :total-layers="totalLayers"
        show-position-info
        @bring-forward="bringForward"
        @send-backward="sendBackward"
      />
    </PropertyGroup>

    <button class="btn-delete-element" @click="templateStore.removeElement(element.id)">
      🗑️ Delete Element
    </button>
  </BasePropertyPanel>
</template>
