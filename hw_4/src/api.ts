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

export const DEFAULT_STATUS = Status.Todo;
export const DEFAULT_PRIORITY = Priority.Medium;

export type Task = TaskCreateInput & {
  id: string
  createdAt: string | Date 
  updatedAt?: string | Date
}

export type TaskCreateInput = {
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
  deadline: string;
}

export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetch API utility functions for task management
 */

/**
 * Get all tasks
 */
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Create a new task (POST)
 */
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  const taskToCreate = {
    ...taskData,
    status: taskData.status || DEFAULT_STATUS,
    priority: taskData.priority || DEFAULT_PRIORITY,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskToCreate),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a task (PUT - full update)
 */
export async function updateTask(id: string, taskData: Task): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...taskData,
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Partially update a task (PATCH - partial update)
 */
export async function patchTask(id: string, taskData: Partial<TaskUpdateInput>): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...taskData,
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a task (DELETE)
 */
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}

