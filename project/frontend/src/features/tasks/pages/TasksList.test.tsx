import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TasksList } from './TasksList';
import * as api from '../api';
import type { Task } from '../types';

vi.mock('../api');

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'low',
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'in_progress',
    priority: 'high',
    deadline: '2024-12-31',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TasksList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    vi.mocked(api.getTasks).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<TasksList />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should display tasks correctly with all required fields', async () => {
    vi.mocked(api.getTasks).mockResolvedValue(mockTasks);

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    // Check that all required fields are present
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    // Check that tasks are displayed in correct columns (status-based)
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Check priority badges
    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();

    // Check task cards are present
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('should display empty state when no tasks exist', async () => {
    vi.mocked(api.getTasks).mockResolvedValue([]);

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create your first task!')).toBeInTheDocument();
    });

    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch tasks';
    vi.mocked(api.getTasks).mockRejectedValue(new Error(errorMessage));

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should have error message with role="alert"', async () => {
    vi.mocked(api.getTasks).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error loading tasks');
    });
  });
});
