import { z } from 'zod';
import { Status, Priority } from './task.types.js';

// Reusable enum arrays for Zod schemas
export const statusValues = Object.values(Status) as [string, ...string[]];
export const priorityValues = Object.values(Priority) as [string, ...string[]];

// Validation schemas
export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be at most 1000 characters'),
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional(),
  deadline: z.string().min(1, 'Deadline is required')
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const taskQueryFiltersSchema = z.object({
  createdAt: z.string().optional(),
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional()
});

export const taskParamsSchema = z.object({
  id: z.string().min(1, 'Task ID is required')
});

