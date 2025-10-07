export enum StatusEnum {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done'
}
export enum PriorityEnum {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

export type Status = StatusEnum.Todo | StatusEnum.InProgress | StatusEnum.Done
export type Priority = PriorityEnum.Low | PriorityEnum.Medium | PriorityEnum.High | PriorityEnum.Urgent

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
