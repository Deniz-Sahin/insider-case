/**
 * Application-wide constants
 * Centralizes magic strings, numbers, and configuration values
 */

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  ENDPOINTS: {
    TEMPLATES: '/templates',
    TEMPLATE_BY_ID: (id: string) => `/templates/${id}`,
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// ============================================================================
// Editor Configuration
// ============================================================================

export const EDITOR_CONFIG = {
  MAX_HISTORY_SIZE: 50,
  DEFAULT_CANVAS_SIZE: {
    width: 400,
    height: 500,
  },
  DEFAULT_BACKGROUND_COLOR: '#ffffff',
  GRID_SIZE: 10,
  MIN_ELEMENT_SIZE: {
    width: 50,
    height: 20,
  },
} as const;

// ============================================================================
// UI Messages - Success
// ============================================================================

export const SUCCESS_MESSAGES = {
  TEMPLATE_SAVED: 'Template saved successfully!',
  TEMPLATE_DELETED: 'Template deleted successfully!',
  TEMPLATE_CREATED: 'Template created successfully!',
  TEMPLATE_UPDATED: 'Template updated successfully!',
  TEMPLATE_IMPORTED: 'Template imported successfully! Click "Save Template" to save it.',
  TEMPLATE_EXPORTED: 'Template exported successfully!',
  ELEMENT_ADDED: 'Element added successfully!',
  ELEMENT_UPDATED: 'Element updated successfully!',
  ELEMENT_DELETED: 'Element deleted successfully!',
  ELEMENT_COPIED: 'Element copied to clipboard!',
  ELEMENT_PASTED: 'Element pasted successfully!',
} as const;

// ============================================================================
// UI Messages - Errors
// ============================================================================

export const ERROR_MESSAGES = {
  // Template errors
  TEMPLATE_SAVE_FAILED: 'Failed to save template. Please try again.',
  TEMPLATE_LOAD_FAILED: 'Failed to load template. Please try again.',
  TEMPLATE_DELETE_FAILED: 'Failed to delete template. Please try again.',
  TEMPLATE_FETCH_FAILED: 'Failed to fetch templates. Please try again.',
  TEMPLATE_CREATE_FAILED: 'Failed to create template. Please try again.',
  TEMPLATE_UPDATE_FAILED: 'Failed to update template. Please try again.',
  TEMPLATE_NOT_FOUND: 'Template not found.',
  TEMPLATE_ID_REQUIRED: 'Template ID is required for updates.',

  // Import/Export errors
  TEMPLATE_IMPORT_FAILED:
    'Failed to import template. Please make sure the file is a valid JSON template.',
  TEMPLATE_EXPORT_FAILED: 'Failed to export template. Please try again.',
  INVALID_TEMPLATE_FILE: 'Invalid template file: missing or invalid elements array',
  FILE_READ_FAILED: 'Failed to read file. Please try again.',

  // Element errors
  ELEMENT_ADD_FAILED: 'Failed to add element. Please try again.',
  ELEMENT_UPDATE_FAILED: 'Failed to update element. Please try again.',
  ELEMENT_DELETE_FAILED: 'Failed to delete element. Please try again.',
  ELEMENT_COPY_FAILED: 'Failed to copy element. Please try again.',
  ELEMENT_PASTE_FAILED: 'Failed to paste element. Please try again.',
  NO_ELEMENT_SELECTED: 'No element selected.',
  NO_ELEMENT_TO_PASTE: 'No element to paste.',

  // Validation errors
  VALIDATION_NAME_REQUIRED: 'Template name is required.',
  VALIDATION_ELEMENTS_REQUIRED: 'At least one element is required.',
  VALIDATION_CANVAS_SIZE_INVALID: 'Canvas size must be greater than 0.',

  // Generic errors
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

// ============================================================================
// UI Messages - Confirmation Dialogs
// ============================================================================

export const CONFIRM_MESSAGES = {
  DELETE_TEMPLATE: 'Are you sure you want to delete this template?',
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  DELETE_ELEMENT: 'Are you sure you want to delete this element?',
  CLEAR_CANVAS: 'Are you sure you want to clear the canvas? This cannot be undone.',
  RESET_TEMPLATE: 'Are you sure you want to reset the template? This cannot be undone.',
} as const;

// ============================================================================
// UI Messages - Info
// ============================================================================

export const INFO_MESSAGES = {
  LOADING_TEMPLATES: 'Loading templates...',
  LOADING_TEMPLATE: 'Loading template...',
  SAVING_TEMPLATE: 'Saving template...',
  DELETING_TEMPLATE: 'Deleting template...',
  NO_TEMPLATES: 'No templates yet',
  NO_TEMPLATES_DESCRIPTION: 'Create your first popup template to get started',
  UNSAVED_CHANGES: '● Unsaved changes',
} as const;

// ============================================================================
// Element Types
// ============================================================================

export const ELEMENT_TYPES = {
  HEADING: 'heading',
  TEXT: 'text',
  BUTTON: 'button',
  IMAGE: 'image',
  DIVIDER: 'divider',
} as const;

// ============================================================================
// Default Element Properties
// ============================================================================

export const DEFAULT_ELEMENT_PROPS = {
  HEADING: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  TEXT: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'left',
  },
  BUTTON: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#ffffff',
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: '10px 20px',
  },
  IMAGE: {
    width: 200,
    height: 150,
    borderRadius: 0,
  },
  DIVIDER: {
    height: 2,
    width: 200,
    color: '#cccccc',
  },
} as const;

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

export const KEYBOARD_SHORTCUTS = {
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  DELETE: 'Delete',
  SAVE: 'Ctrl+S',
} as const;

// ============================================================================
// Route Paths
// ============================================================================

export const ROUTES = {
  HOME: '/',
  BUILDER: '/builder',
  BUILDER_WITH_ID: (id: string) => `/builder/${id}`,
} as const;

// ============================================================================
// File Export/Import
// ============================================================================

export const FILE_CONFIG = {
  EXPORT_FILE_EXTENSION: '.json',
  EXPORT_FILE_TYPE: 'application/json',
  IMPORT_ACCEPT_TYPES: 'application/json,.json',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION_RULES = {
  TEMPLATE_NAME_MIN_LENGTH: 1,
  TEMPLATE_NAME_MAX_LENGTH: 100,
  MIN_CANVAS_WIDTH: 200,
  MAX_CANVAS_WIDTH: 1200,
  MIN_CANVAS_HEIGHT: 200,
  MAX_CANVAS_HEIGHT: 1600,
  MIN_ELEMENT_WIDTH: 20,
  MIN_ELEMENT_HEIGHT: 10,
} as const;

// ============================================================================
// Z-Index Layers
// ============================================================================

export const Z_INDEX = {
  BASE: 1,
  INCREMENT: 1,
  MAX: 9999,
} as const;

// ============================================================================
// Animation/Transition Durations
// ============================================================================

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// ============================================================================
// Type Exports for TypeScript
// ============================================================================

export type ElementType = (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];
export type SuccessMessage = (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES];
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
export type ConfirmMessage = (typeof CONFIRM_MESSAGES)[keyof typeof CONFIRM_MESSAGES];
export type InfoMessage = (typeof INFO_MESSAGES)[keyof typeof INFO_MESSAGES];
