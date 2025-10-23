import { z } from 'zod';
import { 
  TaskBase,
  SubtaskData, 
  BugData, 
  StoryData, 
  EpicData,
  SubtaskDataSchema,
  BugDataSchema,
  StoryDataSchema,
  EpicDataSchema
} from './task.types';

export class Task {
  protected taskData: TaskBase;

  constructor(taskData: TaskBase) {
    this.taskData = taskData;
  }

  getTaskInfo(): string {
    return `Task Information:
- ID: ${this.taskData.id}
- Title: ${this.taskData.title}
- Description: ${this.taskData.description}
- Status: ${this.taskData.status}
- Priority: ${this.taskData.priority}
- Created: ${new Date(this.taskData.createdAt).toISOString()}
- Updated: ${this.taskData.updatedAt ? new Date(this.taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this.taskData.deadline).toISOString()}`.trim();
  }

  getId(): string {
    return this.taskData.id;
  }

  getTitle(): string {
    return this.taskData.title;
  }

  getStatus(): string {
    return this.taskData.status;
  }
}

export class Subtask extends Task {
  private subtaskData: SubtaskData;

  constructor(taskData: TaskBase, subtaskData: SubtaskData) {
    super(taskData);
    
    // Validate subtask data using Zod
    try {
      this.subtaskData = SubtaskDataSchema.parse(subtaskData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Subtask validation failed: ${errorMessages}`);
      }
      throw error;
    }
  }

  getTaskInfo(): string {
    return `Subtask Information:
- ID: ${this.taskData.id}
- Title: ${this.taskData.title}
- Description: ${this.taskData.description}
- Status: ${this.taskData.status}
- Priority: ${this.taskData.priority}
- Parent Task ID: ${this.subtaskData.parentTaskId}
- Estimated Hours: ${this.subtaskData.estimatedHours || 'Not estimated'}
- Created: ${new Date(this.taskData.createdAt).toISOString()}
- Updated: ${this.taskData.updatedAt ? new Date(this.taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this.taskData.deadline).toISOString()}`;
  }

  getParentTaskId(): string {
    return this.subtaskData.parentTaskId;
  }

  getEstimatedHours(): number | undefined {
    return this.subtaskData.estimatedHours;
  }
}

export class Bug extends Task {
  private bugData: BugData;

  constructor(taskData: TaskBase, bugData: BugData) {
    super(taskData);
    
    // Validate bug data using Zod
    try {
      this.bugData = BugDataSchema.parse(bugData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Bug validation failed: ${errorMessages}`);
      }
      throw error;
    }
  }

  getTaskInfo(): string {
    return `Bug Information:
- ID: ${this.taskData.id}
- Title: ${this.taskData.title}
- Description: ${this.taskData.description}
- Status: ${this.taskData.status}
- Priority: ${this.taskData.priority}
- Severity: ${this.bugData.severity}
- Environment: ${this.bugData.environment || 'Not specified'}
- Reproduction Steps: ${this.bugData.reproductionSteps.join('\n  - ')}
- Created: ${new Date(this.taskData.createdAt).toISOString()}
- Updated: ${this.taskData.updatedAt ? new Date(this.taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this.taskData.deadline).toISOString()}`;
  }

  getSeverity(): string {
    return this.bugData.severity;
  }

  getReproductionSteps(): string[] {
    return this.bugData.reproductionSteps;
  }

  getEnvironment(): string | undefined {
    return this.bugData.environment;
  }
}

export class Story extends Task {
  private storyData: StoryData;

  constructor(taskData: TaskBase, storyData: StoryData) {
    super(taskData);
    
    // Validate story data using Zod
    try {
      this.storyData = StoryDataSchema.parse(storyData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Story validation failed: ${errorMessages}`);
      }
      throw error;
    }
  }

  getTaskInfo(): string {
    return `Story Information:
- ID: ${this.taskData.id}
- Title: ${this.taskData.title}
- Description: ${this.taskData.description}
- Status: ${this.taskData.status}
- Priority: ${this.taskData.priority}
- Story Points: ${this.storyData.storyPoints}
- Epic ID: ${this.storyData.epicId || 'Not assigned to epic'}
- Acceptance Criteria: ${this.storyData.acceptanceCriteria.join('\n  - ')}
- Created: ${new Date(this.taskData.createdAt).toISOString()}
- Updated: ${this.taskData.updatedAt ? new Date(this.taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this.taskData.deadline).toISOString()}`;
  }

  getStoryPoints(): number {
    return this.storyData.storyPoints;
  }

  getAcceptanceCriteria(): string[] {
    return this.storyData.acceptanceCriteria;
  }

  getEpicId(): string | undefined {
    return this.storyData.epicId;
  }
}

export class Epic extends Task {
  private epicData: EpicData;

  constructor(taskData: TaskBase, epicData: EpicData) {
    super(taskData);
    
    try {
      this.epicData = EpicDataSchema.parse(epicData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Epic validation failed: ${errorMessages}`);
      }
      throw error;
    }
  }

  getTaskInfo(): string {
    return `Epic Information:
- ID: ${this.taskData.id}
- Title: ${this.taskData.title}
- Description: ${this.taskData.description}
- Status: ${this.taskData.status}
- Priority: ${this.taskData.priority}
- Epic Goal: ${this.epicData.epicGoal}
- Estimated Duration: ${this.epicData.estimatedDuration ? `${this.epicData.estimatedDuration} days` : 'Not estimated'}
- Child Stories: ${this.epicData.childStories.length} stories
  ${this.epicData.childStories.map(id => `- ${id}`).join('\n  ')}
- Created: ${new Date(this.taskData.createdAt).toISOString()}
- Updated: ${this.taskData.updatedAt ? new Date(this.taskData.updatedAt).toISOString() : 'Never'}
- Deadline: ${new Date(this.taskData.deadline).toISOString()}`;
  }

  getEpicGoal(): string {
    return this.epicData.epicGoal;
  }

  getChildStories(): string[] {
    return this.epicData.childStories;
  }

  getEstimatedDuration(): number | undefined {
    return this.epicData.estimatedDuration;
  }

  addChildStory(storyId: string): void {
    // Validate UUID format
    if (!z.string().uuid().safeParse(storyId).success) {
      throw new Error('Invalid story ID format');
    }
    
    if (!this.epicData.childStories.includes(storyId)) {
      this.epicData.childStories.push(storyId);
    }
  }

  removeChildStory(storyId: string): void {
    // Validate UUID format
    if (!z.string().uuid().safeParse(storyId).success) {
      throw new Error('Invalid story ID format');
    }
    
    const index = this.epicData.childStories.indexOf(storyId);
    if (index > -1) {
      this.epicData.childStories.splice(index, 1);
    }
  }
}