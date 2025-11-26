import { Op, WhereOptions } from 'sequelize';
import { Task } from '../models/index.js';
import {
  TaskCreateInput,
  TaskUpdateInput,
  TaskQueryFilters,
  Status,
  Priority,
} from '../types/task.types.js';
import AppError from '../common/AppError.js';

class TaskService {
  async getAllTasks(filters?: TaskQueryFilters): Promise<Task[]> {
    const whereClause: WhereOptions = {};

    if (filters) {
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.createdAt) {
        const filterDate = new Date(filters.createdAt);
        const startOfDay = new Date(filterDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filterDate);
        endOfDay.setHours(23, 59, 59, 999);

        whereClause.createdAt = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }
    }

    try {
      const tasks = await Task.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new AppError('Failed to fetch tasks', 500);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await Task.findByPk(id);

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      return task;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error fetching task:', error);
      throw new AppError('Failed to fetch task', 500);
    }
  }

  async createTask(taskData: TaskCreateInput): Promise<Task> {
    try {
      const newTask = await Task.create({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || Status.Todo,
        priority: taskData.priority || Priority.Medium,
        deadline: taskData.deadline,
      });

      return newTask;
    } catch (error: unknown) {
      console.error('Error creating task:', error);

      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'SequelizeValidationError'
      ) {
        const sequelizeError = error as unknown as { errors: Array<{ message: string }> };
        const validationErrors = sequelizeError.errors.map((err) => err.message).join(', ');
        throw new AppError(`Validation error: ${validationErrors}`, 400);
      }

      throw new AppError('Failed to create task', 500);
    }
  }

  async updateTask(id: string, taskData: TaskUpdateInput): Promise<Task> {
    try {
      const task = await Task.findByPk(id);

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      // Update only provided fields
      const updateData: Partial<TaskUpdateInput> = {};
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.status !== undefined) updateData.status = taskData.status;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.deadline !== undefined) updateData.deadline = taskData.deadline;

      await task.update(updateData);
      await task.reload();

      return task;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('Error updating task:', error);

      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'SequelizeValidationError'
      ) {
        const sequelizeError = error as unknown as { errors: Array<{ message: string }> };
        const validationErrors = sequelizeError.errors.map((err) => err.message).join(', ');
        throw new AppError(`Validation error: ${validationErrors}`, 400);
      }

      throw new AppError('Failed to update task', 500);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const task = await Task.findByPk(id);

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      await task.destroy();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting task:', error);
      throw new AppError('Failed to delete task', 500);
    }
  }

  async clearTasks(): Promise<void> {
    try {
      await Task.destroy({ where: {} });
    } catch (error) {
      console.error('Error clearing tasks:', error);
      throw new AppError('Failed to clear tasks', 500);
    }
  }
}

export const taskService = new TaskService();
