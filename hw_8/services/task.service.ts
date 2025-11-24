import { Task } from '../models/Task.model.js';
import { User } from '../models/User.model.js';
import { TaskCreateInput, TaskUpdateInput, TaskQueryFilters, Status, Priority } from '../types/task.schema.js';
import { Op, WhereOptions } from 'sequelize';
import type { TaskAttributes } from '../models/Task.model.js';
import AppError from '../common/AppError.js';

class TaskService {
  async getAllTasks (filters?: TaskQueryFilters): Promise<Task[]> {
    const whereClause: WhereOptions<TaskAttributes> = {};

    if (filters) {
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.createdAt) {
        const filterDate = new Date(filters.createdAt);
        const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
        whereClause.createdAt = {
          [Op.between]: [startOfDay, endOfDay]
        };
      }
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return tasks;
  }

  async getTaskById (id: string): Promise<Task> {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  async createTask (taskData: TaskCreateInput): Promise<Task> {
    const assignee = await User.findByPk(taskData.assigneeId);
    if (!assignee) {
      throw new AppError('Assignee not found', 400);
    }

    const newTask = await Task.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || Status.Todo,
      priority: taskData.priority || Priority.Medium,
      deadline: taskData.deadline,
      assigneeId: taskData.assigneeId
    });

    const taskWithAssignee = await Task.findByPk(newTask.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return taskWithAssignee!;
  }

  async updateTask (id: string, taskData: TaskUpdateInput): Promise<Task> {
    const task = await Task.findByPk(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (taskData.assigneeId) {
      const assignee = await User.findByPk(taskData.assigneeId);
      if (!assignee) {
        throw new AppError('Assignee not found', 400);
      }
    }

    const { updatedAt, ...updateFields } = taskData;
    await task.update(updateFields);

    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return updatedTask!;
  }

  async deleteTask (id: string): Promise<void> {
    const task = await Task.findByPk(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await task.destroy();
  }
}

export const taskService = new TaskService();

