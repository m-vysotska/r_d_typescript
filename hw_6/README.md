# Task Manager - React Router Application

A React application with React Router for task management, featuring routing, form validation, and comprehensive testing.

## Project Structure

```
hw_6/
├── src/
│   ├── features/
│   │   └── tasks/
│   │       ├── api.ts              # API functions
│   │       ├── types.ts            # TypeScript types
│   │       └── pages/
│   │           ├── TasksList.tsx
│   │           ├── TasksList.css
│   │           ├── TasksList.test.tsx
│   │           ├── TaskDetails.tsx
│   │           ├── TaskDetails.css
│   │           ├── TaskDetails.test.tsx
│   │           ├── TaskCreate.tsx
│   │           ├── TaskCreate.css
│   │           └── TaskCreate.test.tsx
│   ├── shared/                     # Shared components (if needed)
│   ├── test/
│   │   └── setup.ts                # Test setup
│   ├── router.tsx                  # Router configuration
│   ├── App.tsx                     # Main app component
│   ├── App.css
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── db.json                         # json-server database
└── package.json
```

## Features

- **Task List Page** (`/tasks`) - Display all tasks with cards
- **Task Details Page** (`/tasks/:id`) - Show full task information
- **Create Task Page** (`/tasks/create`) - Form to create new tasks
- **React Router** - Navigation between pages
- **Form Validation** - Using react-hook-form and Zod
- **Comprehensive Tests** - Unit tests for all pages

## Installation

```bash
npm install
```

## Running the Application

1. Start json-server (Terminal 1):
```bash
npm run server
```

2. Start Vite dev server (Terminal 2):
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Routes

- `/` - Redirects to task list
- `/tasks` - Task list page
- `/tasks/create` - Create new task
- `/tasks/:id` - Task details page

## Testing

All test files follow the naming convention: `*.test.tsx`

Test cases cover:
- Task list: loading, empty state, error handling, task display
- Task details: loading, error handling, back navigation
- Task create: form validation, submit button states, error messages

## Code Conventions

- **PascalCase** for component names and types
- **camelCase** for variables and functions
- **kebab-case** for feature folder names
- No snake_case used

