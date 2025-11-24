import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTask } from '../api/api';
import { Status, Priority } from '../types/task.types';
import './CreateTaskForm.css';
import { taskFormSchema, type TaskFormData } from '../types/task-form.schema';

interface CreateTaskFormProps {
  onTaskCreated: () => void;
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setErrorMessage(null);
      setSuccessMessage(null);
      await createTask(data);
      reset();
      setSuccessMessage('Task created successfully!');
      onTaskCreated();

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to create task:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create task. Please try again.';
      setErrorMessage(errorMsg);
      setSuccessMessage(null);
    }
  };

  return (
    <div className="create-task-form-container">
      <h2>Create New Task</h2>
      {errorMessage && (
        <div className="message message-error">
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

