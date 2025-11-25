import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getTaskById, updateTask, type TaskUpdateInput } from '../api';
import { Status, Priority } from '../types';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: 'Deadline cannot be in the past',
      }
    )
    .optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

export function TaskEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const loadTask = async (taskId: string) => {
      try {
        setLoading(true);
        setError(null);
        const task = await getTaskById(taskId);

        // Set form values from task
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('status', task.status as 'todo' | 'in_progress' | 'done');
        setValue('priority', task.priority as 'low' | 'medium' | 'high' | 'urgent');
        // Convert deadline to date input format (YYYY-MM-DD)
        const deadlineDate = new Date(task.deadline);
        const year = deadlineDate.getFullYear();
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        setValue('deadline', `${year}-${month}-${day}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTask(id);
    }
  }, [id, setValue]);

  const onSubmit = async (data: TaskFormData): Promise<void> => {
    if (!id) return;

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      const taskData: TaskUpdateInput = {};

      if (data.title !== undefined && data.title !== '') taskData.title = data.title;
      if (data.description !== undefined && data.description !== '')
        taskData.description = data.description;
      if (data.status !== undefined) taskData.status = data.status;
      if (data.priority !== undefined) taskData.priority = data.priority;
      if (data.deadline !== undefined && data.deadline !== '') taskData.deadline = data.deadline;

      await updateTask(id, taskData);
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => {
        navigate(`/tasks/${id}`);
      }, 1000);
    } catch (error) {
      console.error('Failed to update task:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to update task. Please try again.';
      setErrorMessage(errorMsg);
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="task-edit-container">
        <div className="loading">Loading task...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-edit-container">
        <div className="error-message" role="alert">
          <h2>Error loading task</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/tasks')} className="back-button">
            Back to Task List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-edit-container">
      <h1>Edit Task</h1>
      <div className="edit-task-form-container">
        {errorMessage && (
          <div className="message message-error" role="alert">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="message-close"
              onClick={() => setErrorMessage(null)}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        {successMessage && (
          <div className="message message-success">
            <span>{successMessage}</span>
            <button
              type="button"
              className="message-close"
              onClick={() => setSuccessMessage(null)}
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
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
            <select id="status" {...register('status')} className={errors.status ? 'error' : ''}>
              <option value={Status.Todo}>To Do</option>
              <option value={Status.InProgress}>In Progress</option>
              <option value={Status.Done}>Done</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
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
            {errors.priority && <span className="error-message">{errors.priority.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              {...register('deadline')}
              className={errors.deadline ? 'error' : ''}
            />
            {errors.deadline && <span className="error-message">{errors.deadline.message}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={!isValid}>
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
