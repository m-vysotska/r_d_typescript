import { createTask, deleteTask, filterTasks, getTaskById, isTaskCompletedBeforeDeadline, updateTask } from "./services/tasks-service";
import { Status } from "./types/ITask";
import { parsedTasks, validateTasks } from "./validators/task-validator";

console.log("Validated tasks:", parsedTasks);

const task = getTaskById('1');
console.log("Get Task By Id:", task);

createTask({
  title: "New Task",
  description: "This is a new task",
  status: Status.InProgress,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // one week from now
});

updateTask('1',{ title: "Updated Task Title" })
deleteTask('2')
filterTasks({ status: Status.Todo })

const taskId = '3'
console.log(`Task ${taskId} Completed Before Deadline:`, isTaskCompletedBeforeDeadline(taskId));
