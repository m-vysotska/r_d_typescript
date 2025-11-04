import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
import { TasksList } from './features/tasks/pages/TasksList';
import { TaskDetails } from './features/tasks/pages/TaskDetails';
import { TaskCreate } from './features/tasks/pages/TaskCreate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: 'tasks',
        element: <TasksList />,
      },
      {
        path: 'tasks/create',
        element: <TaskCreate />,
      },
      {
        path: 'tasks/:id',
        element: <TaskDetails />,
      },
    ],
  },
]);

