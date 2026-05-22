// Position interface for element positioning
export interface Position {
  x: number;
  y: number;
}

// Size interface for dimensions
export interface Size {
  width: number;
  height: number;
}

// Element types
export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'divider';

// Base element with common properties
export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  zIndex?: number; // Optional z-index for layering
}

// Heading element
export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

// Text element
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

// Button element
export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}

// Image element
export interface ImageElement extends BaseElement {
  type: 'image';
  url: string;
  altText: string;
}

// Divider element
export interface DividerElement extends BaseElement {
  type: 'divider';
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
}

// Union type for all template elements
export type TemplateElement = HeadingElement | TextElement | ButtonElement | ImageElement | DividerElement;

// Main template interface
export interface Template {
  id: string;
  name: string;
  elements: TemplateElement[];
  canvasSize: Size;
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
}

// Request interface for creating/updating templates
export interface CreateTemplateRequest {
  id?: string;
  name: string;
  elements: TemplateElement[];
  canvasSize: Size;
  backgroundColor: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}
