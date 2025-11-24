import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTaskById, deleteTask } from '../api';
import type { Task } from '../types';
import './TaskDetails.css';

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTask = await getTaskById(taskId);
      setTask(fetchedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id || !task) return;

    try {
      setDeleting(true);
      setErrorMessage(null);
      await deleteTask(id);
      setShowDeleteConfirm(false);
      navigate('/tasks');
    } catch (err) {
      setDeleting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete task';
      setErrorMessage(errorMsg);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="task-details-container">
        <div className="loading">Loading task details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-details-container">
        <div className="error-message" role="alert">
          <h2>Error loading task</h2>
          <p>{error}</p>
          <Link to="/tasks" className="back-button">
            Back to Task List
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-container">
        <div className="error-message">
          <h2>Task not found</h2>
          <Link to="/tasks" className="back-button">
            Back to Task List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-container">
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

      {showDeleteConfirm && task && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete "{task.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-cancel"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="task-details-header">
        <Link to="/tasks" className="back-button">
          ← Back to Task List
        </Link>
        <div className="task-actions">
          <Link to={`/tasks/${id}/edit`} className="edit-button">
            Edit Task
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className="delete-button"
          >
            Delete Task
          </button>
        </div>
      </div>

      <div className="task-details-card">
        <h1>{task.title}</h1>
        <div className="task-details-section">
          <h2>Description</h2>
          <p>{task.description}</p>
        </div>

        <div className="task-details-grid">
          <div className="task-detail-item">
            <span className="label">Status:</span>
            <span className={`badge status-${task.status.replace('_', '-')}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <div className="task-detail-item">
            <span className="label">Priority:</span>
            <span className={`badge priority-${task.priority}`}>
              {task.priority}
            </span>
          </div>

          <div className="task-detail-item">
            <span className="label">Deadline:</span>
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>

          <div className="task-detail-item">
            <span className="label">Created:</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          {task.updatedAt && (
            <div className="task-detail-item">
              <span className="label">Updated:</span>
              <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

