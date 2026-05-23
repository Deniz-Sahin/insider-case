import { computed } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { TemplateElement } from '@/types/template.types';

/**
 * Composable for managing element layer (z-index) controls
 *
 * Provides methods and computed properties for controlling element stacking order:
 * - Bring Forward: Move element one layer up
 * - Send Backward: Move element one layer down
 * - Bring to Front: Move element to top layer
 * - Send to Back: Move element to bottom layer
 *
 * Also provides computed properties for checking if operations are available:
 * - canBringForward: Element is not already at the top
 * - canSendBackward: Element is not already at the bottom
 *
 * @example
 * ```ts
 * const {
 *   bringForward,
 *   sendBackward,
 *   bringToFront,
 *   sendToBack,
 *   canBringForward,
 *   canSendBackward,
 *   currentZIndex
 * } = useLayerControls(props.element);
 * ```
 */
export function useLayerControls(element: TemplateElement) {
  const templateStore = useTemplateStore();

  // Get current z-index
  const currentZIndex = computed(() => element.zIndex ?? 1);

  // Get all elements to determine layer position
  const allElements = computed(() => templateStore.currentTemplate?.elements || []);

  // Get element's current layer position (1-indexed, 1 = bottom)
  // Sort by z-index first, then by array index to ensure consistent ordering
  const layerPosition = computed(() => {
    const sortedElements = [...allElements.value].sort((a, b) => {
      const aZ = a.zIndex ?? 0;
      const bZ = b.zIndex ?? 0;
      if (aZ !== bZ) return aZ - bZ;
      // If z-indexes are equal, maintain original array order
      return allElements.value.indexOf(a) - allElements.value.indexOf(b);
    });
    return sortedElements.findIndex((el) => el.id === element.id) + 1;
  });

  // Get total number of layers
  const totalLayers = computed(() => allElements.value.length);

  // Check if element can move forward (not already at the top)
  const canBringForward = computed(() => {
    if (allElements.value.length <= 1) return false;
    return layerPosition.value < totalLayers.value;
  });

  // Check if element can move backward (not already at the bottom)
  const canSendBackward = computed(() => {
    if (allElements.value.length <= 1) return false;
    return layerPosition.value > 1;
  });

  /**
   * Move element one layer forward (increase z-index by 1)
   */
  function bringForward() {
    templateStore.bringForward(element.id);
  }

  /**
   * Move element one layer backward (decrease z-index by 1)
   */
  function sendBackward() {
    templateStore.sendBackward(element.id);
  }

  /**
   * Move element to the front (highest z-index)
   */
  function bringToFront() {
    templateStore.bringToFront(element.id);
  }

  /**
   * Move element to the back (lowest z-index)
   */
  function sendToBack() {
    templateStore.sendToBack(element.id);
  }

  return {
    // State
    currentZIndex,
    layerPosition,
    totalLayers,

    // Computed availability
    canBringForward,
    canSendBackward,

    // Actions
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  };
}

/**
 * Composable for keyboard shortcuts related to layer management
 * Can be combined with useLayerControls for complete layer control
 *
 * @example
 * ```ts
 * const { bringForward, sendBackward } = useLayerControls(element);
 * useLayerKeyboardShortcuts(element, {
 *   onBringForward: bringForward,
 *   onSendBackward: sendBackward
 * });
 * ```
 */
export function useLayerKeyboardShortcuts(
  element: TemplateElement,
  handlers: {
    onBringForward?: () => void;
    onSendBackward?: () => void;
    onBringToFront?: () => void;
    onSendToBack?: () => void;
  }
) {
  const templateStore = useTemplateStore();

  function handleKeyDown(event: KeyboardEvent) {
    // Only handle if this element is selected
    if (templateStore.selectedElement?.id !== element.id) {
      return;
    }

    // Ctrl+] or Cmd+] - Bring Forward
    if ((event.ctrlKey || event.metaKey) && event.key === ']') {
      event.preventDefault();
      handlers.onBringForward?.();
    }

    // Ctrl+[ or Cmd+[ - Send Backward
    if ((event.ctrlKey || event.metaKey) && event.key === '[') {
      event.preventDefault();
      handlers.onSendBackward?.();
    }

    // Ctrl+Shift+] or Cmd+Shift+] - Bring to Front
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === ']') {
      event.preventDefault();
      handlers.onBringToFront?.();
    }

    // Ctrl+Shift+[ or Cmd+Shift+[ - Send to Back
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '[') {
      event.preventDefault();
      handlers.onSendToBack?.();
    }
  }

  return {
    handleKeyDown,
  };
}
