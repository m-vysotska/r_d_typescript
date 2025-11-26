import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaskDetails } from './TaskDetails';
import * as api from '../api';
import type { Task } from '../types';

vi.mock('../api');

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'in_progress',
  priority: 'high',
  deadline: '2024-12-31',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

describe('TaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    vi.mocked(api.getTaskById).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<TaskDetails />);
    expect(screen.getByText('Loading task details...')).toBeInTheDocument();
  });

  it('should display task details correctly', async () => {
    vi.mocked(api.getTaskById).mockResolvedValue(mockTask);

    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should display error message when task fetch fails', async () => {
    const errorMessage = 'Task not found';
    vi.mocked(api.getTaskById).mockRejectedValue(new Error(errorMessage));

    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      expect(screen.getByText('Error loading task')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Back to Task List')).toBeInTheDocument();
  });

  it('should have error message with role="alert"', async () => {
    vi.mocked(api.getTaskById).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error loading task');
    });
  });
});
