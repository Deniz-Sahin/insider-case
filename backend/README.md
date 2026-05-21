# Popup Template Builder - Backend API

A TypeScript Express.js backend for managing popup templates with JSON file storage.

## Features

- ✅ **TypeScript** - Full type safety and better development experience
- ✅ RESTful API endpoints for template management
- ✅ JSON file-based persistence (no external database required)
- ✅ CORS enabled for frontend integration
- ✅ Error handling and validation
- ✅ Auto-generated IDs and timestamps
- ✅ Strongly typed interfaces for templates and API responses

## API Endpoints

### 1. List All Templates
```
GET /api/templates
```
Returns all saved templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template_123",
      "name": "Welcome Popup",
      "elements": [...],
      "canvasSize": { "width": 600, "height": 700 },
      "backgroundColor": "#f5f5f5",
      "createdAt": "2026-05-21T18:00:00.000Z",
      "updatedAt": "2026-05-21T18:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. Create or Update Template
```
POST /api/templates
```
Creates a new template or updates existing one if `id` is provided.

**Required Fields:**
- `name` - Template name (non-empty string)
- `elements` - Array of template elements
- `canvasSize` - Canvas dimensions `{ width: number, height: number }`
- `backgroundColor` - Background color (string, e.g., "#ffffff")

**Optional Fields:**
- `id` - For updating existing templates

**Request Body:**
```json
{
  "name": "Welcome Popup",
  "canvasSize": { "width": 600, "height": 700 },
  "backgroundColor": "#f5f5f5",
  "elements": [
    {
      "id": "heading-1",
      "type": "heading",
      "position": { "x": 50, "y": 40 },
      "size": { "width": 500, "height": 60 },
      "content": "Welcome!",
      "fontSize": 36,
      "color": "#007acc",
      "alignment": "center"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "id": "template_1234567890_abc",
    "name": "Welcome Popup",
    "elements": [...],
    "canvasSize": { "width": 600, "height": 700 },
    "backgroundColor": "#f5f5f5",
    "createdAt": "2026-05-21T18:00:00.000Z",
    "updatedAt": "2026-05-21T18:00:00.000Z"
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Template name is required"
}
```

### 3. Delete Template
```
DELETE /api/templates/:id
```
Deletes a template by ID.

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully",
  "data": {
    "id": "template_123",
    "name": "Welcome Popup",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Template not found"
}
```

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Build TypeScript (for production):
```bash
npm run build
```

4. Start the server:
```bash
# Production mode (requires build first)
npm start

# Development mode with auto-reload and ts-node
npm run dev

# Watch mode - auto-compile TypeScript on changes
npm run watch
```

The server will start on `http://localhost:3001`

## Configuration

You can set the port using environment variable:
```bash
PORT=3000 npm start
```

## Data Storage

Templates are stored in `templates.json` in the backend directory. The file is automatically created when the server starts.

## Template Structure

Each template follows a strongly-typed structure:

### Template Interface
```typescript
interface Template {
  id: string;                      // Auto-generated unique ID
  name: string;                    // Template name (required)
  elements: TemplateElement[];     // Array of popup elements (required)
  canvasSize: Size;                // Canvas dimensions (required)
  backgroundColor: string;         // Canvas background color (required)
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
}
```

### Element Types

#### 1. Heading Element
```typescript
{
  id: string;
  type: 'heading';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}
```

#### 2. Text Element
```typescript
{
  id: string;
  type: 'text';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}
```

#### 3. Button Element
```typescript
{
  id: string;
  type: 'button';
  position: { x: number; y: number };
  size: { width: number; height: number };
  text: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}
```

#### 4. Image Element
```typescript
{
  id: string;
  type: 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  url: string;
  altText: string;
}
```

All TypeScript interfaces are available in `src/types/template.types.ts` for frontend integration.

## Example Usage

### Create a complete template:
```bash
curl -X POST http://localhost:3001/api/templates \
  -H "Content-Type: application/json" \
  -d '{
	"name": "Welcome Popup",
	"canvasSize": { "width": 600, "height": 700 },
	"backgroundColor": "#f5f5f5",
	"elements": [
	  {
		"id": "heading-1",
		"type": "heading",
		"position": { "x": 50, "y": 40 },
		"size": { "width": 500, "height": 60 },
		"content": "Welcome!",
		"fontSize": 36,
		"color": "#007acc",
		"alignment": "center"
	  },
	  {
		"id": "text-1",
		"type": "text",
		"position": { "x": 50, "y": 120 },
		"size": { "width": 500, "height": 80 },
		"content": "Get 30% off your first order!",
		"fontSize": 18,
		"color": "#333333",
		"alignment": "center"
	  },
	  {
		"id": "button-1",
		"type": "button",
		"position": { "x": 200, "y": 220 },
		"size": { "width": 200, "height": 50 },
		"text": "Shop Now",
		"backgroundColor": "#28a745",
		"textColor": "#ffffff",
		"borderRadius": 8
	  },
	  {
		"id": "image-1",
		"type": "image",
		"position": { "x": 225, "y": 300 },
		"size": { "width": 150, "height": 150 },
		"url": "https://example.com/logo.png",
		"altText": "Company Logo"
	  }
	]
  }'
```

### Get all templates:
```bash
curl http://localhost:3001/api/templates
```

### Update a template:
```bash
curl -X POST http://localhost:3001/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "id": "template_123",
    "name": "Updated Popup",
    "canvasSize": { "width": 600, "height": 700 },
    "backgroundColor": "#ffffff",
    "elements": [...]
  }'
```

### Delete a template:
```bash
curl -X DELETE http://localhost:3001/api/templates/template_123
```

## CORS

CORS is enabled by default to allow frontend applications to communicate with the API.
