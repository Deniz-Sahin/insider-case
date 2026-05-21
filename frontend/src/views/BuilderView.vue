<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTemplateStore } from '@/stores/templateStore';
import ElementsSidebar from '@/components/ElementsSidebar.vue';
import TemplateCanvas from '@/components/TemplateCanvas.vue';
import HeadingProperties from '@/components/HeadingProperties.vue';
import TextProperties from '@/components/TextProperties.vue';
import ButtonProperties from '@/components/ButtonProperties.vue';
import ImageProperties from '@/components/ImageProperties.vue';

const router = useRouter();
const route = useRoute();
const templateStore = useTemplateStore();

const templateName = ref('Untitled Template');
const hasUnsavedChanges = ref(false);

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
      canvasSize: { width: 400, height: 500 },
      backgroundColor: '#ffffff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  hasUnsavedChanges.value = false;
});

const goBack = () => {
  if (hasUnsavedChanges.value) {
    if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
  }
  router.push('/');
};

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
    alert('Template saved successfully!');
  } catch (error) {
    alert('Failed to save template. Please try again.');
  }
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
        <span v-if="hasUnsavedChanges" class="unsaved-indicator">● Unsaved changes</span>
        <button class="btn-save" @click="saveTemplate">Save Template</button>
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
          :element="templateStore.selectedElement"
        />

        <!-- Text Properties -->
        <TextProperties 
          v-else-if="templateStore.selectedElement?.type === 'text'"
          :element="templateStore.selectedElement"
        />

        <!-- Button Properties -->
        <ButtonProperties 
          v-else-if="templateStore.selectedElement?.type === 'button'"
          :element="templateStore.selectedElement"
        />

        <!-- Image Properties -->
        <ImageProperties 
          v-else-if="templateStore.selectedElement?.type === 'image'"
          :element="templateStore.selectedElement"
        />

        <!-- Empty State -->
        <div v-else class="properties-empty">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
          </div>
          <h4>No Element Selected</h4>
          <p>Click an element on the canvas to edit its properties</p>
        </div>

        <!-- Delete Button (shown for any selected element) -->
        <button 
          v-if="templateStore.selectedElement"
          class="btn-delete-element" 
          @click="templateStore.removeElement(templateStore.selectedElement.id)"
        >
          🗑️ Delete Element
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.builder-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e1e8ed;
}

.btn-back {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: #f0f0f0;
}

.template-name-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.unsaved-indicator {
  font-size: 0.875rem;
  color: #e74c3c;
  font-weight: 500;
}

.btn-save {
  padding: 0.5rem 1.5rem;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: #005a9e;
}

.builder-content {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  flex: 1;
  overflow: hidden;
}

.sidebar,
.properties {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-right: 1px solid #e1e8ed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.properties {
  border-right: none;
  border-left: 1px solid #e1e8ed;
}

.properties-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
  flex: 1;
}

.empty-icon {
  color: #cbd5e0;
}

.properties-empty h4 {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
}

.properties-empty p {
  font-size: 0.875rem;
  color: #95a5a6;
  margin: 0;
}

.btn-delete-element {
  margin-top: auto;
  padding: 0.75rem 1rem;
  background-color: #fee;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-element:hover {
  background-color: #fdd;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
}

.canvas-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  overflow: auto;
}
</style>
