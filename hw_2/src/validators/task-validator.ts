import { defaultPriority, defaultStatus, priorities, statuses } from '../constants';
import tasks from '../tasks.json';

import { z } from 'zod'
import { ValidatedTask } from '../types/ITask';

const schema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  createdAt: z.string().or(z.date()),
  status: z.enum(statuses).default(defaultStatus),
  priority: z.enum(priorities).default(defaultPriority),
  deadline: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional()
});

export function validateTask(task: unknown): ValidatedTask {
    return schema.parse(task)
}

export function validateTasks(tasks: unknown): ValidatedTask[] {
    const tasksSchema = z.array(schema);
    return tasksSchema.parse(tasks)
}

export const parsedTasks: ValidatedTask[] = validateTasks(tasks) as ValidatedTask[]
