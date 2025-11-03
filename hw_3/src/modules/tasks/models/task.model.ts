import { TaskBase } from '../task.types';

export class Task {
  protected _taskData: TaskBase;

  constructor(taskData: TaskBase) {
    this._taskData = taskData;
  }

  getTaskInfo(): string {
    return `Task Information:
- ID: ${this._taskData.id}
- Title: ${this._taskData.title}
- Description: ${this._taskData.description}
- Status: ${this._taskData.status}
- Priority: ${this._taskData.priority}
- Created: ${new Date(this._taskData.createdAt).toISOString()}
- Updated: ${this._taskData.updatedAt ? new Date(this._taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this._taskData.deadline).toISOString()}`.trim();
  }

  get id(): string {
    return this._taskData.id;
  }

  get title(): string {
    return this._taskData.title;
  }

  get status(): string {
    return this._taskData.status;
  }

  get taskBase(): TaskBase {
    return this._taskData;
  }

  set taskData(value: TaskBase) {
    this._taskData = value;
  }
}

