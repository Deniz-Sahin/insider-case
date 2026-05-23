<script setup lang="ts">
import './TemplatePreview.css';
import { computed } from 'vue';
import type { Template, TemplateElement } from '@/types/template.types';

interface Props {
  template: Template;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const elements = computed(() => props.template.elements || []);

function getElementStyle(element: TemplateElement) {
  const baseStyle = {
    position: 'absolute' as const,
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
    zIndex: element.zIndex || 1,
  };

  switch (element.type) {
    case 'heading':
      return {
        ...baseStyle,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        textAlign: element.alignment,
        fontWeight: 'bold',
        lineHeight: '1.2',
      };

    case 'text':
      return {
        ...baseStyle,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        textAlign: element.alignment,
        lineHeight: '1.5',
      };

    case 'button':
      return {
        ...baseStyle,
        backgroundColor: element.backgroundColor,
        color: element.textColor,
        borderRadius: `${element.borderRadius}px`,
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

    case 'image':
      return baseStyle;

    case 'divider':
      return {
        ...baseStyle,
        borderTop: `${element.thickness}px ${element.style} ${element.color}`,
        height: `${element.thickness}px`,
      };

    default:
      return baseStyle;
  }
}

function handleOverlayClick(event: MouseEvent) {
  // Only close if clicking the overlay itself, not the popup content
  if (event.target === event.currentTarget) {
    emit('close');
  }
}

function handleButtonClick(element: TemplateElement) {
  if (element.type === 'button') {
    console.log('Button clicked:', element.text);
    // In a real implementation, this would trigger the configured action
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="preview-fade">
      <div v-if="isOpen" class="preview-overlay" @click="handleOverlayClick">
        <div class="preview-container">
          <!-- Close button -->
          <button class="preview-close" title="Close Preview (Esc)" @click="emit('close')">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Preview header -->
          <div class="preview-header">
            <h3>Template Preview</h3>
            <p>This is how end-users will see the popup</p>
          </div>

          <!-- Popup preview -->
          <div class="preview-popup-wrapper">
            <div
              class="preview-popup"
              :style="{
                width: `${template.canvasSize.width}px`,
                height: `${template.canvasSize.height}px`,
                backgroundColor: template.backgroundColor,
              }"
            >
              <!-- Render elements -->
              <div
                v-for="element in elements"
                :key="element.id"
                class="preview-element"
                :class="element.type"
                :style="getElementStyle(element)"
                @click="element.type === 'button' ? handleButtonClick(element) : null"
              >
                <!-- Heading Element -->
                <div v-if="element.type === 'heading'">
                  {{ element.content }}
                </div>

                <!-- Text Element -->
                <div v-else-if="element.type === 'text'">
                  {{ element.content }}
                </div>

                <!-- Button Element -->
                <button v-else-if="element.type === 'button'" class="preview-button">
                  {{ element.text }}
                </button>

                <!-- Image Element -->
                <img
                  v-else-if="element.type === 'image'"
                  :src="element.url"
                  :alt="element.altText"
                  style="width: 100%; height: 100%; object-fit: cover"
                />

                <!-- Divider Element -->
                <div v-else-if="element.type === 'divider'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
