import { taskService } from '../services/task.service.js';

// Clear tasks before each test
beforeEach(() => {
  taskService.clearTasks();
});
