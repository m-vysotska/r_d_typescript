<<<<<<< HEAD
import { z } from 'zod';

=======
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
export enum Status {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done'
}
<<<<<<< HEAD

=======
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

<<<<<<< HEAD
// Base task type
export type TaskBase = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type TaskCreateInput = {
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
  deadline: string | Date;
}

export type TaskUpdateInput = Partial<Omit<TaskBase, 'createdAt' | 'id'>>;

export type ValidatedTask = Required<Omit<TaskBase, 'updatedAt'>> & { updatedAt?: string | Date };

export type TaskFilterOptions = {
  status?: Status;
  priority?: Priority;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
}

// Task type specific data interfaces
=======
export type TaskCreateInput = {
  title: string
  description: string
  status?: Status
  priority?: Priority
  deadline: string | Date 
}

export type TaskUpdateInput = Partial<Omit<Task, 'createdAt' | 'id'>> 

export type Task = TaskCreateInput & {
  id: string
  createdAt: string | Date 
  updatedAt?: string | Date
}

export type ValidatedTask = Required<Omit<Task, 'updatedAt'>> & { updatedAt?: string | Date}

export type TaskFilterOptions = {
  status?: Status
  priority?: Priority
  createdAfter?: string | Date 
  createdBefore?: string | Date
}

>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
export interface SubtaskData {
  parentTaskId: string;
  estimatedHours?: number;
}

export interface BugData {
  severity: 'low' | 'medium' | 'high' | 'critical';
  reproductionSteps: string[];
  environment?: string;
}

export interface StoryData {
  storyPoints: number;
  acceptanceCriteria: string[];
  epicId?: string;
}

export interface EpicData {
  epicGoal: string;
  childStories: string[];
  estimatedDuration?: number; // in days
<<<<<<< HEAD
}

// Validation schemas
const TaskBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  deadline: z.union([z.string(), z.date()]),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]).optional()
});

export const SubtaskDataSchema = z.object({
  parentTaskId: z.string().min(1),
  estimatedHours: z.number().positive().optional()
});

export const BugDataSchema = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  reproductionSteps: z.array(z.string().min(1)),
  environment: z.string().optional()
});

export const StoryDataSchema = z.object({
  storyPoints: z.number().positive(),
  acceptanceCriteria: z.array(z.string().min(1)),
  epicId: z.string().optional()
});

export const EpicDataSchema = z.object({
  epicGoal: z.string().min(1),
  childStories: z.array(z.string()),
  estimatedDuration: z.number().positive().optional()
});

export { TaskBaseSchema };
=======
}
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
