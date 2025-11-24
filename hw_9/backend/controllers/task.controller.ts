import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { taskCreateSchema, taskUpdateSchema, taskQueryFiltersSchema } from '../types/task.schema.js';
import AppError from '../common/AppError.js';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryFilters = taskQueryFiltersSchema.parse(req.query);
    const tasks = taskService.getAllTasks(queryFilters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Task ID is required', 400);
    }

    const task = taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = taskCreateSchema.parse(req.body);
    const newTask = taskService.createTask(validatedData);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Task ID is required', 400);
    }

    const validatedData = taskUpdateSchema.parse(req.body);
    const updatedTask = taskService.updateTask(id, validatedData);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Task ID is required', 400);
    }

    taskService.deleteTask(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

