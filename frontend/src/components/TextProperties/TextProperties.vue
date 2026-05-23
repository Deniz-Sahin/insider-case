<script setup lang="ts">
import './TextProperties.css';
import { ref } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { TextElement } from '@/types/template.types';
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
  element: TextElement;
}>();

const templateStore = useTemplateStore();

// Use composables for property management
const { property: content, updateProperty: updateContent } = useElementProperty(
  props.element,
  'content',
  props.element.content
);

const { property: fontSize, updateProperty: updateFontSize } = useBoundedProperty(
  props.element,
  'fontSize',
  props.element.fontSize,
  { min: 8, max: 72 }
);

const { property: color, updateProperty: updateColor } = useColorProperty(
  props.element,
  'color',
  props.element.color
);

const alignment = ref(props.element.alignment);

function updateAlignment(align: 'left' | 'center' | 'right') {
  alignment.value = align;
  templateStore.updateElement(props.element.id, { alignment: align });
}

// Use layer controls composable
const { canBringForward, canSendBackward, layerPosition, totalLayers, bringForward, sendBackward } =
  useLayerControls(props.element);
</script>

<template>
  <BasePropertyPanel title="Text Properties">
    <!-- Content -->
    <PropertyGroup label="Content" html-for="text-content">
      <textarea
        id="text-content"
        v-model="content"
        class="property-input textarea"
        rows="4"
        placeholder="Enter text content..."
        @input="() => updateContent()"
      />
    </PropertyGroup>

    <!-- Font Size -->
    <PropertyGroup label="Font Size" html-for="text-font-size">
      <NumberSlider
        id="text-font-size"
        v-model="fontSize"
        :min="8"
        :max="72"
        unit="px"
        @update:model-value="updateFontSize"
      />
    </PropertyGroup>

    <!-- Color -->
    <PropertyGroup label="Text Color" html-for="text-color">
      <ColorPicker id="text-color" v-model="color" @update:model-value="updateColor" />
    </PropertyGroup>

    <!-- Alignment -->
    <PropertyGroup label="Alignment">
      <div class="alignment-buttons">
        <button
          :class="['alignment-btn', { active: alignment === 'left' }]"
          title="Align Left"
          @click="updateAlignment('left')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3h12v2H2V3zm0 4h8v2H2V7zm0 4h12v2H2v-2z" />
          </svg>
        </button>
        <button
          :class="['alignment-btn', { active: alignment === 'center' }]"
          title="Align Center"
          @click="updateAlignment('center')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3h12v2H2V3zm2 4h8v2H4V7zm-2 4h12v2H2v-2z" />
          </svg>
        </button>
        <button
          :class="['alignment-btn', { active: alignment === 'right' }]"
          title="Align Right"
          @click="updateAlignment('right')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3h12v2H2V3zm4 4h8v2H6V7zm-4 4h12v2H2v-2z" />
          </svg>
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
