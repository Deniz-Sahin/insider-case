<script setup lang="ts">
import './BuilderView.css';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTemplateStore } from '@/stores/templateStore';
import { v4 as uuidv4 } from 'uuid';
import ElementsSidebar from '@/components/ElementsSidebar';
import TemplateCanvas from '@/components/TemplateCanvas';
import TemplatePreview from '@/components/TemplatePreview/TemplatePreview.vue';
import HeadingProperties from '@/components/HeadingProperties';
import TextProperties from '@/components/TextProperties';
import ButtonProperties from '@/components/ButtonProperties';
import ImageProperties from '@/components/ImageProperties';
import DividerProperties from '@/components/DividerProperties';
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  CONFIRM_MESSAGES,
  INFO_MESSAGES,
  EDITOR_CONFIG,
  FILE_CONFIG,
  ROUTES,
} from '@/constants';

const router = useRouter();
const route = useRoute();
const templateStore = useTemplateStore();

const templateName = ref('Untitled Template');
const hasUnsavedChanges = ref(false);
const isPreviewOpen = ref(false);

// Watch for changes in current template
watch(
  () => templateStore.currentTemplate,
  () => {
    hasUnsavedChanges.value = true;
  },
  { deep: true }
);

onMounted(() => {
  const templateId = route.params.id as string;
  if (templateId) {
    // Load existing template
    const template = templateStore.templates.find((t) => t.id === templateId);
    if (template) {
      templateStore.setCurrentTemplate(template);
      templateName.value = template.name;
    }
  } else {
    // Create new template
    templateStore.setCurrentTemplate({
      id: '',
      name: 'Untitled Template',
      elements: [],
      canvasSize: EDITOR_CONFIG.DEFAULT_CANVAS_SIZE,
      backgroundColor: EDITOR_CONFIG.DEFAULT_BACKGROUND_COLOR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  hasUnsavedChanges.value = false;
});

const goBack = () => {
  if (hasUnsavedChanges.value) {
    if (!confirm(CONFIRM_MESSAGES.UNSAVED_CHANGES)) {
      return;
    }
  }
  router.push(ROUTES.HOME);
};

const openPreview = () => {
  isPreviewOpen.value = true;
};

const closePreview = () => {
  isPreviewOpen.value = false;
};

// Handle ESC key to close preview
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isPreviewOpen.value) {
    closePreview();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

watch(
  () => route.path,
  () => {
    document.removeEventListener('keydown', handleKeyDown);
  }
);

const saveTemplate = async () => {
  if (!templateStore.currentTemplate) return;

  try {
    const templateData = {
      id: templateStore.currentTemplate.id || undefined,
      name: templateName.value,
      elements: templateStore.currentTemplate.elements,
      canvasSize: templateStore.currentTemplate.canvasSize,
      backgroundColor: templateStore.currentTemplate.backgroundColor,
    };

    if (templateStore.currentTemplate.id) {
      await templateStore.updateTemplate(templateData);
    } else {
      await templateStore.createTemplate(templateData);
    }

    hasUnsavedChanges.value = false;
    alert(SUCCESS_MESSAGES.TEMPLATE_SAVED);
  } catch {
    alert(ERROR_MESSAGES.TEMPLATE_SAVE_FAILED);
  }
};

const exportTemplate = () => {
  if (!templateStore.currentTemplate) return;

  // Remove id from each element
  const elementsWithoutIds = templateStore.currentTemplate.elements.map((element) => {
    const { id: _id, ...elementWithoutId } = element;
    return elementWithoutId;
  });

  const templateData = {
    name: templateName.value,
    elements: elementsWithoutIds,
    canvasSize: templateStore.currentTemplate.canvasSize,
    backgroundColor: templateStore.currentTemplate.backgroundColor,
    exportedAt: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(templateData, null, 2);
  const dataBlob = new Blob([dataStr], { type: FILE_CONFIG.EXPORT_FILE_TYPE });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${templateName.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template${FILE_CONFIG.EXPORT_FILE_EXTENSION}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerImport = () => {
  fileInput.value?.click();
};

const importTemplate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      const importedData = JSON.parse(result);

      // Validate imported data
      if (!importedData.elements || !Array.isArray(importedData.elements)) {
        alert(ERROR_MESSAGES.INVALID_TEMPLATE_FILE);
        return;
      }

      // Generate new IDs for all imported elements
      const elementsWithNewIds = importedData.elements.map((element: any) => ({
        ...element,
        id: uuidv4(),
      }));

      // Set the imported template as current template
      templateStore.setCurrentTemplate({
        id: '',
        name: importedData.name || 'Imported Template',
        elements: elementsWithNewIds,
        canvasSize: importedData.canvasSize || EDITOR_CONFIG.DEFAULT_CANVAS_SIZE,
        backgroundColor: importedData.backgroundColor || EDITOR_CONFIG.DEFAULT_BACKGROUND_COLOR,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      templateName.value = importedData.name || 'Imported Template';
      hasUnsavedChanges.value = true;
      alert(SUCCESS_MESSAGES.TEMPLATE_IMPORTED);
    } catch {
      alert(ERROR_MESSAGES.TEMPLATE_IMPORT_FAILED);
    }
  };

  reader.readAsText(file);
  // Reset input so the same file can be imported again if needed
  target.value = '';
};
</script>

<template>
  <div class="builder-view">
    <header class="builder-header">
      <button class="btn-back" @click="goBack">← Back</button>
      <input
        v-model="templateName"
        class="template-name-input"
        placeholder="Template Name"
        @input="hasUnsavedChanges = true"
      />
      <div class="header-actions">
        <span v-if="hasUnsavedChanges" class="unsaved-indicator">{{
          INFO_MESSAGES.UNSAVED_CHANGES
        }}</span>
        <button class="btn-preview" title="Preview Template" @click="openPreview">
          👁️ Preview
        </button>
        <button class="btn-import" title="Import Template" @click="triggerImport">📥 Import</button>
        <button class="btn-export" title="Export Template" @click="exportTemplate">
          📤 Export
        </button>
        <button class="btn-save" @click="saveTemplate">Save Template</button>
        <input
          ref="fileInput"
          type="file"
          :accept="FILE_CONFIG.IMPORT_ACCEPT_TYPES"
          style="display: none"
          @change="importTemplate"
        />
      </div>
    </header>

    <div class="builder-content">
      <div class="sidebar">
        <ElementsSidebar />
      </div>

      <div class="canvas-container">
        <TemplateCanvas />
      </div>

      <div class="properties">
        <!-- Heading Properties -->
        <HeadingProperties
          v-if="templateStore.selectedElement?.type === 'heading'"
          :key="templateStore.selectedElement.id"
          :element="templateStore.selectedElement"
        />

        <!-- Text Properties -->
        <TextProperties
          v-else-if="templateStore.selectedElement?.type === 'text'"
          :key="templateStore.selectedElement.id"
          :element="templateStore.selectedElement"
        />

        <!-- Button Properties -->
        <ButtonProperties
          v-else-if="templateStore.selectedElement?.type === 'button'"
          :key="templateStore.selectedElement.id"
          :element="templateStore.selectedElement"
        />

        <!-- Image Properties -->
        <ImageProperties
          v-else-if="templateStore.selectedElement?.type === 'image'"
          :key="templateStore.selectedElement.id"
          :element="templateStore.selectedElement"
        />

        <!-- Divider Properties -->
        <DividerProperties
          v-else-if="templateStore.selectedElement?.type === 'divider'"
          :key="templateStore.selectedElement.id"
          :element="templateStore.selectedElement"
        />

        <!-- Empty State -->
        <div v-else class="properties-empty">
          <div class="empty-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          </div>
          <h4>No Element Selected</h4>
          <p>Click an element on the canvas to edit its properties</p>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <TemplatePreview
      v-if="templateStore.currentTemplate"
      :template="templateStore.currentTemplate"
      :is-open="isPreviewOpen"
      @close="closePreview"
    />
  </div>
</template>
