import request from 'supertest';
import app from '../server.js';
import { taskService } from '../services/task.service.js';
import { Status, Priority } from '../types/task.types.js';

// Helper function to get a future date
const getFutureDate = (daysFromNow: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

describe('Tasks API Integration Tests', () => {
  beforeEach(async () => {
    await taskService.clearTasks();
  });

  describe('GET /api/tasks', () => {
    it('should return 200 and empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 200 and all tasks', async () => {
      const task1 = await taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      const task2 = await taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: getFutureDate(),
        status: Status.InProgress,
        priority: Priority.High,
      });

      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toContainEqual(expect.objectContaining({ id: task1.id }));
      expect(response.body).toContainEqual(expect.objectContaining({ id: task2.id }));
    });

    it('should filter tasks by status', async () => {
      await taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      await taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: getFutureDate(),
        status: Status.InProgress,
        priority: Priority.High,
      });

      const response = await request(app).get('/api/tasks?status=todo').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Task 1',
        status: Status.Todo,
      });
    });

    it('should filter tasks by priority', async () => {
      await taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      await taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: getFutureDate(),
        status: Status.InProgress,
        priority: Priority.High,
      });

      const response = await request(app).get('/api/tasks?priority=high').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Task 2',
        priority: Priority.High,
      });
    });

    it('should return 400 for invalid query parameters', async () => {
      const response = await request(app).get('/api/tasks?status=invalid').expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 200 and the task when task exists', async () => {
      const task = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Medium,
      });

      const response = await request(app).get(`/api/tasks/${task.id}`).expect(200);

      expect(response.body).toMatchObject({
        id: task.id,
        title: 'Test Task',
        description: 'Test Description',
        status: Status.Todo,
        priority: Priority.Medium,
      });
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).get('/api/tasks/nonexistent-id').expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 for invalid task ID format', async () => {
      const response = await request(app).get('/api/tasks/invalid-uuid-format').expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 and create a new task with valid data', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.High,
      };

      const response = await request(app).post('/api/tasks').send(taskData).expect(201);

      expect(response.body).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        deadline: taskData.deadline,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 201 with default values when optional fields are omitted', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: getFutureDate(),
      };

      const response = await request(app).post('/api/tasks').send(taskData).expect(201);

      expect(response.body).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        status: Status.Todo,
        priority: Priority.Medium,
      });
    });

    it('should return 400 when required fields are missing', async () => {
      const taskData = {
        description: 'New Description',
        deadline: getFutureDate(),
      };

      const response = await request(app).post('/api/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          path: 'title',
          message: 'Required',
        })
      );
    });

    it('should return 400 when field validation fails', async () => {
      const taskData = {
        title: '', // Empty title
        description: 'New Description',
        deadline: getFutureDate(),
      };

      const response = await request(app).post('/api/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 200 and update task when valid data is provided', async () => {
      const task = await taskService.createTask({
        title: 'Original Task',
        description: 'Original Description',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      const updateData = {
        title: 'Updated Task',
        status: Status.InProgress,
        priority: Priority.High,
      };

      const response = await request(app).put(`/api/tasks/${task.id}`).send(updateData).expect(200);

      expect(response.body).toMatchObject({
        id: task.id,
        title: 'Updated Task',
        description: 'Original Description', // Should remain unchanged
        status: Status.InProgress,
        priority: Priority.High,
      });
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 404 when task does not exist', async () => {
      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put('/api/tasks/nonexistent-id')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 when validation fails', async () => {
      const task = await taskService.createTask({
        title: 'Original Task',
        description: 'Original Description',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      const updateData = {
        title: '', // Invalid empty title
      };

      const response = await request(app).put(`/api/tasks/${task.id}`).send(updateData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 200 and delete task when task exists', async () => {
      const task = await taskService.createTask({
        title: 'Task to Delete',
        description: 'Description',
        deadline: getFutureDate(),
        status: Status.Todo,
        priority: Priority.Low,
      });

      const response = await request(app).delete(`/api/tasks/${task.id}`).expect(200);

      expect(response.body).toHaveProperty('message', 'Task deleted successfully');

      // Verify task is actually deleted
      await request(app).get(`/api/tasks/${task.id}`).expect(404);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/nonexistent-id').expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
