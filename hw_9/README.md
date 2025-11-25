# HW 9 - Tasks Managing App

Full-stack tasks managing application with comprehensive testing, linting, and build setup.

## Project Structure

```
hw_9/
├── backend/          # Express.js backend API
└── frontend/         # React frontend application
```

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

- `GET /tasks` - Get all tasks (with optional filters)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task





