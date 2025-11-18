export const Status = {
  Todo: 'todo',
  InProgress: 'in_progress',
  Done: 'done'
};

export type IStatus = typeof Status[keyof typeof Status];

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent'
};
export type IPriority = typeof Priority[keyof typeof Priority];

export type Task = Required<TaskCreateInput> & {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export type TaskCreateInput = {
  title: string;
  description: string;
  status?: IStatus;
  priority?: IPriority;
  deadline: string;
}