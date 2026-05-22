<script setup lang="ts">
import { ref } from 'vue';
import type { ElementType } from '@/types/template.types';
import './ElementsSidebar.css';

interface DraggableElement {
  type: ElementType;
  label: string;
  icon: string;
}

const elements = ref<DraggableElement[]>([
  { type: 'heading', label: 'Heading', icon: 'heading-solid-full.svg' },
  { type: 'text', label: 'Text', icon: 't-solid-full.svg' },
  { type: 'button', label: 'Button', icon: 'square-solid-full.svg' },
  { type: 'image', label: 'Image', icon: 'image-solid-full.svg' },
  { type: 'divider', label: 'Divider', icon: 'minus-solid-full.svg' },
]);

const onDragStart = (event: DragEvent, elementType: ElementType) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('elementType', elementType);
  }
};
</script>

<template>
  <div class="elements-sidebar">
    <h3 class="sidebar-title">Elements</h3>
    <div class="elements-list">
      <div
        v-for="element in elements"
        :key="element.type + element.label"
        class="element-item"
        draggable="true"
        @dragstart="onDragStart($event, element.type)"
      >
        <div class="element-icon">
          <img :src="`/src/assets/${element.icon}`" :alt="element.label" />
        </div>
        <span class="element-label">{{ element.label }}</span>
      </div>
    </div>
  </div>
</template>
