# Task Manager - React + TypeScript with Form Validation

A React application with a task creation form using react-hook-form and Zod validation.

## Features

- ✅ CreateTaskForm component with react-hook-form
- ✅ Zod validation schema for form validation
- ✅ Real-time validation with error messages
- ✅ Form fields with required/optional indicators
- ✅ Error styling (red borders and error messages)
- ✅ Submit button disabled until form is valid
- ✅ Deadline validation (cannot select past dates)
- ✅ Automatic createdAt timestamp (using `new Date()`)
- ✅ Integration with json-server REST API

## Project Structure

```
hw_5/
├── src/
│   ├── api/
│   │   └── api.ts              # API utilities (from hw_4)
│   ├── components/
│   │   ├── CreateTaskForm.tsx  # Main form component
│   │   └── CreateTaskForm.css  # Form styles
│   ├── types/
│   │   └── task.types.ts       # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── db.json                     # json-server database
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Running the Application

1. Start the json-server API (in one terminal):
```bash
npm run server
```
This will start the REST API server on `http://localhost:3000`

2. Start the Vite development server (in another terminal):
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Form Fields

### Required Fields
- **Title**: Must be 1-100 characters
- **Description**: Must be 1-1000 characters
- **Deadline**: Required date field, cannot be in the past

### Optional Fields
- **Status**: Defaults to "todo" (todo, in_progress, done)
- **Priority**: Defaults to "medium" (low, medium, high, urgent)

## Validation Rules

- Title: Required, min 1 character, max 100 characters
- Description: Required, min 1 character, max 1000 characters
- Status: Optional (defaults to "todo")
- Priority: Optional (defaults to "medium")
- Deadline: Required, must be today or in the future

## Form Behavior

- Real-time validation on field change (`mode: 'onChange'`)
- Error messages displayed below each field in red
- Input borders turn red when validation fails
- Submit button is disabled until all required fields are valid
- Form resets after successful submission
- `createdAt` is automatically set to `new Date()` when creating a task

## Technologies

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **react-hook-form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod resolver for react-hook-form
- **json-server** - REST API mock server

## Code Conventions

- **PascalCase** for component names and types
- **camelCase** for variables and functions
- Unused files removed

## API Endpoints

The form connects to json-server API endpoints:

- `POST http://localhost:3000/tasks` - Create a new task

The task data structure:
```typescript
{
  title: string;
  description: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string; // ISO date string
  createdAt: string; // Automatically set
}
```
