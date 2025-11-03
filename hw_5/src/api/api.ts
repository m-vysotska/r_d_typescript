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

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
  createdAt: string;
  updatedAt?: string;
}

export type TaskCreateInput = {
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
  deadline: string;
}

const API_BASE_URL = 'http://localhost:3000';

/**
 * Create a new task (POST)
 */
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  const taskToCreate = {
    ...taskData,
    status: taskData.status || Status.Todo,
    priority: taskData.priority || Priority.Medium,
    createdAt: new Date().toISOString(),
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
