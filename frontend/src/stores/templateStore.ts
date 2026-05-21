import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Template, TemplateElement, CreateTemplateRequest } from '@/types/template.types';
import { templateApi } from '@/services/templateApi';

export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<Template[]>([]);
  const currentTemplate = ref<Template | null>(null);
  const selectedElement = ref<TemplateElement | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const hasTemplates = computed(() => templates.value.length > 0);
  const templateCount = computed(() => templates.value.length);

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
  }

  function selectElement(element: TemplateElement | null) {
    selectedElement.value = element;
  }

  function addElement(element: TemplateElement) {
    if (currentTemplate.value) {
      currentTemplate.value.elements.push(element);
    }
  }

  function updateElement(elementId: string, updates: Partial<TemplateElement>) {
    if (currentTemplate.value) {
      const index = currentTemplate.value.elements.findIndex((el) => el.id === elementId);
      if (index !== -1) {
        currentTemplate.value.elements[index] = {
          ...currentTemplate.value.elements[index],
          ...updates,
        } as TemplateElement;
      }
    }
  }

  function removeElement(elementId: string) {
    if (currentTemplate.value) {
      currentTemplate.value.elements = currentTemplate.value.elements.filter(
        (el) => el.id !== elementId
      );
      if (selectedElement.value?.id === elementId) {
        selectedElement.value = null;
      }
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    templates,
    currentTemplate,
    selectedElement,
    isLoading,
    error,
    // Getters
    hasTemplates,
    templateCount,
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
  };
});
