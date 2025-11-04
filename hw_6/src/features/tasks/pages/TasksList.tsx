import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api';
import { Task } from '../types';
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
        <div className="tasks-grid">
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="task-card"
              data-testid={`task-card-${task.id}`}
            >
              <h3>{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className={`badge status-${task.status.replace('_', '-')}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                <span className="task-deadline">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

