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

export type Task = Required<TaskCreateInput> & {
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
};

export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

export type TaskQueryFilters = {
  createdAt?: string;
  status?: Status;
  priority?: Priority;
};
