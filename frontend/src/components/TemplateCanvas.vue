<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { 
  TemplateElement, 
  ElementType, 
  HeadingElement, 
  TextElement, 
  ButtonElement, 
  ImageElement 
} from '@/types/template.types';

const templateStore = useTemplateStore();

// Canvas size (fixed 400x500px as specified)
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

// Refs
const canvasRef = ref<HTMLDivElement | null>(null);
const isDraggingOver = ref(false);
const draggingElement = ref<TemplateElement | null>(null);
const dragOffset = ref({ x: 0, y: 0 });
const resizeHandle = ref<string | null>(null);
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 });

// Computed
const canvasStyle = computed(() => ({
  width: `${CANVAS_WIDTH}px`,
  height: `${CANVAS_HEIGHT}px`,
  backgroundColor: templateStore.currentTemplate?.backgroundColor || '#ffffff',
}));

const elements = computed(() => templateStore.currentTemplate?.elements || []);
const selectedElementId = computed(() => templateStore.selectedElement?.id || null);

// Generate unique ID
function generateId(): string {
  return `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create default element based on type
function createDefaultElement(type: ElementType, x: number, y: number): TemplateElement {
  const baseElement = {
    id: generateId(),
    position: { x, y },
    size: { width: 200, height: 50 },
  };

  switch (type) {
    case 'heading':
      return {
        ...baseElement,
        type: 'heading',
        content: 'New Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      } as HeadingElement;

    case 'text':
      return {
        ...baseElement,
        type: 'text',
        content: 'New Text',
        fontSize: 16,
        color: '#000000',
        alignment: 'left',
      } as TextElement;

    case 'button':
      return {
        ...baseElement,
        type: 'button',
        size: { width: 150, height: 40 },
        text: 'Click Me',
        backgroundColor: '#007acc',
        textColor: '#ffffff',
        borderRadius: 8,
      } as ButtonElement;

    case 'image':
      return {
        ...baseElement,
        type: 'image',
        size: { width: 200, height: 150 },
        url: 'https://via.placeholder.com/200x150',
        altText: 'Placeholder Image',
      } as ImageElement;

    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}

// Handle drop from sidebar
function onDrop(event: DragEvent) {
  event.preventDefault();
  isDraggingOver.value = false;

  const elementType = event.dataTransfer?.getData('elementType') as ElementType;
  if (!elementType || !canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const newElement = createDefaultElement(elementType, x, y);
  templateStore.addElement(newElement);
  templateStore.selectElement(newElement);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDraggingOver.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

function onDragLeave() {
  isDraggingOver.value = false;
}

// Element selection
function selectElement(element: TemplateElement, event: MouseEvent) {
  event.stopPropagation();
  templateStore.selectElement(element);
}

function deselectElement() {
  templateStore.selectElement(null);
}

// Element dragging within canvas
function startDragElement(element: TemplateElement, event: MouseEvent) {
  event.stopPropagation();

  if (resizeHandle.value) return; // Don't start drag if resizing

  draggingElement.value = element;
  templateStore.selectElement(element);

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', stopDragElement);
}

function onDragMove(event: MouseEvent) {
  if (!draggingElement.value || !canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  let x = event.clientX - rect.left - dragOffset.value.x;
  let y = event.clientY - rect.top - dragOffset.value.y;

  // Constrain to canvas bounds
  x = Math.max(0, Math.min(x, CANVAS_WIDTH - draggingElement.value.size.width));
  y = Math.max(0, Math.min(y, CANVAS_HEIGHT - draggingElement.value.size.height));

  templateStore.updateElement(draggingElement.value.id, {
    position: { x, y },
  });
}

function stopDragElement() {
  draggingElement.value = null;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', stopDragElement);
}

// Element resizing
function startResize(element: TemplateElement, handle: string, event: MouseEvent) {
  event.stopPropagation();

  resizeHandle.value = handle;
  draggingElement.value = element;
  templateStore.selectElement(element);

  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: element.size.width,
    height: element.size.height,
  };

  document.addEventListener('mousemove', onResizeMove);
  document.addEventListener('mouseup', stopResize);
}

function onResizeMove(event: MouseEvent) {
  if (!draggingElement.value || !resizeHandle.value) return;

  const deltaX = event.clientX - resizeStart.value.x;
  const deltaY = event.clientY - resizeStart.value.y;

  let newWidth = resizeStart.value.width;
  let newHeight = resizeStart.value.height;

  if (resizeHandle.value.includes('e')) {
    newWidth = Math.max(50, resizeStart.value.width + deltaX);
  }
  if (resizeHandle.value.includes('s')) {
    newHeight = Math.max(30, resizeStart.value.height + deltaY);
  }
  if (resizeHandle.value.includes('w')) {
    newWidth = Math.max(50, resizeStart.value.width - deltaX);
  }
  if (resizeHandle.value.includes('n')) {
    newHeight = Math.max(30, resizeStart.value.height - deltaY);
  }

  // Constrain to canvas bounds
  const maxWidth = CANVAS_WIDTH - draggingElement.value.position.x;
  const maxHeight = CANVAS_HEIGHT - draggingElement.value.position.y;
  newWidth = Math.min(newWidth, maxWidth);
  newHeight = Math.min(newHeight, maxHeight);

  templateStore.updateElement(draggingElement.value.id, {
    size: { width: newWidth, height: newHeight },
  });
}

function stopResize() {
  resizeHandle.value = null;
  draggingElement.value = null;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', stopResize);
}

// Delete element
function deleteElement(event: KeyboardEvent) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (templateStore.selectedElement) {
      templateStore.removeElement(templateStore.selectedElement.id);
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', deleteElement);
});

onUnmounted(() => {
  document.removeEventListener('keydown', deleteElement);
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', stopDragElement);
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', stopResize);
});

// Element rendering styles
function getElementStyle(element: TemplateElement) {
  const baseStyle = {
    position: 'absolute' as const,
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
  };

  switch (element.type) {
    case 'heading':
      return {
        ...baseStyle,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        textAlign: element.alignment,
        fontWeight: 'bold',
      };

    case 'text':
      return {
        ...baseStyle,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        textAlign: element.alignment,
      };

    case 'button':
      return {
        ...baseStyle,
        backgroundColor: element.backgroundColor,
        color: element.textColor,
        borderRadius: `${element.borderRadius}px`,
      };

    case 'image':
      return baseStyle;

    default:
      return baseStyle;
  }
}
</script>

<template>
  <div class="canvas-wrapper">
    <div
      ref="canvasRef"
      class="canvas"
      :class="{ 'drag-over': isDraggingOver }"
      :style="canvasStyle"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @click="deselectElement"
    >
      <!-- Canvas boundary indicator -->
      <div class="canvas-boundary"></div>

      <!-- Render elements -->
      <div
        v-for="element in elements"
        :key="element.id"
        class="canvas-element"
        :class="[
          element.type,
          { selected: element.id === selectedElementId }
        ]"
        :style="getElementStyle(element)"
        @mousedown="startDragElement(element, $event)"
        @click="selectElement(element, $event)"
      >
        <!-- Heading Element -->
        <div v-if="element.type === 'heading'" class="element-content">
          {{ element.content }}
        </div>

        <!-- Text Element -->
        <div v-else-if="element.type === 'text'" class="element-content">
          {{ element.content }}
        </div>

        <!-- Button Element -->
        <button v-else-if="element.type === 'button'" class="element-content button-element">
          {{ element.text }}
        </button>

        <!-- Image Element -->
        <img
          v-else-if="element.type === 'image'"
          :src="element.url"
          :alt="element.altText"
          class="element-content image-element"
        />

        <!-- Resize Handles (only for selected element) -->
        <template v-if="element.id === selectedElementId">
          <div 
            class="resize-handle nw" 
            @mousedown="startResize(element, 'nw', $event)"
          ></div>
          <div 
            class="resize-handle ne" 
            @mousedown="startResize(element, 'ne', $event)"
          ></div>
          <div 
            class="resize-handle sw" 
            @mousedown="startResize(element, 'sw', $event)"
          ></div>
          <div 
            class="resize-handle se" 
            @mousedown="startResize(element, 'se', $event)"
          ></div>
        </template>
      </div>

      <!-- Empty state -->
      <div v-if="elements.length === 0" class="canvas-empty">
        <p>Drag elements here to start building</p>
      </div>
    </div>

    <!-- Canvas info -->
    <div class="canvas-info">
      <span>Canvas: {{ CANVAS_WIDTH }}×{{ CANVAS_HEIGHT }}px</span>
      <span>Elements: {{ elements.length }}</span>
    </div>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.canvas {
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #e1e8ed;
  transition: border-color 0.2s;
  overflow: hidden;
  flex-shrink: 0;
}

.canvas.drag-over {
  border-color: #007acc;
  background-color: #f0f8ff;
}

.canvas-boundary {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border: 1px dashed #cbd5e0;
}

.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #95a5a6;
  font-size: 1rem;
  text-align: center;
  pointer-events: none;
}

.canvas-element {
  cursor: move;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.canvas-element:hover {
  border-color: #007acc;
}

.canvas-element.selected {
  border-color: #007acc;
  outline: 2px solid rgba(0, 122, 204, 0.3);
  outline-offset: 2px;
}

.element-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.button-element {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}

.image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Resize Handles */
.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #007acc;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 10;
}

.resize-handle.nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.canvas-info {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: #7f8c8d;
}

.canvas-info span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
