import { Priority, Status, type Task, type TaskCreateInput } from "../types/task.types";

const API_BASE_URL = 'http://localhost:3000';

/**
 * Create a new task (POST)
 */
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  const taskToCreate = {
    ...taskData,
    status: taskData.status || Status.Todo,
    priority: taskData.priority || Priority.Medium,
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
