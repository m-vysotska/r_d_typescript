import { Task } from './task.model';
import { TaskBase, BugData } from '../task.types';
import { BugDataSchema } from '../task.types';
import { validateData } from '../validators/task-validator';

export class Bug extends Task {
  private _bugData: BugData;

  constructor(taskData: TaskBase, bugSpecificData: Omit<BugData, keyof TaskBase>) {
    super(taskData);
    // Validate only the bug-specific fields
    validateData(bugSpecificData, BugDataSchema, 'Bug');
    // Combine TaskBase with bug-specific data to create full BugData
    this._bugData = { ...taskData, ...bugSpecificData };
  }

  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo();
    return `${baseInfo}
- Severity: ${this._bugData.severity}
- Environment: ${this._bugData.environment || 'Not specified'}
- Reproduction Steps:
  ${this._bugData.reproductionSteps.map(step => `- ${step}`).join('\n  ')}`;
  }

  get severity(): string {
    return this._bugData.severity;
  }

  get reproductionSteps(): string[] {
    return this._bugData.reproductionSteps;
  }

  get environment(): string | undefined {
    return this._bugData.environment;
  }

  get bugData(): BugData {
    return this._bugData;
  }
}

