<script setup lang="ts">
import './TemplateCanvas.css';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import { v4 as uuidv4 } from 'uuid';
import type {
  TemplateElement,
  ElementType,
  HeadingElement,
  TextElement,
  ButtonElement,
  ImageElement,
  DividerElement,
} from '@/types/template.types';

const templateStore = useTemplateStore();

// Canvas size (fixed 400x500px as specified)
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

// Grid settings
const GRID_SIZE = 10; // 10px grid
const snapToGrid = ref(false); // Grid snap toggle

// Refs
const canvasRef = ref<HTMLDivElement | null>(null);
const isDraggingOver = ref(false);
const draggingElement = ref<TemplateElement | null>(null);
const dragOffset = ref({ x: 0, y: 0 });
const resizeHandle = ref<string | null>(null);
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 });
const initialDragPosition = ref<{ x: number; y: number } | null>(null);
const initialResizeSize = ref<{ width: number; height: number } | null>(null);
const isNudging = ref(false);
const nudgeStartPosition = ref<{ x: number; y: number } | null>(null);

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
  return uuidv4();
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

    case 'divider':
      return {
        ...baseElement,
        type: 'divider',
        size: { width: 300, height: 2 },
        color: '#e1e8ed',
        thickness: 2,
        style: 'solid',
      } as DividerElement;

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

// Helper function to snap coordinates to grid
function snapToGridFn(value: number): number {
  if (!snapToGrid.value) return value;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
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
  event.preventDefault();
  event.stopPropagation();

  if (resizeHandle.value) return; // Don't start drag if resizing

  draggingElement.value = element;
  templateStore.selectElement(element);

  // Store initial position for comparison later
  initialDragPosition.value = { ...element.position };

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

  // Snap to grid if enabled
  x = snapToGridFn(x);
  y = snapToGridFn(y);

  // Constrain to canvas bounds
  x = Math.max(0, Math.min(x, CANVAS_WIDTH - draggingElement.value.size.width));
  y = Math.max(0, Math.min(y, CANVAS_HEIGHT - draggingElement.value.size.height));

  // Update position without saving to history during drag
  templateStore.updateElement(
    draggingElement.value.id,
    {
      position: { x, y },
    },
    true
  );
}

function stopDragElement(_event?: MouseEvent) {
  const element = draggingElement.value;
  const initialPos = initialDragPosition.value;

  // Remove listeners first to prevent multiple calls
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', stopDragElement);

  draggingElement.value = null;
  initialDragPosition.value = null;

  // Only save to history if position actually changed
  if (element && initialPos && templateStore.currentTemplate) {
    const currentElement = templateStore.currentTemplate.elements.find(
      (el) => el.id === element.id
    );
    if (
      currentElement &&
      (currentElement.position.x !== initialPos.x || currentElement.position.y !== initialPos.y)
    ) {
      console.log(
        'Drag complete - saving history. From:',
        initialPos,
        'To:',
        currentElement.position
      );
      templateStore.saveCurrentStateToHistory();
    } else {
      console.log('Drag complete - NO CHANGE, skipping history');
    }
  }
}

// Element resizing
function startResize(element: TemplateElement, handle: string, event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  resizeHandle.value = handle;
  draggingElement.value = element;
  templateStore.selectElement(element);

  // Store initial size for comparison later
  initialResizeSize.value = { ...element.size };

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

  // Update size without saving to history during resize
  templateStore.updateElement(
    draggingElement.value.id,
    {
      size: { width: newWidth, height: newHeight },
    },
    true
  );
}

function stopResize() {
  const element = draggingElement.value;
  const initialSize = initialResizeSize.value;

  resizeHandle.value = null;
  draggingElement.value = null;
  initialResizeSize.value = null;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', stopResize);

  // Only save to history if size actually changed
  if (element && initialSize && templateStore.currentTemplate) {
    const currentElement = templateStore.currentTemplate.elements.find(
      (el) => el.id === element.id
    );
    if (
      currentElement &&
      (currentElement.size.width !== initialSize.width ||
        currentElement.size.height !== initialSize.height)
    ) {
      templateStore.saveCurrentStateToHistory();
    }
  }
}

// Undo/Redo keyboard shortcuts
function handleKeyboardShortcuts(event: KeyboardEvent) {
  // Check if user is typing in an input/textarea/contenteditable
  const target = event.target as HTMLElement;
  const isTyping =
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

  // Check for Ctrl+Z (Undo)
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    templateStore.undo();
  }
  // Check for Ctrl+Y (Redo) or Ctrl+Shift+Z (Redo)
  else if (
    ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
  ) {
    event.preventDefault();
    templateStore.redo();
  }
  // Check for Ctrl+C (Copy)
  else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    if (templateStore.selectedElement) {
      event.preventDefault();
      templateStore.copyElement();
    }
  }
  // Check for Ctrl+V (Paste)
  else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    if (templateStore.copiedElement) {
      event.preventDefault();
      templateStore.pasteElement();
    }
  }
  // Delete/Backspace - only if not typing in a field
  else if (event.key === 'Delete' || event.key === 'Backspace') {
    if (!isTyping && templateStore.selectedElement) {
      event.preventDefault();
      templateStore.removeElement(templateStore.selectedElement.id);
    }
  }
  // Arrow keys for nudging - only if not typing in a field
  else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    if (!isTyping && templateStore.selectedElement) {
      event.preventDefault();
      nudgeElement(event.key, event.shiftKey);
    }
  }
}

