import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskCreate } from '../pages/TaskCreate';
import * as api from '../api';

vi.mock('../api');

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/tasks/create" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

describe('TaskCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/tasks/create');
  });

  it('submit button is disabled when form is empty', () => {
    renderWithRouter(<TaskCreate />);
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when form is invalid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByTestId('title-input');
    await user.type(titleInput, 'A');

    // Form is still invalid (missing required fields)
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('submit button becomes enabled when form is valid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const deadlineInput = screen.getByTestId('deadline-input');

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    
    // Set deadline to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await user.type(deadlineInput, dateString);

    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('displays validation error for empty title', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByTestId('title-input');
    await user.click(titleInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument();
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('displays validation error for empty description', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const descriptionInput = screen.getByTestId('description-input');
    await user.click(descriptionInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('description-error')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('displays validation error for past deadline', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const deadlineInput = screen.getByTestId('deadline-input');

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    
    // Set deadline to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    await user.type(deadlineInput, dateString);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('deadline-error')).toBeInTheDocument();
      expect(screen.getByText('Deadline cannot be in the past')).toBeInTheDocument();
    });
  });

  it('creates task and navigates on successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTask).mockResolvedValue({
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
      deadline: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
    });

    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const deadlineInput = screen.getByTestId('deadline-input');

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await user.type(deadlineInput, dateString);

    const submitButton = screen.getByTestId('submit-button');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        deadline: dateString,
      });
    });
  });
});

