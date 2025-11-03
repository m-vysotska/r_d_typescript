import { Task } from './task.model';
import { TaskBase, StoryData } from '../task.types';
import { StoryDataSchema } from '../task.types';
import { validateData } from '../validators/task-validator';

export class Story extends Task {
  private _storyData: StoryData;

  constructor(taskData: TaskBase, storySpecificData: Omit<StoryData, keyof TaskBase>) {
    super(taskData);
    // Validate only the story-specific fields
    validateData(storySpecificData, StoryDataSchema, 'Story');
    // Combine TaskBase with story-specific data to create full StoryData
    this._storyData = { ...taskData, ...storySpecificData } as StoryData;
  }

  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo();
    return `${baseInfo}
- Story Points: ${this._storyData.storyPoints}
- Epic ID: ${this._storyData.epicId || 'Not assigned to epic'}
- Acceptance Criteria:
  ${this._storyData.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n  ')}`;
  }

  get storyPoints(): number {
    return this._storyData.storyPoints;
  }

  get acceptanceCriteria(): string[] {
    return this._storyData.acceptanceCriteria;
  }

  get epicId(): string | undefined {
    return this._storyData.epicId;
  }

  get storyData(): StoryData {
    return this._storyData;
  }
}

