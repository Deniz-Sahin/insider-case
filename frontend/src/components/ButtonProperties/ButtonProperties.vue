<script setup lang="ts">
import './ButtonProperties.css';
import { useTemplateStore } from '@/stores/templateStore';
import type { ButtonElement } from '@/types/template.types';
import {
  useElementProperty,
  useBoundedProperty,
  useColorProperty,
} from '@/composables/useElementProperty';
import { useLayerControls } from '@/composables/useLayerControls';
import {
  BasePropertyPanel,
  PropertyGroup,
  ColorPicker,
  NumberSlider,
  LayerControls,
} from '@/components/BasePropertyPanel';

const props = defineProps<{
  element: ButtonElement;
}>();

const templateStore = useTemplateStore();

// Use composables for property management
const { property: text, updateProperty: updateText } = useElementProperty(
  props.element,
  'text',
  props.element.text
);

const { property: backgroundColor, updateProperty: updateBackgroundColor } = useColorProperty(
  props.element,
  'backgroundColor',
  props.element.backgroundColor
);

const { property: textColor, updateProperty: updateTextColor } = useColorProperty(
  props.element,
  'textColor',
  props.element.textColor
);

const { property: borderRadius, updateProperty: updateBorderRadius } = useBoundedProperty(
  props.element,
  'borderRadius',
  props.element.borderRadius,
  { min: 0, max: 50 }
);

// Use layer controls composable
const { canBringForward, canSendBackward, layerPosition, totalLayers, bringForward, sendBackward } =
  useLayerControls(props.element);
</script>

<template>
  <BasePropertyPanel title="Button Properties">
    <!-- Button Text -->
    <PropertyGroup label="Button Text" html-for="button-text">
      <input
        id="button-text"
        v-model="text"
        type="text"
        class="property-input"
        placeholder="Enter button text..."
        @input="() => updateText()"
      />
    </PropertyGroup>

    <!-- Background Color -->
    <PropertyGroup label="Background Color" html-for="button-bg-color">
      <ColorPicker
        id="button-bg-color"
        v-model="backgroundColor"
        placeholder="#007acc"
        @update:model-value="updateBackgroundColor"
      />
    </PropertyGroup>

    <!-- Text Color -->
    <PropertyGroup label="Text Color" html-for="button-text-color">
      <ColorPicker
        id="button-text-color"
        v-model="textColor"
        placeholder="#ffffff"
        @update:model-value="updateTextColor"
      />
    </PropertyGroup>

    <!-- Border Radius -->
    <PropertyGroup label="Border Radius" html-for="button-border-radius">
      <NumberSlider
        id="button-border-radius"
        v-model="borderRadius"
        :min="0"
        :max="50"
        unit="px"
        @update:model-value="updateBorderRadius"
      />
    </PropertyGroup>

    <!-- Element Info -->
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

    <!-- Layer Controls -->
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

    <!-- Delete Button -->
    <button class="btn-delete-element" @click="templateStore.removeElement(element.id)">
      🗑️ Delete Element
    </button>
  </BasePropertyPanel>
</template>
