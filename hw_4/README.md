# Task Manager - Vite + TypeScript Project

A modern task management application built with Vite, TypeScript, and HTML. This project demonstrates REST API integration using Fetch API and json-server.

## Features

- View all tasks with details (title, description, status, priority, creation date, deadline)
- Create new tasks through a form interface
- Real-time task list updates
- RESTful API endpoints for task management:
  - `GET /tasks` - Get all tasks
  - `GET /tasks/:id` - Get task by ID
  - `POST /tasks` - Create new task
  - `PUT /tasks/:id` - Full update task
  - `PATCH /tasks/:id` - Partial update task
  - `DELETE /tasks/:id` - Delete task

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the json-server API:
```bash
npm run server
```
This will start the REST API server on `http://localhost:3000`

2. In a new terminal, start the Vite development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Project Structure

```
my-project/
├── db.json                 # JSON database for json-server
├── index.html             # Main HTML file with UI
├── src/
│   ├── api.ts             # Fetch API utilities for task management
│   └── main.ts            # Application entry point
└── package.json           # Project dependencies and scripts
```

## API Endpoints

The json-server automatically generates the following endpoints for the `/tasks` resource:

- `GET http://localhost:3000/tasks` - Retrieve all tasks
- `GET http://localhost:3000/tasks/:id` - Get a specific task
- `POST http://localhost:3000/tasks` - Create a new task
- `PUT http://localhost:3000/tasks/:id` - Fully update a task
- `PATCH http://localhost:3000/tasks/:id` - Partially update a task
- `DELETE http://localhost:3000/tasks/:id` - Delete a task

## Task Model

Each task has the following structure:

```typescript
{
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  deadline: string; // ISO date string
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp (optional)
}
```

## Technologies Used

- **Vite** - Next generation frontend build tool
- **TypeScript** - Typed JavaScript
- **json-server** - REST API mock server
- **Fetch API** - Modern web API for HTTP requests
- **HTML5** - Modern markup
- **CSS3** - Styling with modern features

## Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start json-server API

## Notes

- Make sure json-server is running before using the application
- The application will show an error message if it can't connect to the API
- Tasks are persisted in `db.json`
- Creating a task automatically adds a `createdAt` timestamp
