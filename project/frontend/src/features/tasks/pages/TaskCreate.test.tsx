import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TaskCreate } from './TaskCreate';
import * as api from '../api';

vi.mock('../api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TaskCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have submit button disabled when form is empty', () => {
    renderWithRouter(<TaskCreate />);

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();
  });

  it('should have submit button disabled when form is invalid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a'); // Too short or invalid

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTask).mockResolvedValue({
      id: '1',
      title: 'Valid Task',
      description: 'Valid Description',
      status: 'todo',
      priority: 'medium',
      deadline: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
    });

    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const deadlineInput = screen.getByLabelText(/deadline/i);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    await user.type(titleInput, 'Valid Task Title');
    await user.type(descriptionInput, 'Valid Task Description');
    await user.type(deadlineInput, futureDateString);

    await waitFor(() => {
      const submitButton = screen.getByText('Create Task');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should display validation error messages', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a');
    await user.clear(titleInput);

    await waitFor(() => {
      const errorMessage = screen.getByText('Title is required');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display error message for title validation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a'.repeat(101)); // Too long

    await waitFor(() => {
      const errorMessage = screen.getByText('Title must be less than 100 characters');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display error message for description validation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'a');
    await user.clear(descriptionInput);

    await waitFor(() => {
      const errorMessage = screen.getByText('Description is required');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display error message for deadline validation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskCreate />);

    const deadlineInput = screen.getByLabelText(/deadline/i);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    await user.type(deadlineInput, pastDateString);

    await waitFor(() => {
      const errorMessage = screen.getByText('Deadline cannot be in the past');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should show all form fields', () => {
    renderWithRouter(<TaskCreate />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
  });
});
