<script setup lang="ts">
import './TemplatesView.css';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTemplateStore } from '@/stores/templateStore';

const router = useRouter();
const templateStore = useTemplateStore();

onMounted(() => {
  templateStore.fetchTemplates();
});

const createNewTemplate = () => {
  router.push('/builder');
};

const editTemplate = (id: string) => {
  router.push(`/builder/${id}`);
};

const deleteTemplate = async (id: string) => {
  if (confirm('Are you sure you want to delete this template?')) {
    await templateStore.deleteTemplate(id);
  }
};
</script>

<template>
  <div class="templates-view">
    <header class="header">
      <h1>Popup Template Builder</h1>
      <button class="btn-primary" @click="createNewTemplate">
        <span>+</span> Create New Template
      </button>
    </header>

    <div v-if="templateStore.isLoading" class="loading">Loading templates...</div>

    <div v-else-if="templateStore.error" class="error">
      {{ templateStore.error }}
    </div>

    <div v-else-if="!templateStore.hasTemplates" class="empty-state">
      <h2>No templates yet</h2>
      <p>Create your first popup template to get started</p>
      <button class="btn-primary" @click="createNewTemplate">Create Template</button>
    </div>

    <div v-else class="templates-grid">
      <div
        v-for="template in templateStore.templates"
        :key="template.id"
        class="template-card"
      >
        <div class="template-info">
          <h3>{{ template.name }}</h3>
          <div class="template-meta">
            <span class="meta-date">{{ new Date(template.updatedAt).toLocaleDateString() }}</span>
            <span class="meta-separator">•</span>
            <span class="meta-elements">{{ template.elements.length }} elements</span>
          </div>
        </div>
        <div class="template-actions">
          <button class="btn-edit" @click="editTemplate(template.id)">Edit</button>
          <button class="btn-delete" @click="deleteTemplate(template.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>



