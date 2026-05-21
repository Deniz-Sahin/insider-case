import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { Template, CreateTemplateRequest, ApiResponse } from './types/template.types';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);
const TEMPLATES_FILE: string = path.join(__dirname, '../templates.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize templates file if it doesn't exist
async function initializeTemplatesFile(): Promise<void> {
  try {
    await fs.access(TEMPLATES_FILE);
  } catch {
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify([], null, 2));
  }
}

// Read templates from file
async function readTemplates(): Promise<Template[]> {
  try {
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    return JSON.parse(data) as Template[];
  } catch (error) {
    console.error('Error reading templates:', error);
    return [];
  }
}

// Write templates to file
async function writeTemplates(templates: Template[]): Promise<void> {
  try {
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Error writing templates:', error);
    throw error;
  }
}

// Generate unique template ID
function generateTemplateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET /api/templates - List all saved templates
app.get('/api/templates', async (_req: Request, res: Response): Promise<void> => {
  try {
    const templates = await readTemplates();
    const response: ApiResponse<Template[]> = {
      success: true,
      data: templates,
      count: templates.length
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve templates'
    };
    res.status(500).json(response);
  }
});

// POST /api/templates - Create/update template
app.post('/api/templates', async (req: Request, res: Response): Promise<void> => {
  try {
    const templateData: CreateTemplateRequest = req.body;

    // Validate required fields
    if (!templateData.name || templateData.name.trim() === '') {
      const response: ApiResponse = {
        success: false,
        error: 'Template name is required'
      };
      res.status(400).json(response);
      return;
    }

    if (!templateData.elements || !Array.isArray(templateData.elements)) {
      const response: ApiResponse = {
        success: false,
        error: 'Template elements array is required'
      };
      res.status(400).json(response);
      return;
    }

    if (!templateData.canvasSize || typeof templateData.canvasSize.width !== 'number' || typeof templateData.canvasSize.height !== 'number') {
      const response: ApiResponse = {
        success: false,
        error: 'Valid canvas size with width and height is required'
      };
      res.status(400).json(response);
      return;
    }

    if (!templateData.backgroundColor || typeof templateData.backgroundColor !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Background color is required'
      };
      res.status(400).json(response);
      return;
    }

    const templates = await readTemplates();
    const now = new Date().toISOString();

    // Check if template exists (update) or create new
    if (templateData.id) {
      const index = templates.findIndex(t => t.id === templateData.id);
      if (index !== -1) {
        // Update existing template
        templates[index] = {
          ...templateData,
          id: templateData.id,
          createdAt: templates[index].createdAt,
          updatedAt: now
        };
        await writeTemplates(templates);

        const response: ApiResponse<Template> = {
          success: true,
          message: 'Template updated successfully',
          data: templates[index]
        };
        res.json(response);
        return;
      }
    }

    // Create new template
    const newTemplate: Template = {
      ...templateData,
      id: templateData.id || generateTemplateId(),
      createdAt: now,
      updatedAt: now
    };

    templates.push(newTemplate);
    await writeTemplates(templates);

    const response: ApiResponse<Template> = {
      success: true,
      message: 'Template created successfully',
      data: newTemplate
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating/updating template:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to save template'
    };
    res.status(500).json(response);
  }
});

// DELETE /api/templates/:id - Delete template
app.delete('/api/templates/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Template ID is required'
      };
      res.status(400).json(response);
      return;
    }

    const templates = await readTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Template not found'
      };
      res.status(404).json(response);
      return;
    }

    const deletedTemplate = templates.splice(index, 1)[0];
    await writeTemplates(templates);

    const response: ApiResponse<Template> = {
      success: true,
      message: 'Template deleted successfully',
      data: deletedTemplate
    };
    res.json(response);
  } catch (error) {
    console.error('Error deleting template:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete template'
    };
    res.status(500).json(response);
  }
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Server error:', err);
  const response: ApiResponse = {
    success: false,
    error: 'Internal server error'
  };
  res.status(500).json(response);
});

// Start server
async function startServer(): Promise<void> {
  try {
    await initializeTemplatesFile();
    app.listen(PORT, () => {
      console.log(`🚀 Popup Builder API server is running on http://localhost:${PORT}`);
      console.log(`📋 Templates file: ${TEMPLATES_FILE}`);
      console.log(`🔷 TypeScript mode enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