// Nudge element with arrow keys
function nudgeElement(key: string, shiftKey: boolean) {
  if (!templateStore.selectedElement || !templateStore.currentTemplate) return;

  // Get fresh element reference by ID
  const elementId = templateStore.selectedElement.id;
  const element = templateStore.currentTemplate.elements.find((el) => el.id === elementId);
  if (!element) return;

  // Store initial position on first nudge
  if (!isNudging.value) {
    isNudging.value = true;
    nudgeStartPosition.value = { ...element.position };
  }

  // If grid snap is enabled, use grid size for nudging
  const nudgeAmount = snapToGrid.value ? GRID_SIZE : shiftKey ? 10 : 1;
  let newX = element.position.x;
  let newY = element.position.y;

  switch (key) {
    case 'ArrowUp':
      newY = Math.max(0, newY - nudgeAmount);
      break;
    case 'ArrowDown':
      newY = Math.min(CANVAS_HEIGHT - element.size.height, newY + nudgeAmount);
      break;
    case 'ArrowLeft':
      newX = Math.max(0, newX - nudgeAmount);
      break;
    case 'ArrowRight':
      newX = Math.min(CANVAS_WIDTH - element.size.width, newX + nudgeAmount);
      break;
  }

  // Update without saving to history (skipHistory = true)
  templateStore.updateElement(
    elementId,
    {
      position: { x: newX, y: newY },
    },
    true
  );
}

// Handle key release to save nudge to history
function handleKeyUp(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    if (
      isNudging.value &&
      nudgeStartPosition.value &&
      templateStore.selectedElement &&
      templateStore.currentTemplate
    ) {
      // Get fresh element reference by ID
      const elementId = templateStore.selectedElement.id;
      const currentElement = templateStore.currentTemplate.elements.find(
        (el) => el.id === elementId
      );

      if (currentElement) {
        const currentPos = currentElement.position;
        const startPos = nudgeStartPosition.value;

        // Only save to history if position actually changed
        if (currentPos.x !== startPos.x || currentPos.y !== startPos.y) {
          templateStore.saveCurrentStateToHistory();
        }
      }

      isNudging.value = false;
      nudgeStartPosition.value = null;
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcuts);
  document.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts);
  document.removeEventListener('keyup', handleKeyUp);
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
    zIndex: Math.max(1, element.zIndex || 1),
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
      return baseStyle;

    case 'image':
      return baseStyle;

    case 'divider':
      return {
        ...baseStyle,
        borderTop: `${element.thickness}px ${element.style} ${element.color}`,
        height: `${element.thickness}px`,
      };

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

      <!-- Grid overlay (when enabled) -->
      <div v-if="snapToGrid" class="grid-overlay"></div>

      <!-- Render elements -->
      <div
        v-for="element in elements"
        :key="element.id"
        class="canvas-element"
        :class="[element.type, { selected: element.id === selectedElementId }]"
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
        <div
          v-else-if="element.type === 'button'"
          class="element-content button-element"
          :style="{
            backgroundColor: element.backgroundColor,
            color: element.textColor,
            borderRadius: `${element.borderRadius}px`,
          }"
        >
          {{ element.text }}
        </div>

        <!-- Image Element -->
        <img
          v-else-if="element.type === 'image'"
          :src="element.url"
          :alt="element.altText"
          class="element-content image-element"
        />

        <!-- Divider Element -->
        <div v-else-if="element.type === 'divider'" class="element-content divider-element"></div>

        <!-- Resize Handles (only for selected element) -->
        <template v-if="element.id === selectedElementId">
          <div class="resize-handle nw" @mousedown="startResize(element, 'nw', $event)"></div>
          <div class="resize-handle ne" @mousedown="startResize(element, 'ne', $event)"></div>
          <div class="resize-handle sw" @mousedown="startResize(element, 'sw', $event)"></div>
          <div class="resize-handle se" @mousedown="startResize(element, 'se', $event)"></div>
        </template>
      </div>

      <!-- Empty state -->
      <div v-if="elements.length === 0" class="canvas-empty">
        <p>Drag elements here to start building</p>
      </div>
    </div>

    <!-- Undo/Redo Controls -->
    <div class="canvas-controls">
      <button
        class="control-btn"
        :class="{ active: snapToGrid }"
        title="Toggle Grid Snap (10px)"
        @click="snapToGrid = !snapToGrid"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        Grid {{ snapToGrid ? 'ON' : 'OFF' }}
      </button>
      <button
        class="control-btn"
        :disabled="!templateStore.canUndo"
        title="Undo (Ctrl+Z)"
        @click="templateStore.undo()"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
        </svg>
        Undo
      </button>
      <button
        class="control-btn"
        :disabled="!templateStore.canRedo"
        title="Redo (Ctrl+Y)"
        @click="templateStore.redo()"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
        </svg>
        Redo
      </button>
    </div>

    <!-- Canvas info -->
    <div class="canvas-info">
      <span>Canvas: {{ CANVAS_WIDTH }}-{{ CANVAS_HEIGHT }}px</span>
      <span>Elements: {{ elements.length }}</span>
    </div>
  </div>
</template>
