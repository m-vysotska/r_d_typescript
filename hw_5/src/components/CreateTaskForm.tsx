import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTask, type TaskCreateInput } from '../api/api';
import { Status, Priority } from '../types/task.types';
import './CreateTaskForm.css';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
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

type TaskFormData = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
    defaultValues: {
      status: Status.Todo,
      priority: Priority.Medium,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData: TaskCreateInput = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        deadline: data.deadline,
      };

      await createTask(taskData);
      reset();
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="create-task-form-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className={errors.title ? 'error' : ''}
            placeholder="Enter task title"
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            {...register('description')}
            className={errors.description ? 'error' : ''}
            placeholder="Enter task description"
            rows={4}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            {...register('status')}
            className={errors.status ? 'error' : ''}
          >
            <option value={Status.Todo}>To Do</option>
            <option value={Status.InProgress}>In Progress</option>
            <option value={Status.Done}>Done</option>
          </select>
          {errors.status && (
            <span className="error-message">{errors.status.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            {...register('priority')}
            className={errors.priority ? 'error' : ''}
          >
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Urgent}>Urgent</option>
          </select>
          {errors.priority && (
            <span className="error-message">{errors.priority.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="deadline">
            Deadline <span className="required">*</span>
          </label>
          <input
            id="deadline"
            type="date"
            {...register('deadline')}
            className={errors.deadline ? 'error' : ''}
          />
          {errors.deadline && (
            <span className="error-message">{errors.deadline.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isValid}
        >
          Create Task
        </button>
      </form>
    </div>
  );
}

