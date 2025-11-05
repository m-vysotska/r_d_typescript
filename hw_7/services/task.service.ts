import { Task, TaskCreateInput, TaskUpdateInput, TaskQueryFilters, Status, Priority } from '../types/task.types.js';

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

  getTaskById(id: string): Task | null {
    const task = this.tasks.find(task => task.id === id);
    return task || null;
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

  updateTask(id: string, taskData: TaskUpdateInput): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const taskService = new TaskService();

