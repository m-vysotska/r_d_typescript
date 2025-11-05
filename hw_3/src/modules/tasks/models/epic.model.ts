import { z } from 'zod';
import { Task } from './task.model';
import { TaskBase, EpicData } from '../task.types';
import { EpicDataSchema } from '../task.types';
import { validateData } from '../validators/task-validator';

export class Epic extends Task {
  private _epicData: EpicData;

  constructor(taskData: TaskBase, epicSpecificData: Omit<EpicData, keyof TaskBase>) {
    super(taskData);
    // Validate only the epic-specific fields
    validateData(epicSpecificData, EpicDataSchema, 'Epic');
    // Combine TaskBase with epic-specific data to create full EpicData
    this._epicData = { ...taskData, ...epicSpecificData };
  }

  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo();
    return `${baseInfo}
- Epic Goal: ${this._epicData.epicGoal}
- Estimated Duration: ${this._epicData.estimatedDuration ? `${this._epicData.estimatedDuration} days` : 'Not estimated'}
- Child Stories: ${this._epicData.childStories.length} stories
  ${this._epicData.childStories.map(id => `- ${id}`).join('\n  ')}`;
  }

  get epicGoal(): string {
    return this._epicData.epicGoal;
  }

  get childStories(): string[] {
    return this._epicData.childStories;
  }

  get estimatedDuration(): number | undefined {
    return this._epicData.estimatedDuration;
  }

  get epicData(): EpicData {
    return this._epicData;
  }

  addChildStory(storyId: string): void {
    if (!z.string().uuid().safeParse(storyId).success) {
      throw new Error('Invalid story ID format');
    }
    
    if (!this._epicData.childStories.includes(storyId)) {
      this._epicData.childStories.push(storyId);
    }
  }

  removeChildStory(storyId: string): void {
    if (!z.string().uuid().safeParse(storyId).success) {
      throw new Error('Invalid story ID format');
    }
    
    const index = this._epicData.childStories.indexOf(storyId);
    if (index > -1) {
      this._epicData.childStories.splice(index, 1);
    }
  }
}

