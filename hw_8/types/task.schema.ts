import { z } from 'zod';

export const Status = {
  Todo: 'todo',
  InProgress: 'in_progress',
  Done: 'done'
} as const;

export type Status = typeof Status[keyof typeof Status];

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const statusValues = Object.values(Status) as [string, ...string[]];
export const priorityValues = Object.values(Priority) as [string, ...string[]];

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
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  assigneeId: z.string().min(1, 'Assignee ID is required')
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




