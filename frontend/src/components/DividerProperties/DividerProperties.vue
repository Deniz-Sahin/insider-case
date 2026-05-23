<script setup lang="ts">
import './DividerProperties.css';
import { useTemplateStore } from '@/stores/templateStore';
import type { DividerElement } from '@/types/template.types';
import { useColorProperty, useBoundedProperty } from '@/composables/useElementProperty';
import { useLayerControls } from '@/composables/useLayerControls';
import {
  BasePropertyPanel,
  PropertyGroup,
  ColorPicker,
  LayerControls,
} from '@/components/BasePropertyPanel';

const props = defineProps<{
  element: DividerElement;
}>();

const templateStore = useTemplateStore();

// Use composables for property management
const { property: color, updateProperty: updateColor } = useColorProperty(
  props.element,
  'color',
  props.element.color
);

const { property: thickness, updateProperty: _updateThickness } = useBoundedProperty(
  props.element,
  'thickness',
  props.element.thickness,
  { min: 1, max: 10 }
);

const { property: style, updateProperty: updateStyle } = useColorProperty(
  props.element,
  'style',
  props.element.style
);

// Custom update for thickness that also updates height
function handleThicknessUpdate() {
  templateStore.updateElement(props.element.id, {
    thickness: thickness.value,
    size: { ...props.element.size, height: thickness.value },
  });
}

function handleStyleChange(newStyle: 'solid' | 'dashed' | 'dotted') {
  style.value = newStyle;
  updateStyle();
}

// Use layer controls composable
const { canBringForward, canSendBackward, layerPosition, totalLayers, bringForward, sendBackward } =
  useLayerControls(props.element);
</script>

<template>
  <BasePropertyPanel title="Divider Properties">
    <!-- Color -->
    <PropertyGroup label="Line Color" html-for="divider-color">
      <ColorPicker id="divider-color" v-model="color" @update:model-value="updateColor" />
    </PropertyGroup>

    <!-- Thickness -->
    <PropertyGroup label="Thickness" html-for="divider-thickness">
      <div class="input-with-unit">
        <input
          id="divider-thickness"
          v-model.number="thickness"
          type="number"
          min="1"
          max="10"
          class="property-input"
          @input="handleThicknessUpdate"
        />
        <span class="unit">px</span>
      </div>
      <input
        v-model.number="thickness"
        type="range"
        min="1"
        max="10"
        class="property-slider"
        @input="handleThicknessUpdate"
      />
    </PropertyGroup>

    <!-- Style -->
    <PropertyGroup label="Line Style">
      <div class="style-buttons">
        <button
          :class="['style-btn', { active: style === 'solid' }]"
          @click="handleStyleChange('solid')"
        >
          <div class="style-preview solid"></div>
          Solid
        </button>
        <button
          :class="['style-btn', { active: style === 'dashed' }]"
          @click="handleStyleChange('dashed')"
        >
          <div class="style-preview dashed"></div>
          Dashed
        </button>
        <button
          :class="['style-btn', { active: style === 'dotted' }]"
          @click="handleStyleChange('dotted')"
        >
          <div class="style-preview dotted"></div>
          Dotted
        </button>
      </div>
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
