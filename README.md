# Popup Template Builder

An interactive popup template builder that allows users to create, customize, and preview marketing popup templates using drag-and-drop functionality. Built with Vue 3, TypeScript, and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Running

From the project root, run:

```bash
# Install all dependencies (frontend + backend)
npm install

# Start both frontend and backend servers
npm run dev

# Or run them separately:
npm run server   # Start backend only (http://localhost:3001)
npm run client   # Start frontend only (http://localhost:5173)
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
popup-template-builder/
├── backend/                 # Express TypeScript API
│   ├── src/
│   │   ├── server.ts       # Main server file
│   │   └── types/          # TypeScript types
│   ├── templates.json      # JSON file storage
│   └── package.json
├── frontend/                # Vue 3 + TypeScript app
│   ├── src/
│   │   ├── views/          # Page components
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── router/         # Vue Router
│   └── package.json
├── package.json            # Root package.json (workspaces)
└── README.md
```

## 🎯 Features

### Backend (Express + TypeScript)
- ✅ RESTful API with 3 endpoints
- ✅ TypeScript with strict type checking
- ✅ JSON file-based persistence
- ✅ CORS enabled
- ✅ Comprehensive validation
- ✅ Auto-generated IDs and timestamps

### Frontend (Vue 3 + TypeScript)
- ✅ Vue 3 Composition API
- ✅ TypeScript for type safety
- ✅ Pinia state management
- ✅ Vue Router for navigation
- ✅ Axios for API communication
- ✅ Vite for fast development

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | List all saved templates |
| POST | `/api/templates` | Create or update template |
| DELETE | `/api/templates/:id` | Delete template by ID |
| GET | `/health` | Health check |

## 🎨 Template Structure

Each template consists of:

- **Canvas Settings**: Size and background color
- **Elements**: Heading, Text, Button, Image
- **Properties**: Position, size, colors, fonts, etc.

### Element Types

1. **Heading** - Large title text with alignment
2. **Text** - Body text with alignment
3. **Button** - Interactive CTA with styling
4. **Image** - Image with URL and alt text

## 📜 Available Scripts

### Root Level (Recommended)

```bash
npm install          # Install all dependencies
npm run dev          # Start both frontend & backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build both projects
npm run test         # Run tests (when available)
npm run clean        # Clean all node_modules and dist folders
```

### Backend Only

```bash
cd backend
npm install          # Install backend dependencies
npm run dev          # Development mode with auto-reload
npm run build        # Compile TypeScript
npm start            # Production mode
```

### Frontend Only

```bash
cd frontend
npm install          # Install frontend dependencies
npm run dev          # Development mode
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Storage**: JSON file
- **CORS**: Enabled for frontend integration

### Frontend
- **Framework**: Vue 3
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🔧 Configuration

### Backend Configuration

Environment variables (optional):
```bash
PORT=3001  # Default port
```

### Frontend Configuration

`.env` file in frontend directory:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 📚 Documentation

- [Backend README](./backend/README.md) - API documentation
- [Backend Examples](./backend/EXAMPLES.md) - Template examples
- [Frontend README](./frontend/README.md) - Frontend documentation

## 🧪 Testing

```bash
# Run all tests
npm run test

# Backend tests (when available)
cd backend && npm test

# Frontend tests (when available)
cd frontend && npm test
```

## 🚧 Development Workflow

1. **Clone the repository**
```bash
git clone https://github.com/Deniz-Sahin/insider-case.git
cd insider-case
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development servers**
```bash
npm run dev
```

4. **Open in browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📝 Example Usage

### Create a Template via API

```bash
curl -X POST http://localhost:3001/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Popup",
    "canvasSize": { "width": 600, "height": 700 },
    "backgroundColor": "#ffffff",
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
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 👤 Author

Deniz Sahin

## 🔗 Repository

https://github.com/Deniz-Sahin/insider-case
