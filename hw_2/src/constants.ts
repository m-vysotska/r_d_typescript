import { Priority, Status, StatusEnum, PriorityEnum } from "./types/ITask"

export const defaultStatus: Status = StatusEnum.Todo
export const statuses: Status[] = Object.values(StatusEnum)

export const defaultPriority: Priority = PriorityEnum.Medium
export const priorities: Priority[] = Object.values(PriorityEnum)
