export enum Status {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done'
}
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

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
}