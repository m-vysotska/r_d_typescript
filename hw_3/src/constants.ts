import { Priority, Status } from "./types/ITask"

export const defaultStatus: Status = Status.Todo
export const statuses: Status[] = Object.values(Status)

export const defaultPriority: Priority = Priority.Medium
export const priorities: Priority[] = Object.values(Priority)
