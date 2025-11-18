import type { Task, TaskCreateInput } from './types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Get all tasks
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure json-server is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure json-server is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Create a new task (POST)
 */
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  const taskToCreate = {
    ...taskData,
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    createdAt: new Date(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskToCreate),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText} (${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure json-server is running on ${API_BASE_URL}. Run "npm run server" in a separate terminal.`
      );
    }
    throw error;
  }
}


export type { TaskCreateInput };
