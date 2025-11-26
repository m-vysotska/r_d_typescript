import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ZodError } from 'zod';
import taskRoutes from './routes/task.routes.js';
import AppError from './common/AppError.js';
import { initializeDatabase } from './config/database.js';
import './models/Task.model.js'; // Import to register the model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Morgan middleware - only in development mode
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JSON parsing error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'Request body contains invalid JSON',
      statusCode: 400,
    });
  }
  next(error);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/api', taskRoutes);

// 404 handler
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, _next: NextFunction): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
      statusCode: 400,
    });
    return;
  }

  // Handle Sequelize errors
  if (error.name === 'SequelizeValidationError') {
    res.status(400).json({
      error: 'Database validation error',
      details:
        (
          error as { errors?: Array<{ path: string; message: string; value: unknown }> }
        ).errors?.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        })) || [],
      statusCode: 400,
    });
    return;
  }

  if (error.name === 'SequelizeDatabaseError') {
    res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while processing your request',
      statusCode: 500,
    });
    return;
  }

  // Generic error handler
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    statusCode: 500,
  });
});

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server only if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      app
        .listen(PORT, () => {
          console.log(`🚀 Server is running on http://localhost:${PORT}`);
          console.log(`📊 Health check available at http://localhost:${PORT}/health`);
          console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        })
        .on('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            console.error(
              `❌ Port ${PORT} is already in use. Please stop the process using this port or set a different PORT in environment variables.`
            );
            process.exit(1);
          } else {
            console.error('❌ Server error:', err);
            throw err;
          }
        });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Start the server
startServer();

// Export app for testing
export default app;
