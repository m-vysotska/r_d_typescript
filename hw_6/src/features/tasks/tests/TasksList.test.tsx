import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TasksList } from '../pages/TasksList';
import * as api from '../api';
import type { Task } from '../types';

vi.mock('../api');

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'in_progress',
    priority: 'medium',
    deadline: '2024-12-30',
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

  it('displays loading state initially', () => {
    vi.mocked(api.getTasks).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<TasksList />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('displays tasks correctly when loaded', async () => {
    vi.mocked(api.getTasks).mockResolvedValue(mockTasks);
    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    // Check that all required fields are present
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('displays empty state when no tasks', async () => {
    vi.mocked(api.getTasks).mockResolvedValue([]);
    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create your first task!')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    const errorMessage = 'Failed to load tasks';
    vi.mocked(api.getTasks).mockRejectedValue(new Error(errorMessage));
    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders task cards with correct data-testid', async () => {
    vi.mocked(api.getTasks).mockResolvedValue(mockTasks);
    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
    });
  });

  it('has create button link', async () => {
    vi.mocked(api.getTasks).mockResolvedValue([]);
    renderWithRouter(<TasksList />);

    await waitFor(() => {
      const createButton = screen.getByText('Create New Task');
      expect(createButton).toBeInTheDocument();
      expect(createButton.closest('a')).toHaveAttribute('href', '/tasks/create');
    });
  });
});






