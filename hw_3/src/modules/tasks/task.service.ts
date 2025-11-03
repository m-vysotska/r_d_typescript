import { v4 as uuid4 } from 'uuid';
import { 
  TaskBase, 
  TaskCreateInput, 
  TaskUpdateInput, 
  TaskFilterOptions, 
  ValidatedTask,
  Status,
  Priority,
  TaskBaseSchema,
  TaskType,
  SubtaskData,
  BugData,
  StoryData,
  EpicData
} from './task.types';
import { Task, Subtask, Bug, Story, Epic } from './models';
import { validateData } from './validators/task-validator';

export class TaskService {
  private tasks: Task[] = [];

  private validateTask(task: TaskBase): ValidatedTask {
    const validatedTask = validateData(task, TaskBaseSchema, 'Task');

    // Additional business logic validations
    if (!task.title || task.title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }
    
    if (!task.description || task.description.trim() === '') {
      throw new Error('Task description cannot be empty');
    }
    
    const deadlineDate = new Date(task.deadline);
    if (deadlineDate < new Date()) {
      throw new Error('Deadline cannot be in the past');
    }

    return validatedTask;
  }

  /**
   * Factory method to create task objects based on type
   */
  createTaskFromType(
    type: TaskType,
    taskData: TaskCreateInput,
    specificData?: SubtaskData | BugData | StoryData | EpicData
  ): Task {
    const baseTask: TaskBase = {
      id: uuid4(),
      createdAt: new Date(),
      status: taskData.status || Status.Todo,
      priority: taskData.priority || Priority.Medium,
      ...taskData
    };

    this.validateTask(baseTask);

    switch (type) {
      case 'task':
        return new Task(baseTask);
      case 'subtask':
        if (!specificData || !('parentTaskId' in specificData)) {
          throw new Error('Subtask requires SubtaskData with parentTaskId');
        }
        // Extract only subtask-specific fields (omit TaskBase fields)
        const { parentTaskId, estimatedHours } = specificData as SubtaskData;
        return new Subtask(baseTask, { parentTaskId, estimatedHours });
      case 'bug':
        if (!specificData || !('severity' in specificData)) {
          throw new Error('Bug requires BugData with severity');
        }
        // Extract only bug-specific fields
        const { severity, reproductionSteps, environment } = specificData as BugData;
        return new Bug(baseTask, { severity, reproductionSteps, environment });
      case 'story':
        if (!specificData || !('storyPoints' in specificData)) {
          throw new Error('Story requires StoryData with storyPoints');
        }
        // Extract only story-specific fields
        const { storyPoints, acceptanceCriteria, epicId } = specificData as StoryData;
        return new Story(baseTask, { storyPoints, acceptanceCriteria, epicId });
      case 'epic':
        if (!specificData || !('epicGoal' in specificData)) {
          throw new Error('Epic requires EpicData with epicGoal');
        }
        // Extract only epic-specific fields
        const { epicGoal, childStories, estimatedDuration } = specificData as EpicData;
        return new Epic(baseTask, { epicGoal, childStories, estimatedDuration });
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * Add a Task object to the tasks array
   */
  addTask(task: Task): void {
    this.tasks.push(task);
    console.log("Task added:", task.getTaskInfo());
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  getTaskByIdAsValidated(id: string): ValidatedTask | undefined {
    const task = this.getTaskById(id);
    if (!task) return undefined;
    return task.taskBase as ValidatedTask;
  }

  createTask(newTask: TaskCreateInput): ValidatedTask {
    const taskObj = this.createTaskFromType('task', newTask);
    this.addTask(taskObj);
    return taskObj.taskBase as ValidatedTask;
  }

  updateTask(id: string, updateInput: TaskUpdateInput): ValidatedTask | undefined {
    const task = this.getTaskById(id);
    if (!task) return undefined;
    
    const updatedBase: TaskBase = {
      ...task.taskBase,
      ...updateInput,
      updatedAt: new Date()
    };
    
    this.validateTask(updatedBase);
    
    // Update the task's base data
    task.taskData = updatedBase;
    
    const index = this.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      this.tasks[index] = task;
    }

    console.log("Task updated:", task.getTaskInfo());
    return updatedBase as ValidatedTask;
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;
    
    this.tasks.splice(taskIndex, 1);
    console.log("Task deleted, updated list:", this.tasks.length);

    return true;
  }

  filterTasks(options: TaskFilterOptions): Task[] {
    const filteredTasks = this.tasks.filter(task => {
      const taskBase = task.taskBase;
      if (options.status && taskBase.status !== options.status) return false;
      if (options.priority && taskBase.priority !== options.priority) return false;

      const createdAt = new Date(taskBase.createdAt).getTime();
      const after = options.createdAfter ? new Date(options.createdAfter).getTime() : -Infinity;
      const before = options.createdBefore ? new Date(options.createdBefore).getTime() : Infinity;

      if (createdAt <= after || createdAt >= before) return false;

      return true;
    });
    
    console.log("Filtered tasks:", filteredTasks.length);
    return filteredTasks;
  }

  isTaskCompletedBeforeDeadline(taskId: string): boolean | Error {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task doesn't exist");

    const taskBase = task.taskBase;
    if (taskBase.status !== Status.Done) return false;

    const deadline = new Date(taskBase.deadline).getTime();
    const completedAt = taskBase.updatedAt ? new Date(taskBase.updatedAt).getTime() : new Date().getTime();

    return deadline >= completedAt;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getAllTasksAsValidated(): ValidatedTask[] {
    return this.tasks.map(task => task.taskBase as ValidatedTask);
  }
}