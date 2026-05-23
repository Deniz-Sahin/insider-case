<script setup lang="ts">
/**
 * LayerControls - Reusable layer (z-index) control buttons
 * Provides buttons for managing element stacking order
 */
defineProps<{
  canBringForward?: boolean;
  canSendBackward?: boolean;
  layerPosition?: number;
  totalLayers?: number;
  showPositionInfo?: boolean;
}>();

defineEmits<{
  bringForward: [];
  sendBackward: [];
}>();
</script>

<template>
  <div class="layer-controls">
    <div v-if="showPositionInfo && layerPosition && totalLayers" class="layer-info">
      Layer {{ layerPosition }} of {{ totalLayers }}
    </div>
    <div class="layer-buttons">
      <button
        class="layer-btn"
        :disabled="!canBringForward"
        title="Bring Forward (Ctrl+])"
        @click="$emit('bringForward')"
      >
        ↑ Forward
      </button>
      <button
        class="layer-btn"
        :disabled="!canSendBackward"
        title="Send Backward (Ctrl+[)"
        @click="$emit('sendBackward')"
      >
        ↓ Backward
      </button>
    </div>
  </div>
</template>

<style scoped>
.layer-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-info {
  font-size: 12px;
  color: #666;
  text-align: center;
  padding: 4px 0;
}

.layer-buttons {
  display: flex;
  gap: 8px;
}

.layer-btn {
  flex: 1;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.layer-btn:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #007acc;
}

.layer-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.layer-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
