# Task Management Backend

A robust Node.js + TypeScript REST API for task management with full CRUD operations.

## Features

✅ **REST API for CRUD operations** - Complete task management endpoints  
✅ **Database Storage** - SQLite with Sequelize ORM for data persistence  
✅ **Advanced Filtering** - Filter by status, priority, and creation date  
✅ **Request Validation** - Zod schemas for body and query parameter validation  
✅ **Error Handling** - Proper HTTP status codes (400/404/500) with detailed messages  
✅ **Middleware Stack** - Morgan logging (dev mode) and CORS support  
✅ **Clean Architecture** - Organized routes → controllers → services → models  

## Architecture

```
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Validation and other middleware
├── models/          # Database models (Sequelize)
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript types and Zod schemas
├── tests/           # Integration tests
└── common/          # Shared utilities (AppError)
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks with optional filtering
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /health` - Server health status

## Query Parameters

### GET /api/tasks
- `status` - Filter by task status (todo, in-progress, done, review)
- `priority` - Filter by priority (low, medium, high)
- `createdAt` - Filter by creation date (YYYY-MM-DD)

## Installation

```bash
npm install
```

## Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
```

## Environment Variables

- `NODE_ENV` - Environment (development/test/production)
- `PORT` - Server port (default: 3000)

## Database

Uses SQLite with Sequelize ORM. Database files:
- `database.sqlite` - Production database
- `test-database.sqlite` - Test database (auto-created/cleared)

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "details": [] // For validation errors
}
```

## Testing

Comprehensive integration tests using Jest + Supertest covering:
- All CRUD operations
- Query parameter filtering
- Validation error handling
- Database integration
- Error scenarios
