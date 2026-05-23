import { useTemplateStore } from '@/stores/templateStore';
import { setupPiniaForTest } from './test-utils';
import type { Template, HeadingElement } from '@/types/template.types';

// Mock the envConfig module to avoid import.meta issues in Jest
jest.mock('@/services/envConfig');

describe('Template Store', () => {
  beforeEach(() => {
    setupPiniaForTest();
    jest.clearAllMocks();
  });

  describe('setCurrentTemplate', () => {
    it('should set the current template and clear selected element', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      expect(store.currentTemplate).toEqual(mockTemplate);
      expect(store.selectedElement).toBeNull();
    });
  });

  describe('addElement', () => {
    it('should add a new element to the current template', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      const newElement: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'New Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      store.addElement(newElement);

      expect(store.currentTemplate?.elements).toHaveLength(1);
      expect(store.currentTemplate?.elements[0]).toEqual(newElement);
    });

    it('should not add element if no current template exists', () => {
      const store = useTemplateStore();

      const newElement: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'New Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      store.addElement(newElement);

      expect(store.currentTemplate).toBeNull();
    });
  });

  describe('updateElement', () => {
    it('should update existing element properties', () => {
      const store = useTemplateStore();

      const headingElement: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Original Content',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [headingElement],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      store.updateElement('heading-1', {
        content: 'Updated Content',
        fontSize: 32,
        color: '#ff0000',
      });

      const updatedElement = store.currentTemplate?.elements[0] as HeadingElement;
      expect(updatedElement.content).toBe('Updated Content');
      expect(updatedElement.fontSize).toBe(32);
      expect(updatedElement.color).toBe('#ff0000');
      expect(updatedElement.alignment).toBe('left'); // unchanged property
    });

    it('should not update if element does not exist', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      store.updateElement('non-existent-id', { content: 'Test' });

      expect(store.currentTemplate?.elements).toHaveLength(0);
    });
  });

  describe('removeElement', () => {
    it('should remove element from current template', () => {
      const store = useTemplateStore();

      const element1: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading 1',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const element2: HeadingElement = {
        id: 'heading-2',
        type: 'heading',
        position: { x: 50, y: 150 },
        size: { width: 200, height: 60 },
        content: 'Heading 2',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [element1, element2],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      store.removeElement('heading-1');

      expect(store.currentTemplate?.elements).toHaveLength(1);
      const remainingElement = store.currentTemplate?.elements[0];
      expect(remainingElement?.id).toBe('heading-2');
    });

    it('should clear selected element if it is being removed', () => {
      const store = useTemplateStore();

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [element],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);
      store.selectElement(element);

      expect(store.selectedElement).toEqual(element);

      store.removeElement('heading-1');

      expect(store.selectedElement).toBeNull();
    });
  });

  describe('selectElement', () => {
    it('should select an element', () => {
      const store = useTemplateStore();

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [element],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);
      store.selectElement(element);

      expect(store.selectedElement).toEqual(element);
    });

    it('should set selected element to null', () => {
      const store = useTemplateStore();

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [element],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);
      store.selectElement(element);
      expect(store.selectedElement).toEqual(element);

      store.selectElement(null);

      expect(store.selectedElement).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const store = useTemplateStore();

      // Manually set an error
      store.error = 'Test error message';

      expect(store.error).toBe('Test error message');

      store.clearError();

      expect(store.error).toBeNull();
    });
  });

  describe('undo/redo', () => {
    it('should undo element addition', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(false);

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      store.addElement(element);
      expect(store.currentTemplate?.elements).toHaveLength(1);
      expect(store.canUndo).toBe(true);
      expect(store.canRedo).toBe(false);

      store.undo();
      expect(store.currentTemplate?.elements).toHaveLength(0);
      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(true);
    });

    it('should redo element addition', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        content: 'Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      store.addElement(element);
      store.undo();

      expect(store.currentTemplate?.elements).toHaveLength(0);

      store.redo();

      expect(store.currentTemplate?.elements).toHaveLength(1);
      expect(store.canUndo).toBe(true);
      expect(store.canRedo).toBe(false);
    });

    it('should handle multiple undo/redo operations', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      // Add three elements
      for (let i = 1; i <= 3; i++) {
        store.addElement({
          id: `heading-${i}`,
          type: 'heading',
          position: { x: 50 * i, y: 50 * i },
          size: { width: 200, height: 60 },
          content: `Heading ${i}`,
          fontSize: 24,
          color: '#000000',
          alignment: 'left',
        });
      }

      expect(store.currentTemplate?.elements).toHaveLength(3);

      // Undo twice
      store.undo();
      store.undo();

      expect(store.currentTemplate?.elements).toHaveLength(1);

      // Redo once
      store.redo();

      expect(store.currentTemplate?.elements).toHaveLength(2);
    });
  });

  describe('copy/paste', () => {
    it('should copy and paste an element', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      const element: HeadingElement = {
        id: 'heading-1',
        type: 'heading',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 60 },
        content: 'Original Heading',
        fontSize: 24,
        color: '#000000',
        alignment: 'left',
      };

      store.addElement(element);
      store.selectElement(element);

      expect(store.currentTemplate?.elements).toHaveLength(1);
      expect(store.copiedElement).toBeNull();

      // Copy the element
      store.copyElement();
      expect(store.copiedElement).not.toBeNull();
      expect((store.copiedElement as HeadingElement)?.content).toBe('Original Heading');

      // Paste the element
      store.pasteElement();
      expect(store.currentTemplate?.elements).toHaveLength(2);

      // Check that the pasted element has a different ID and offset position
      const pastedElement = store.currentTemplate?.elements[1];
      expect(pastedElement?.id).not.toBe(element.id);
      expect(pastedElement?.position.x).toBe(120); // 100 + 20
      expect(pastedElement?.position.y).toBe(120); // 100 + 20
    });

    it('should not paste if nothing is copied', () => {
      const store = useTemplateStore();

      const mockTemplate: Template = {
        id: 'test-id',
        name: 'Test Template',
        elements: [],
        canvasSize: { width: 400, height: 500 },
        backgroundColor: '#ffffff',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      store.setCurrentTemplate(mockTemplate);

      expect(store.copiedElement).toBeNull();

      // Try to paste without copying first
      store.pasteElement();
      expect(store.currentTemplate?.elements).toHaveLength(0);
    });
  });
});
