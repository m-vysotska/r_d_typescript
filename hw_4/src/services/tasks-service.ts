import { v4 as uuid4, validate } from 'uuid';
import tasks from '../tasks.json'
import { Task, TaskCreateInput, TaskFilterOptions, TaskUpdateInput, ValidatedTask } from '../types/ITask'
import { parsedTasks, validateTask } from '../validators/task-validator'

export function getTaskById(id: string): ValidatedTask | undefined {
  return parsedTasks.find(task => task.id === id);
}

export function createTask(newTask: TaskCreateInput): Task {
  const task: Task = {
    id: uuid4(),
    createdAt: new Date(),
    ...newTask
  };

  const validatedTask = validateTask(task);
  parsedTasks.push(validatedTask);

  console.log("Task created:", validatedTask);
  console.log("Tasks list:", parsedTasks);

  return task;
}

export function updateTask(id: string, updateInput: TaskUpdateInput): Task | undefined {
  const taskIndex = parsedTasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return undefined;
  let updatedTask = { 
    ...tasks[taskIndex], 
    ...updateInput,
    updatedAt: new Date()
  };
  const validatedTask = validateTask(updatedTask);
  parsedTasks[taskIndex] = validatedTask;

  console.log("Task updated:", validatedTask);
  console.log("Tasks updated list:", parsedTasks);

  return validatedTask;
}

export function deleteTask(id: string): boolean {
  const taskIndex= parsedTasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return false;
  parsedTasks.splice(taskIndex, 1)
  console.log("Task deleted, updated list:", tasks);

  return true
}

export function filterTasks(options: TaskFilterOptions): ValidatedTask[] {
  const filteredTasks = parsedTasks.filter(task => {
    if (options.status && task.status !== options.status) return false
    if (options.priority && task.priority !== options.priority) return false

    const createdAt = new Date(task.createdAt).getTime()
    const after = options.createdAfter ? new Date(options.createdAfter).getTime() : -Infinity
    const before = options.createdBefore ? new Date(options.createdBefore).getTime() : Infinity

    if (createdAt <= after || createdAt >= before) return false

    return true
  });
  console.log("Filtered tasks:", filteredTasks);
  return filteredTasks
}

export function isTaskCompletedBeforeDeadline(taskId: string): boolean | Error {
  const task = getTaskById(taskId);
  if (!task) throw new Error("Task doesn't exist")

  if (task.status !== "done") return false

  const deadline = new Date(task.deadline).getTime()
  const completedAt = task.updatedAt ? new Date(task.updatedAt).getTime() : new Date().getTime()

  return deadline >= completedAt
}