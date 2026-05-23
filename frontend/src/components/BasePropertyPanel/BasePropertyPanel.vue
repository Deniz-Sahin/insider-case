<script setup lang="ts">
/**
 * BasePropertyPanel - Base component for all property panels
 * Provides consistent structure and styling with slots for custom content
 */
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="properties-form">
      <!-- Main content slot for property-specific fields -->
      <slot />

      <!-- Optional layer controls slot (shown at bottom if provided) -->
      <slot name="layerControls" />
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f9f9f9;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.properties-form {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}
</style>
