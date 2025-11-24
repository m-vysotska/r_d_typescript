import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskDetails } from '../pages/TaskDetails';
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

const renderWithRouter = (component: React.ReactElement, route = '/tasks/1') => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/tasks/:id" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

describe('TaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(api.getTaskById).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<TaskDetails />);
    expect(screen.getByText('Loading task details...')).toBeInTheDocument();
  });

  it('displays task details correctly', async () => {
    vi.mocked(api.getTaskById).mockResolvedValue(mockTask);
    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('displays error message when task not found', async () => {
    vi.mocked(api.getTaskById).mockRejectedValue(new Error('Task not found'));
    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      expect(screen.getByText('Error loading task')).toBeInTheDocument();
      expect(screen.getByText('Task not found')).toBeInTheDocument();
    });
  });

  it('has back button to task list', async () => {
    vi.mocked(api.getTaskById).mockResolvedValue(mockTask);
    renderWithRouter(<TaskDetails />);

    await waitFor(() => {
      const backButton = screen.getByText('← Back to Task List');
      expect(backButton).toBeInTheDocument();
      expect(backButton.closest('a')).toHaveAttribute('href', '/tasks');
    });
  });
});






