import { initializeDatabase, closeDatabase } from '../config/database.js';
import { taskService } from '../services/task.service.js';

// Initialize database before all tests
beforeAll(async () => {
  await initializeDatabase();
});

// Clear tasks before each test
beforeEach(async () => {
  await taskService.clearTasks();
});

// Close database connection after all tests
afterAll(async () => {
  await closeDatabase();
});
