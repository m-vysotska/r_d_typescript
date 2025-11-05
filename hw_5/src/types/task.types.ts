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

