import { z } from 'zod';

export const Status = {
  Todo: 'todo',
  InProgress: 'in_progress',
  Done: 'done'
};

export type Status = typeof Status[keyof typeof Status];

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent'
};

export type Priority = typeof Priority[keyof typeof Priority];

export type Task = Required<TaskCreateInput> &{
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type TaskCreateInput = {
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
  deadline: string;
  assigneeId: string;
};

export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

export type TaskQueryFilters = {
  createdAt?: string;
  status?: Status;
  priority?: Priority;
};

// Validation schemas
export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be at most 1000 characters'),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  assigneeId: z.string().min(1, 'Assignee ID is required')
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z.string().min(1).optional(),
  assigneeId: z.string().min(1).optional()
});

export const taskQueryFiltersSchema = z.object({
  createdAt: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
});

