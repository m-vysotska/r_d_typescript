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

