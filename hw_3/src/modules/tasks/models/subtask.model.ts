import { Task } from './task.model';
import { TaskBase, SubtaskData } from '../task.types';
import { SubtaskDataSchema } from '../task.types';
import { validateData } from '../validators/task-validator';

export class Subtask extends Task {
  private _subtaskData: SubtaskData;

  constructor(taskData: TaskBase, subtaskSpecificData: Omit<SubtaskData, keyof TaskBase>) {
    super(taskData);
    // Validate only the subtask-specific fields
    validateData(subtaskSpecificData, SubtaskDataSchema, 'Subtask');
    // Combine TaskBase with subtask-specific data to create full SubtaskData
    this._subtaskData = { ...taskData, ...subtaskSpecificData } as SubtaskData;
  }

  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo();
    return `${baseInfo}
- Parent Task ID: ${this._subtaskData.parentTaskId}
- Estimated Hours: ${this._subtaskData.estimatedHours || 'Not estimated'}`;
  }

  get parentTaskId(): string {
    return this._subtaskData.parentTaskId;
  }

  get estimatedHours(): number | undefined {
    return this._subtaskData.estimatedHours;
  }

  get subtaskData(): SubtaskData {
    return this._subtaskData;
  }
}

