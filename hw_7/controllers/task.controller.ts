import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { TaskQueryFilters, taskCreateSchema, taskUpdateSchema, taskQueryFiltersSchema } from '../types/task.types.js';

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
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    const task = taskService.getTaskById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

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
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    const validatedData = taskUpdateSchema.parse(req.body);
    const updatedTask = taskService.updateTask(id, validatedData);

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    const deleted = taskService.deleteTask(id);

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

