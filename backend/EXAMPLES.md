# Popup Template Builder API - Example Templates

This file contains example templates demonstrating all element types and features.

## Example 1: Welcome Popup with All Element Types

```json
{
  "name": "Welcome Popup",
  "canvasSize": {
	"width": 600,
	"height": 700
  },
  "backgroundColor": "#f5f5f5",
  "elements": [
	{
	  "id": "heading-1",
	  "type": "heading",
	  "position": { "x": 50, "y": 40 },
	  "size": { "width": 500, "height": 60 },
	  "content": "Welcome to Our Store!",
	  "fontSize": 36,
	  "color": "#007acc",
	  "alignment": "center"
	},
	{
	  "id": "text-1",
	  "type": "text",
	  "position": { "x": 50, "y": 120 },
	  "size": { "width": 500, "height": 80 },
	  "content": "Get 30% off your first order. Limited time offer!",
	  "fontSize": 18,
	  "color": "#333333",
	  "alignment": "center"
	},
	{
	  "id": "image-1",
	  "type": "image",
	  "position": { "x": 225, "y": 220 },
	  "size": { "width": 150, "height": 150 },
	  "url": "https://example.com/logo.png",
	  "altText": "Company Logo"
	},
	{
	  "id": "button-1",
	  "type": "button",
	  "position": { "x": 200, "y": 400 },
	  "size": { "width": 200, "height": 50 },
	  "text": "Shop Now",
	  "backgroundColor": "#28a745",
	  "textColor": "#ffffff",
	  "borderRadius": 8
	},
	{
	  "id": "text-2",
	  "type": "text",
	  "position": { "x": 50, "y": 480 },
	  "size": { "width": 500, "height": 40 },
	  "content": "Use code: WELCOME30 at checkout",
	  "fontSize": 14,
	  "color": "#666666",
	  "alignment": "center"
	}
  ]
}
```

## Example 2: Newsletter Signup

```json
{
  "name": "Newsletter Signup",
  "canvasSize": {
	"width": 500,
	"height": 450
  },
  "backgroundColor": "#ffffff",
  "elements": [
	{
	  "id": "heading-1",
	  "type": "heading",
	  "position": { "x": 50, "y": 40 },
	  "size": { "width": 400, "height": 50 },
	  "content": "Stay Updated",
	  "fontSize": 32,
	  "color": "#2c3e50",
	  "alignment": "center"
	},
	{
	  "id": "text-1",
	  "type": "text",
	  "position": { "x": 50, "y": 110 },
	  "size": { "width": 400, "height": 60 },
	  "content": "Subscribe to our newsletter for exclusive deals and updates.",
	  "fontSize": 16,
	  "color": "#7f8c8d",
	  "alignment": "center"
	},
	{
	  "id": "button-1",
	  "type": "button",
	  "position": { "x": 150, "y": 200 },
	  "size": { "width": 200, "height": 45 },
	  "text": "Subscribe",
	  "backgroundColor": "#3498db",
	  "textColor": "#ffffff",
	  "borderRadius": 22
	}
  ]
}
```

## Example 3: Promotional Banner

```json
{
  "name": "Summer Sale",
  "canvasSize": {
	"width": 700,
	"height": 400
  },
  "backgroundColor": "#ffd700",
  "elements": [
	{
	  "id": "heading-1",
	  "type": "heading",
	  "position": { "x": 100, "y": 50 },
	  "size": { "width": 500, "height": 80 },
	  "content": "SUMMER SALE!",
	  "fontSize": 48,
	  "color": "#c0392b",
	  "alignment": "center"
	},
	{
	  "id": "text-1",
	  "type": "text",
	  "position": { "x": 100, "y": 150 },
	  "size": { "width": 500, "height": 50 },
	  "content": "Up to 50% OFF on all items",
	  "fontSize": 24,
	  "color": "#2c3e50",
	  "alignment": "center"
	},
	{
	  "id": "button-1",
	  "type": "button",
	  "position": { "x": 250, "y": 240 },
	  "size": { "width": 200, "height": 55 },
	  "text": "Shop Sale",
	  "backgroundColor": "#e74c3c",
	  "textColor": "#ffffff",
	  "borderRadius": 5
	}
  ]
}
```

## Example 4: Minimal Announcement

```json
{
  "name": "New Feature Announcement",
  "canvasSize": {
	"width": 400,
	"height": 300
  },
  "backgroundColor": "#ecf0f1",
  "elements": [
	{
	  "id": "image-1",
	  "type": "image",
	  "position": { "x": 150, "y": 30 },
	  "size": { "width": 100, "height": 100 },
	  "url": "https://example.com/feature-icon.png",
	  "altText": "New Feature"
	},
	{
	  "id": "heading-1",
	  "type": "heading",
	  "position": { "x": 50, "y": 150 },
	  "size": { "width": 300, "height": 40 },
	  "content": "Check Out Our New Feature",
	  "fontSize": 20,
	  "color": "#34495e",
	  "alignment": "center"
	},
	{
	  "id": "button-1",
	  "type": "button",
	  "position": { "x": 125, "y": 220 },
	  "size": { "width": 150, "height": 40 },
	  "text": "Learn More",
	  "backgroundColor": "#9b59b6",
	  "textColor": "#ffffff",
	  "borderRadius": 20
	}
  ]
}
```

## Element Types Reference

### Heading
- Large, prominent text for titles
- Supports left, center, right alignment
- Customizable font size and color

### Text
- Standard body text
- Supports left, center, right alignment
- Customizable font size and color

### Button
- Interactive call-to-action element
- Customizable colors and border radius
- Text color separate from background

### Image
- Display images or logos
- Requires URL and alt text for accessibility
- Fully customizable size and position

## Validation Rules

1. **Required Fields:**
   - `name` - Must be non-empty string
   - `elements` - Must be an array
   - `canvasSize` - Must have width and height numbers
   - `backgroundColor` - Must be a string (hex color recommended)

2. **Element Requirements:**
   - Each element must have: `id`, `type`, `position`, `size`
   - Position must have: `x`, `y` (numbers)
   - Size must have: `width`, `height` (numbers)
   - Type-specific fields are also required

3. **Color Format:**
   - Use hex colors: `#RRGGBB` or `#RGB`
   - Examples: `#007acc`, `#fff`, `#ff5733`

4. **Alignment Options:**
   - Only 'left', 'center', or 'right' are valid
