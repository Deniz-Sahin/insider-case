<script setup lang="ts">
import './TemplatesView.css';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTemplateStore } from '@/stores/templateStore';
import { CONFIRM_MESSAGES, INFO_MESSAGES, ROUTES } from '@/constants';

const router = useRouter();
const templateStore = useTemplateStore();

onMounted(() => {
  templateStore.fetchTemplates();
});

const createNewTemplate = () => {
  router.push(ROUTES.BUILDER);
};

const editTemplate = (id: string) => {
  router.push(ROUTES.BUILDER_WITH_ID(id));
};

const deleteTemplate = async (id: string) => {
  if (confirm(CONFIRM_MESSAGES.DELETE_TEMPLATE)) {
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

    <div v-if="templateStore.isLoading" class="loading">{{ INFO_MESSAGES.LOADING_TEMPLATES }}</div>

    <div v-else-if="templateStore.error" class="error">
      {{ templateStore.error }}
    </div>

    <div v-else-if="!templateStore.hasTemplates" class="empty-state">
      <h2>{{ INFO_MESSAGES.NO_TEMPLATES }}</h2>
      <p>{{ INFO_MESSAGES.NO_TEMPLATES_DESCRIPTION }}</p>
      <button class="btn-primary" @click="createNewTemplate">Create Template</button>
    </div>

    <div v-else class="templates-grid">
      <div v-for="template in templateStore.templates" :key="template.id" class="template-card">
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
