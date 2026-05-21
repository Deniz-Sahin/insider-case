<script setup lang="ts">
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
        <div class="template-preview" :style="{ backgroundColor: template.backgroundColor }">
          <div class="element-count">{{ template.elements.length }} elements</div>
        </div>
        <div class="template-info">
          <h3>{{ template.name }}</h3>
          <p class="template-meta">
            {{ new Date(template.updatedAt).toLocaleDateString() }}
          </p>
        </div>
        <div class="template-actions">
          <button class="btn-edit" @click="editTemplate(template.id)">Edit</button>
          <button class="btn-delete" @click="deleteTemplate(template.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.templates-view {
  min-height: 100vh;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #2c3e50;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #005a9e;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
}

.template-card {
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.template-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #e1e8ed;
}

.element-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.template-info {
  padding: 1rem;
}

.template-info h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.template-meta {
  font-size: 0.875rem;
  color: #95a5a6;
}

.template-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e1e8ed;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #f0f0f0;
  color: #2c3e50;
}

.btn-edit:hover {
  background-color: #e0e0e0;
}

.btn-delete {
  background-color: #fee;
  color: #e74c3c;
}

.btn-delete:hover {
  background-color: #fdd;
}
</style>
