import { TaskController } from './modules/tasks/task.controller';
import { Task, Subtask, Bug, Story, Epic } from './modules/tasks/task.classes';
import { Status, Priority } from './modules/tasks/task.types';

const taskController = new TaskController();

console.log("=== Task Management System ===");

const task1 = taskController.createTask({
  title: "Implement user authentication",
  description: "Add login and registration functionality",
  status: Status.Todo,
  priority: Priority.High,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // one week from now
});

const task2 = taskController.createTask({
  title: "Fix login bug",
  description: "Users cannot login with special characters in password",
  status: Status.InProgress,
  priority: Priority.Urgent,
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // two days from now
});

console.log("\n=== Created Tasks ===");
console.log("Task 1:", task1);
console.log("Task 2:", task2);

// Update a task
const updatedTask = taskController.updateTask(task1.id, { 
  title: "Implement user authentication with OAuth",
  status: Status.InProgress 
});
console.log("\n=== Updated Task ===");
console.log("Updated:", updatedTask);

// Filter tasks by status
const todoTasks = taskController.getTasksByStatus(Status.Todo);
console.log("\n=== Todo Tasks ===");
console.log(todoTasks);

// Filter tasks by priority
const urgentTasks = taskController.getTasksByPriority(Priority.Urgent);
console.log("\n=== Urgent Tasks ===");
console.log(urgentTasks);

// Check if task completed before deadline
const isCompletedOnTime = taskController.isTaskCompletedBeforeDeadline(task1.id);
console.log(`\n=== Task ${task1.id} completed before deadline: ${isCompletedOnTime}`);

// Get all tasks
const allTasks = taskController.getAllTasks();
console.log("\n=== All Tasks ===");
console.log(allTasks);

// Example of using task classes
console.log("\n=== Task Classes Examples ===");

// Create a base task
const baseTaskData = {
  id: "task-123",
  title: "Sample Task",
  description: "This is a sample task",
  status: Status.Todo,
  priority: Priority.Medium,
  deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: undefined
};

const baseTask = new Task(baseTaskData);
console.log("Base Task Info:");
console.log(baseTask.getTaskInfo());

// Create a subtask
const subtask = new Subtask(baseTaskData, {
  parentTaskId: "parent-123",
  estimatedHours: 4
});
console.log("\nSubtask Info:");
console.log(subtask.getTaskInfo());

// Create a bug
const bug = new Bug(baseTaskData, {
  severity: "high",
  reproductionSteps: [
    "1. Go to login page",
    "2. Enter password with special characters",
    "3. Click login button",
    "4. See error message"
  ],
  environment: "Production"
});
console.log("\nBug Info:");
console.log(bug.getTaskInfo());

// Create a story
const story = new Story(baseTaskData, {
  storyPoints: 8,
  acceptanceCriteria: [
    "User can login with email and password",
    "User receives confirmation email",
    "Password must be at least 8 characters"
  ],
  epicId: "epic-456"
});
console.log("\nStory Info:");
console.log(story.getTaskInfo());

// Create an epic
const epic = new Epic(baseTaskData, {
  epicGoal: "Implement comprehensive user management system",
  childStories: ["story-1", "story-2", "story-3"],
  estimatedDuration: 30
});
console.log("\nEpic Info:");
console.log(epic.getTaskInfo());
