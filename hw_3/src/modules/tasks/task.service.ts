import { v4 as uuid4 } from 'uuid';
import { 
  TaskBase, 
  TaskCreateInput, 
  TaskUpdateInput, 
  TaskFilterOptions, 
<<<<<<< HEAD
  ValidatedTask,
  Status,
  Priority,
  TaskBaseSchema
=======
  ValidatedTask 
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
} from './task.types';

export class TaskService {
  private tasks: ValidatedTask[] = [];

  private validateTask(task: TaskBase): ValidatedTask {
<<<<<<< HEAD
    // Validate using Zod schema
    const validatedTask = TaskBaseSchema.parse(task);

    // Additional business logic validations
=======

>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
    if (!task.title || task.title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }
    
    if (!task.description || task.description.trim() === '') {
      throw new Error('Task description cannot be empty');
    }
    
<<<<<<< HEAD
    const deadlineDate = new Date(task.deadline);
    if (deadlineDate < new Date()) {
      throw new Error('Deadline cannot be in the past');
    }

    return validatedTask;
=======
    if (task.deadline && task.deadline < new Date()) {
      throw new Error('Deadline cannot be in the past');
    }
    
    if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
      throw new Error('Priority must be low, medium, or high');
    }
    
    if (task.status && !['todo', 'in-progress', 'done'].includes(task.status)) {
      throw new Error('Status must be todo, in-progress, or done');
    }

    return { ...task, isValid: true };
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
  }

  getTaskById(id: string): ValidatedTask | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(newTask: TaskCreateInput): ValidatedTask {
    const task: TaskBase = {
      id: uuid4(),
      createdAt: new Date(),
<<<<<<< HEAD
      status: Status.Todo,
      priority: Priority.Medium,
=======
      status: 'todo',
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6
      ...newTask
    };

    const validatedTask = this.validateTask(task);
    this.tasks.push(validatedTask);

    console.log("Task created:", validatedTask);
    console.log("Tasks list:", this.tasks);

    return validatedTask;
  }

  updateTask(id: string, updateInput: TaskUpdateInput): ValidatedTask | undefined {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return undefined;
    
    let updatedTask = { 
      ...this.tasks[taskIndex], 
      ...updateInput,
      updatedAt: new Date()
    };
    
    const validatedTask = this.validateTask(updatedTask);
    this.tasks[taskIndex] = validatedTask;

    console.log("Task updated:", validatedTask);
    console.log("Tasks updated list:", this.tasks);

    return validatedTask;
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;
    
    this.tasks.splice(taskIndex, 1);
    console.log("Task deleted, updated list:", this.tasks);

    return true;
  }

  filterTasks(options: TaskFilterOptions): ValidatedTask[] {
    const filteredTasks = this.tasks.filter(task => {
      if (options.status && task.status !== options.status) return false;
      if (options.priority && task.priority !== options.priority) return false;

      const createdAt = new Date(task.createdAt).getTime();
      const after = options.createdAfter ? new Date(options.createdAfter).getTime() : -Infinity;
      const before = options.createdBefore ? new Date(options.createdBefore).getTime() : Infinity;

      if (createdAt <= after || createdAt >= before) return false;

      return true;
    });
    
    console.log("Filtered tasks:", filteredTasks);
    return filteredTasks;
  }

  isTaskCompletedBeforeDeadline(taskId: string): boolean | Error {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task doesn't exist");

<<<<<<< HEAD
    if (task.status !== Status.Done) return false;
=======
    if (task.status !== "done") return false;

    if (!task.deadline) return true;
>>>>>>> 5cb277113906564c3b7f995c7270ee5c2273d2b6

    const deadline = new Date(task.deadline).getTime();
    const completedAt = task.updatedAt ? new Date(task.updatedAt).getTime() : new Date().getTime();

    return deadline >= completedAt;
  }

  getAllTasks(): ValidatedTask[] {
    return [...this.tasks];
  }
}