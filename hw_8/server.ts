import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ZodError } from 'zod';
import taskRoutes from './routes/task.routes.js';
import { initializeDatabase } from './config/database.js';
import AppError from './common/AppError.js';
import './models/User.model.js';
import './models/Task.model.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', taskRoutes);

// 404 handler
app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message
    });
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;




