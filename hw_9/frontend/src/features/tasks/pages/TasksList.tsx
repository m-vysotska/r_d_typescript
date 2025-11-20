import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../api';
import { Status } from '../types';
import type { Task } from '../types';
import './TasksList.css';

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      // Reload tasks after deletion
      await loadTasks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="tasks-list-container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-list-container">
        <div className="error-message" role="alert">
          <h2>Error loading tasks</h2>
          <p>{error}</p>
          <button onClick={loadTasks}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-list-container">
      <div className="tasks-list-header">
        <h1>📋 Task List</h1>
        <Link to="/tasks/create" className="create-button">
          Create New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task!</p>
          <Link to="/tasks/create" className="create-button">
            Create Task
          </Link>
        </div>
      ) : (
        <div className="tasks-columns">
          <div className="tasks-column">
            <div className="column-header">
              <h2>To Do</h2>
              <span className="task-count">{tasks.filter(t => t.status === Status.Todo).length}</span>
            </div>
            <div className="tasks-list">
              {tasks
                .filter(task => task.status === Status.Todo)
                .map((task) => (
                  <div key={task.id} className="task-card-wrapper">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="task-card"
                      data-testid={`task-card-${task.id}`}
                    >
                      <h3>{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className={`badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-deadline">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(task.id, task.title);
                      }}
                      className="task-delete-button"
                      title="Delete task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              {tasks.filter(t => t.status === Status.Todo).length === 0 && (
                <div className="empty-column">No tasks</div>
              )}
            </div>
          </div>

          <div className="tasks-column">
            <div className="column-header">
              <h2>In Progress</h2>
              <span className="task-count">{tasks.filter(t => t.status === Status.InProgress).length}</span>
            </div>
            <div className="tasks-list">
              {tasks
                .filter(task => task.status === Status.InProgress)
                .map((task) => (
                  <div key={task.id} className="task-card-wrapper">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="task-card"
                      data-testid={`task-card-${task.id}`}
                    >
                      <h3>{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className={`badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-deadline">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(task.id, task.title);
                      }}
                      className="task-delete-button"
                      title="Delete task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              {tasks.filter(t => t.status === Status.InProgress).length === 0 && (
                <div className="empty-column">No tasks</div>
              )}
            </div>
          </div>

          <div className="tasks-column">
            <div className="column-header">
              <h2>Done</h2>
              <span className="task-count">{tasks.filter(t => t.status === Status.Done).length}</span>
            </div>
            <div className="tasks-list">
              {tasks
                .filter(task => task.status === Status.Done)
                .map((task) => (
                  <div key={task.id} className="task-card-wrapper">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="task-card"
                      data-testid={`task-card-${task.id}`}
                    >
                      <h3>{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className={`badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-deadline">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(task.id, task.title);
                      }}
                      className="task-delete-button"
                      title="Delete task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              {tasks.filter(t => t.status === Status.Done).length === 0 && (
                <div className="empty-column">No tasks</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

