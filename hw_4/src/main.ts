import { getTasks, createTask } from './api.ts';
import type { Task, TaskCreateInput } from './api.ts';

const taskListElement = document.getElementById('task-list');
const taskForm = document.getElementById('task-form') as HTMLFormElement;

/**
 * Render tasks in the UI
 */
function renderTasks(tasks: Task[]) {
  if (!taskListElement) return;

  if (tasks.length === 0) {
    taskListElement.innerHTML = '<div class="empty-state">No tasks yet. Create your first task!</div>';
    return;
  }

  const tasksHTML = tasks.map(task => {
    const createdAt = new Date(task.createdAt).toLocaleDateString();
    const deadline = new Date(task.deadline).toLocaleDateString();
    
    const statusClass = `status-${task.status.replace('_', '-')}`;
    const priorityClass = `priority-${task.priority}`;

    return `
      <div class="task-item">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="task-meta">
          <span class="badge ${statusClass}">${task.status.replace('_', ' ')}</span>
          <span class="badge ${priorityClass}">${task.priority}</span>
          <span><strong>Created:</strong> ${createdAt}</span>
          <span><strong>Deadline:</strong> ${deadline}</span>
        </div>
      </div>
    `;
  }).join('');

  taskListElement.innerHTML = tasksHTML;
}

/**
 * Load and display all tasks
 */
async function loadTasks() {
  try {
    const tasks = await getTasks();
    renderTasks(tasks);
  } catch (error) {
    if (taskListElement) {
      taskListElement.innerHTML = '<div class="empty-state" style="color: #c62828;">Error loading tasks. Make sure json-server is running on http://localhost:3000</div>';
    }
    console.error('Error loading tasks:', error);
  }
}

/**
 * Handle form submission to create a new task
 */
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(taskForm);
  
  const taskData: TaskCreateInput = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    status: formData.get('status') as any,
    priority: formData.get('priority') as any,
    deadline: formData.get('deadline') as string,
  };

  try {
    await createTask(taskData);
    taskForm.reset();
    await loadTasks();
  } catch (error) {
    alert('Failed to create task. Make sure json-server is running.');
    console.error('Error creating task:', error);
  }
});

// Load tasks when the page loads
loadTasks();
