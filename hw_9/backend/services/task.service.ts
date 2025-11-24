import { Task, TaskCreateInput, TaskUpdateInput, TaskQueryFilters, Status, Priority } from '../types/task.types.js';
import AppError from '../common/AppError.js';

class TaskService {
  private tasks: Task[] = [];

  getAllTasks(filters?: TaskQueryFilters): Task[] {
    let filteredTasks = [...this.tasks];

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }

      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }

      if (filters.createdAt) {
        const filterDate = new Date(filters.createdAt);
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0];
        });
      }
    }

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  createTask(taskData: TaskCreateInput): Task {
    const newTask: Task = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || Status.Todo,
      priority: taskData.priority || Priority.Medium,
      deadline: taskData.deadline,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, taskData: TaskUpdateInput): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    this.tasks.splice(taskIndex, 1);
  }

  clearTasks(): void {
    this.tasks = [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const taskService = new TaskService();




