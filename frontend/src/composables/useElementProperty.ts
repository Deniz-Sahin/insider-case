import { ref, watch, type Ref } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { TemplateElement } from '@/types/template.types';

/**
 * Composable for managing element property state with automatic sync to store
 *
 * This composable handles the common pattern of:
 * 1. Creating local reactive state from element props
 * 2. Watching for external changes to props
 * 3. Updating the store when local state changes
 *
 * @example
 * ```ts
 * const { property: content, updateProperty: updateContent } = useElementProperty(
 *   props.element,
 *   'content',
 *   props.element.content
 * );
 * ```
 */
export function useElementProperty<T extends TemplateElement, K extends keyof T>(
  element: T,
  propertyKey: K,
  initialValue: T[K]
) {
  const templateStore = useTemplateStore();
  const property = ref(initialValue) as Ref<T[K]>;

  // Watch for external changes (e.g., switching selection, undo/redo)
  watch(
    () => element[propertyKey],
    (newValue) => {
      property.value = newValue;
    }
  );

  // Update store with new value
  function updateProperty(value?: T[K]) {
    const newValue = value !== undefined ? value : property.value;
    property.value = newValue;
    const update = { [propertyKey]: newValue };
    templateStore.updateElement(element.id, update as unknown as Partial<T>);
  }

  return {
    property,
    updateProperty,
  };
}

/**
 * Composable for managing multiple element properties at once
 * Useful when you need to manage several properties from the same element
 *
 * @example
 * ```ts
 * const properties = useElementProperties(props.element, {
 *   content: props.element.content,
 *   fontSize: props.element.fontSize,
 *   color: props.element.color
 * });
 *
 * // Access: properties.content.value
 * // Update: properties.updateContent(newValue)
 * ```
 */
export function useElementProperties<T extends TemplateElement>(
  element: T,
  initialValues: Partial<Record<keyof T, T[keyof T]>>
) {
  const templateStore = useTemplateStore();
  const properties: Record<string, Ref<any>> = {};
  const updaters: Record<string, (value?: any) => void> = {};

  // Create refs and updaters for each property
  Object.entries(initialValues).forEach(([key, value]) => {
    const propKey = key as keyof T;
    properties[key] = ref(value);

    updaters[`update${key.charAt(0).toUpperCase()}${key.slice(1)}`] = (newValue?: any) => {
      const valueToSet = newValue !== undefined ? newValue : properties[key]?.value;
      if (properties[key]) {
        properties[key].value = valueToSet;
      }
      const update = { [propKey]: valueToSet };
      templateStore.updateElement(element.id, update as unknown as Partial<T>);
    };
  });

  // Watch the entire element for deep changes
  watch(
    () => element,
    (newElement) => {
      Object.keys(initialValues).forEach((key) => {
        const propKey = key as keyof T;
        if (properties[key]) {
          properties[key].value = newElement[propKey];
        }
      });
    },
    { deep: true }
  );

  return {
    ...properties,
    ...updaters,
  };
}

/**
 * Composable for managing bounded numeric properties (with min/max constraints)
 * Common for font sizes, border radius, opacity, etc.
 *
 * @example
 * ```ts
 * const { property: fontSize, updateProperty: updateFontSize } = useBoundedProperty(
 *   props.element,
 *   'fontSize',
 *   props.element.fontSize,
 *   { min: 8, max: 120 }
 * );
 * ```
 */
export function useBoundedProperty<T extends TemplateElement, K extends keyof T>(
  element: T,
  propertyKey: K,
  initialValue: T[K],
  bounds: { min: number; max: number }
) {
  const { property, updateProperty: baseUpdate } = useElementProperty(
    element,
    propertyKey,
    initialValue
  );

  function updateProperty(value?: T[K]) {
    const numValue = value !== undefined ? Number(value) : Number(property.value);
    const boundedValue = Math.max(bounds.min, Math.min(bounds.max, numValue)) as T[K];
    property.value = boundedValue;
    baseUpdate(boundedValue);
  }

  return {
    property,
    updateProperty,
    bounds,
  };
}

/**
 * Composable for managing color properties
 * Ensures color values are valid hex colors
 *
 * @example
 * ```ts
 * const { property: color, updateProperty: updateColor } = useColorProperty(
 *   props.element,
 *   'color',
 *   props.element.color
 * );
 * ```
 */
export function useColorProperty<T extends TemplateElement, K extends keyof T>(
  element: T,
  propertyKey: K,
  initialValue: T[K]
) {
  const { property, updateProperty: baseUpdate } = useElementProperty(
    element,
    propertyKey,
    initialValue
  );

  function updateProperty(value?: T[K]) {
    const colorValue = value !== undefined ? value : property.value;
    // Basic hex color validation
    if (typeof colorValue === 'string' && /^#[0-9A-Fa-f]{6}$/.test(colorValue)) {
      property.value = colorValue;
      baseUpdate(colorValue);
    } else if (typeof colorValue === 'string') {
      // If not a valid hex, try to set it anyway (browser might handle it)
      property.value = colorValue;
      baseUpdate(colorValue);
    }
  }

  return {
    property,
    updateProperty,
  };
}
