import { TaskService } from './task.service';
import { 
  TaskCreateInput, 
  TaskUpdateInput, 
  TaskFilterOptions, 
  ValidatedTask,
  Priority,
  Status
} from './task.types';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  // Task CRUD operations
  getTaskById(id: string): ValidatedTask | undefined {
    return this.taskService.getTaskById(id);
  }

  createTask(taskData: TaskCreateInput): ValidatedTask {
    try {
      return this.taskService.createTask(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  updateTask(id: string, updateData: TaskUpdateInput): ValidatedTask | undefined {
    try {
      return this.taskService.updateTask(id, updateData);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  deleteTask(id: string): boolean {
    try {
      return this.taskService.deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Task filtering and querying
  filterTasks(options: TaskFilterOptions): ValidatedTask[] {
    try {
      return this.taskService.filterTasks(options);
    } catch (error) {
      console.error('Error filtering tasks:', error);
      throw error;
    }
  }

  getAllTasks(): ValidatedTask[] {
    return this.taskService.getAllTasks();
  }

  // Task analysis
  isTaskCompletedBeforeDeadline(taskId: string): boolean | Error {
    try {
      return this.taskService.isTaskCompletedBeforeDeadline(taskId);
    } catch (error) {
      console.error('Error checking task deadline:', error);
      throw error;
    }
  }
<<<<<<< HEAD

=======
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
  // Convenience methods
  getTasksByStatus(status: Status): ValidatedTask[] {
    return this.filterTasks({ status });
  }
<<<<<<< HEAD

  getTasksByPriority(priority: Priority): ValidatedTask[] {
    return this.filterTasks({ priority });
  }
=======
  }
  getTasksByPriority(priority: Priority): ValidatedTask[] {
    return this.filterTasks({ priority });
  }
  }
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6

  getOverdueTasks(): ValidatedTask[] {
    const now = new Date();
    return this.getAllTasks().filter(task => 
<<<<<<< HEAD
      task.deadline && new Date(task.deadline) < now && task.status !== Status.Done
=======
      task.deadline && new Date(task.deadline) < now && task.status !== 'done'
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
    );
  }
}