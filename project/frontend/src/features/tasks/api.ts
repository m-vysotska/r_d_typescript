import type { Task, TaskCreateInput, TaskUpdateInput } from './types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Get all tasks
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure the backend is running on ${API_BASE_URL}.`
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
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`);
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
        `Cannot connect to the server. Please make sure the backend is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Create a new task (POST)
 */
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText} (${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure the backend is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Update a task (PUT)
 */
export async function updateTask(id: string, taskData: TaskUpdateInput): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(`Failed to update task: ${response.statusText} (${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure the backend is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

/**
 * Delete a task (DELETE)
 */
export async function deleteTask(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(`Failed to delete task: ${response.statusText} (${response.status})`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to the server. Please make sure the backend is running on ${API_BASE_URL}.`
      );
    }
    throw error;
  }
}

export type { TaskCreateInput, TaskUpdateInput };
