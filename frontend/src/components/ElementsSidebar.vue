<script setup lang="ts">
import { ref } from 'vue';
import type { ElementType } from '@/types/template.types';

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
  { type: 'button', label: 'Divider', icon: 'minus-solid-full.svg' },
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

<style scoped>
.elements-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.elements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background-color: white;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
  user-select: none;
}

.element-item:hover {
  border-color: #007acc;
  background-color: #f0f8ff;
  transform: translateX(4px);
}

.element-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.element-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.element-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.7;
}

.element-item:hover .element-icon img {
  opacity: 1;
}

.element-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
}
</style>
