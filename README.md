# Popup Template Builder

An interactive popup template builder with drag-and-drop functionality for creating marketing popups.

## Setup Instructions

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development servers (frontend + backend)
npm run dev

# Build for production
npm run build
```

## Architecture Decisions

- **Frontend**: Vue 3 with TypeScript and Pinia for state management.
- **Composables**: Reusable logic extracted into composables (`useElementProperty`, `useLayerControls`).
- **Base Components**: Shared UI components reduce duplication across property panels.
- **Backend**: Simple Express server with JSON file storage for templates.
- **Testing**: Jest for frontend unit tests with proper mocking for external dependencies.
- **Code Quality**: ESLint and Prettier configured for consistent code style.

## Assumptions Made

- **Templates List Page**: Added a templates list page to view and manage all saved templates (not specified in original requirements).
- **Divider Properties**: Since divider element properties were not defined, implemented basic height and color customization.
- **Code Quality Tools**: Implemented ESLint and Prettier for maintaining code quality and consistency.

## Future Improvements

- **Design**: More professional and polished UI/UX design with better visual hierarchy.
- **Functionality**: Additional popup tools like animations, triggers (time-based, scroll-based, exit-intent), A/B testing capabilities.
- **Element Types**: More element types (video, countdown timer, form inputs, social icons).
- **Responsive**: Mobile-responsive templates and preview modes.
- **Collaboration**: Multi-user editing and template sharing features.

