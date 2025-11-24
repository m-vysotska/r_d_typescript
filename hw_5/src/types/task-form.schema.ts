import z from "zod";
import { Priority, Status } from "./task.types";

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  status: z.nativeEnum(Status).optional(),
  priority: z.nativeEnum(Priority).optional(),
  deadline: z.string().min(1, 'Deadline is required').refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    {
      message: 'Deadline cannot be in the past',
    }
  ),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
