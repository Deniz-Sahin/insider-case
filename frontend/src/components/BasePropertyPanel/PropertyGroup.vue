<script setup lang="ts">
/**
 * PropertyGroup - Reusable wrapper for property form fields
 * Provides consistent spacing and label/input structure
 */
defineProps<{
  label: string;
  htmlFor?: string;
  helpText?: string;
}>();
</script>

<template>
  <div class="property-group">
    <label v-if="label" :for="htmlFor" class="property-label">
      {{ label }}
    </label>
    <slot />
    <p v-if="helpText" class="help-text">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.property-group {
  margin-bottom: 16px;
}

.property-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.help-text {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
  font-style: italic;
}
</style>
