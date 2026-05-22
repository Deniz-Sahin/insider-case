import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Template, TemplateElement, CreateTemplateRequest } from '@/types/template.types';
import { templateApi } from '@/services/templateApi';
import { v4 as uuidv4 } from 'uuid';

export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<Template[]>([]);
  const currentTemplate = ref<Template | null>(null);
  const selectedElement = ref<TemplateElement | null>(null);
  const copiedElement = ref<TemplateElement | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Undo/Redo State
  const history = ref<Template[]>([]);
  const historyIndex = ref(-1);
  const maxHistorySize = 50;

  // Getters
  const hasTemplates = computed(() => templates.value.length > 0);
  const templateCount = computed(() => templates.value.length);
  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  // Helper function to save state to history
  function saveToHistory() {
    if (!currentTemplate.value) return;

    // Deep clone the current template
    const snapshot = JSON.parse(JSON.stringify(currentTemplate.value)) as Template;

    // Remove any states after current index (when making new change after undo)
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }

    // Add new state
    history.value.push(snapshot);

    // Limit history size
    if (history.value.length > maxHistorySize) {
      history.value.shift();
    } else {
      historyIndex.value++;
    }
  }

  // Actions
  async function fetchTemplates() {
    isLoading.value = true;
    error.value = null;
    try {
      templates.value = await templateApi.getTemplates();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch templates';
      console.error('Error fetching templates:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createTemplate(templateData: CreateTemplateRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const newTemplate = await templateApi.createTemplate(templateData);
      templates.value.push(newTemplate);
      currentTemplate.value = newTemplate;
      return newTemplate;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create template';
      console.error('Error creating template:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTemplate(templateData: CreateTemplateRequest) {
    if (!templateData.id) {
      throw new Error('Template ID is required for updates');
    }
    isLoading.value = true;
    error.value = null;
    try {
      const updatedTemplate = await templateApi.updateTemplate(templateData);
      const index = templates.value.findIndex((t) => t.id === updatedTemplate.id);
      if (index !== -1) {
        templates.value[index] = updatedTemplate;
      }
      if (currentTemplate.value?.id === updatedTemplate.id) {
        currentTemplate.value = updatedTemplate;
      }
      return updatedTemplate;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update template';
      console.error('Error updating template:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTemplate(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await templateApi.deleteTemplate(id);
      templates.value = templates.value.filter((t) => t.id !== id);
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete template';
      console.error('Error deleting template:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function setCurrentTemplate(template: Template | null) {
    currentTemplate.value = template;
    selectedElement.value = null;

    // Initialize history when setting a new template
    if (template) {
      history.value = [JSON.parse(JSON.stringify(template)) as Template];
      historyIndex.value = 0;
    } else {
      history.value = [];
      historyIndex.value = -1;
    }
  }

  function selectElement(element: TemplateElement | null) {
    selectedElement.value = element;
  }

  function addElement(element: TemplateElement) {
    if (currentTemplate.value) {
      currentTemplate.value.elements.push(element);
      saveToHistory();
    }
  }

  function updateElement(elementId: string, updates: Partial<TemplateElement>, skipHistory = false) {
    if (currentTemplate.value) {
      const index = currentTemplate.value.elements.findIndex((el) => el.id === elementId);
      if (index !== -1) {
        currentTemplate.value.elements[index] = {
          ...currentTemplate.value.elements[index],
          ...updates,
        } as TemplateElement;
        if (!skipHistory) {
          saveToHistory();
        }
      }
    }
  }

  function saveCurrentStateToHistory() {
    saveToHistory();
  }

  function removeElement(elementId: string) {
    if (currentTemplate.value) {
      currentTemplate.value.elements = currentTemplate.value.elements.filter(
        (el) => el.id !== elementId
      );
      if (selectedElement.value?.id === elementId) {
        selectedElement.value = null;
      }
      saveToHistory();
    }
  }

  function undo() {
    if (canUndo.value) {
      historyIndex.value--;
      currentTemplate.value = JSON.parse(JSON.stringify(history.value[historyIndex.value])) as Template;
      // Clear selection on undo to avoid referencing old element instances
      selectedElement.value = null;
    }
  }

  function redo() {
    if (canRedo.value) {
      historyIndex.value++;
      currentTemplate.value = JSON.parse(JSON.stringify(history.value[historyIndex.value])) as Template;
      // Clear selection on redo to avoid referencing old element instances
      selectedElement.value = null;
    }
  }

  function bringForward(elementId: string) {
    if (!currentTemplate.value) return;

    const element = currentTemplate.value.elements.find(el => el.id === elementId);
    if (!element) return;

    const currentZ = element.zIndex || 0;
    element.zIndex = currentZ + 1;

    saveToHistory();
  }

  function sendBackward(elementId: string) {
    if (!currentTemplate.value) return;

    const element = currentTemplate.value.elements.find(el => el.id === elementId);
    if (!element) return;

    const currentZ = element.zIndex || 0;
    element.zIndex = currentZ - 1;

    saveToHistory();
  }

  function bringToFront(elementId: string) {
    if (!currentTemplate.value) return;

    const element = currentTemplate.value.elements.find(el => el.id === elementId);
    if (!element) return;

    // Find max z-index
    const maxZ = Math.max(0, ...currentTemplate.value.elements.map(el => el.zIndex || 0));
    element.zIndex = maxZ + 1;

    saveToHistory();
  }

  function sendToBack(elementId: string) {
    if (!currentTemplate.value) return;

    const element = currentTemplate.value.elements.find(el => el.id === elementId);
    if (!element) return;

    // Find min z-index
    const minZ = Math.min(0, ...currentTemplate.value.elements.map(el => el.zIndex || 0));
    element.zIndex = minZ - 1;

    saveToHistory();
  }

  function copyElement() {
    if (!selectedElement.value) return;

    // Deep clone the selected element
    copiedElement.value = JSON.parse(JSON.stringify(selectedElement.value)) as TemplateElement;
  }

  function pasteElement() {
    if (!copiedElement.value || !currentTemplate.value) return;

    // Generate new UUID for the pasted element
    const newElement = JSON.parse(JSON.stringify(copiedElement.value)) as TemplateElement;
    newElement.id = uuidv4();

    // Offset position slightly so it's visible as a new element
    newElement.position.x += 20;
    newElement.position.y += 20;

    // Add to template
    currentTemplate.value.elements.push(newElement);

    // Select the new element
    selectedElement.value = newElement;

    saveToHistory();
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    templates,
    currentTemplate,
    selectedElement,
    copiedElement,
    isLoading,
    error,
    // Getters
    hasTemplates,
    templateCount,
    canUndo,
    canRedo,
    // Actions
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setCurrentTemplate,
    selectElement,
    addElement,
    updateElement,
    removeElement,
    clearError,
    undo,
    redo,
    saveCurrentStateToHistory,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    copyElement,
    pasteElement,
  };
});
