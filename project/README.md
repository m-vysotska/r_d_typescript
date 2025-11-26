# Task Tracker - Enhanced Project

A comprehensive full-stack task management application with advanced features, built with React + TypeScript frontend and Node.js + TypeScript backend.

## ✨ New Features & Improvements

### Enhanced Task Management
- **4-Column Kanban Board**: To Do → In Progress → Review → Done
- **Review Status**: New status for task review workflow
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Improved UI/UX**: Better form styling and button alignment

### Technical Improvements
- **Validation Middleware**: Centralized request validation
- **Clean Architecture**: Controllers → Services → Models pattern
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Frontend (Vitest + RTL) and Backend (Jest + Supertest)
- **Code Quality**: ESLint + Prettier configuration

## Project Structure

```
project/
├── backend/                    # Node.js + TypeScript API
│   ├── controllers/           # Request handlers
│   ├── middleware/           # Validation middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── types/               # TypeScript definitions
│   └── tests/               # Backend tests
└── frontend/                  # React + TypeScript SPA
    ├── src/
    │   ├── features/tasks/   # Task management features
    │   │   ├── pages/       # Task pages (List, Create, Edit, Details)
    │   │   ├── api.ts       # API client
    │   │   └── types.ts     # Frontend types
    │   └── shared/          # Shared components
    └── tests/               # Frontend tests
```

## Features

### Frontend (React + TypeScript)
- ✅ **Kanban Board**: 4-column layout (To Do, In Progress, Review, Done)
- ✅ **Task Management**: Create, read, update, delete tasks
- ✅ **Form Validation**: Real-time validation with Zod
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Testing**: Component tests with Vitest + RTL

### Backend (Node.js + TypeScript)  
- ✅ **REST API**: Full CRUD operations
- ✅ **Validation**: Request validation with Zod
- ✅ **Middleware**: Centralized validation logic
- ✅ **Error Handling**: Proper HTTP status codes
- ✅ **Architecture**: Clean separation of concerns
- ✅ **Testing**: Integration tests with Jest + Supertest

## Backend

### Setup

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Build

```bash
npm run build
```

Compiled files are in `dist/`

### Testing

```bash
npm test
```

Integration tests for all `/tasks/*` endpoints using Jest + Supertest.

### Linting

```bash
npm run lint
npm run lint:fix
```

## Frontend

### Setup

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

App runs on `http://localhost:5173`

### Build

```bash
npm run build
```

Bundle is created in `dist/`

### Testing

```bash
npm test
```

Component tests using Vitest + React Testing Library.

### Linting

```bash
npm run lint
npm run lint:fix
```

## Pre-commit Hooks

Both projects have pre-commit hooks configured with Husky + lint-staged:

- Only staged files are checked
- ESLint auto-fixes issues
- Commit is prevented if linting fails

To set up hooks:

```bash
# In backend or frontend directory
npx husky install
```

## Features

### Backend
- ✅ Express.js API with TypeScript
- ✅ Integration tests for all endpoints (200, 201, 400, 404)
- ✅ ESLint + Prettier configuration
- ✅ Pre-commit hooks
- ✅ Production build

### Frontend
- ✅ React + TypeScript application
- ✅ Component tests with Vitest + React Testing Library
- ✅ ESLint + Prettier configuration
- ✅ Pre-commit hooks
- ✅ Production build

## API Endpoints

- `GET /tasks` - Get all tasks (with optional filters: status, priority, createdAt)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task (partial updates supported)
- `DELETE /tasks/:id` - Delete task

### Task Status Values
- `todo` - To Do
- `in_progress` - In Progress  
- `review` - Review
- `done` - Done

### Priority Values
- `low` - Low Priority
- `medium` - Medium Priority
- `high` - High Priority
- `urgent` - Urgent Priority





