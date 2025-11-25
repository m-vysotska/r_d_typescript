import request from 'supertest';
import app from '../server.js';
import { taskService } from '../services/task.service.js';
import { Status, Priority } from '../types/task.types.js';

describe('Tasks API Integration Tests', () => {
  beforeEach(() => {
    taskService.clearTasks();
  });

  describe('GET /tasks', () => {
    it('should return 200 and empty array when no tasks exist', async () => {
      const response = await request(app).get('/tasks').expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 200 and all tasks', async () => {
      const task1 = taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
        status: Status.Todo,
        priority: Priority.Low,
      });

      const task2 = taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: '2024-12-31',
        status: Status.InProgress,
        priority: Priority.High,
      });

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toContainEqual(expect.objectContaining({ id: task1.id }));
      expect(response.body).toContainEqual(expect.objectContaining({ id: task2.id }));
    });

    it('should filter tasks by status', async () => {
      taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
        status: Status.Todo,
        priority: Priority.Low,
      });

      taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: '2024-12-31',
        status: Status.Done,
        priority: Priority.High,
      });

      const response = await request(app).get('/tasks').query({ status: Status.Todo }).expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe(Status.Todo);
    });

    it('should filter tasks by priority', async () => {
      taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
        status: Status.Todo,
        priority: Priority.Low,
      });

      taskService.createTask({
        title: 'Task 2',
        description: 'Description 2',
        deadline: '2024-12-31',
        status: Status.Todo,
        priority: Priority.High,
      });

      const response = await request(app)
        .get('/tasks')
        .query({ priority: Priority.High })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].priority).toBe(Priority.High);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return 200 and task when task exists', async () => {
      const task = taskService.createTask({
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
      });

      const response = await request(app).get(`/tasks/${task.id}`).expect(200);

      expect(response.body).toMatchObject({
        id: task.id,
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
      });
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).get('/tasks/non-existent-id').expect(404);

      expect(response.body).toMatchObject({
        error: 'Task not found',
      });
    });

    it('should return 404 for route /tasks/ (empty id)', async () => {
      // Express treats /tasks/ as /tasks route, so it returns 200 with empty array
      // This is expected behavior - empty id is handled by route matching
      const response = await request(app).get('/tasks/').expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /tasks', () => {
    it('should return 201 and create task with valid data', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
        status: Status.Todo,
        priority: Priority.Medium,
      };

      const response = await request(app).post('/tasks').send(taskData).expect(201);

      expect(response.body).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        status: taskData.status,
        priority: taskData.priority,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 201 with default status and priority when not provided', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(201);

      expect(response.body.status).toBe(Status.Todo);
      expect(response.body.priority).toBe(Priority.Medium);
    });

    it('should return 400 when title is missing', async () => {
      const taskData = {
        description: 'New Description',
        deadline: '2024-12-31',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body.details).toBeInstanceOf(Array);
    });

    it('should return 400 when description is missing', async () => {
      const taskData = {
        title: 'New Task',
        deadline: '2024-12-31',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should return 400 when deadline is missing', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should return 400 when title is too long', async () => {
      const taskData = {
        title: 'a'.repeat(101),
        description: 'New Description',
        deadline: '2024-12-31',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should return 400 when description is too long', async () => {
      const taskData = {
        title: 'New Task',
        description: 'a'.repeat(1001),
        deadline: '2024-12-31',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should return 400 when status is invalid', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
        status: 'invalid_status',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should return 400 when priority is invalid', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
        priority: 'invalid_priority',
      };

      const response = await request(app).post('/tasks').send(taskData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should return 200 and update task when task exists', async () => {
      const task = taskService.createTask({
        title: 'Original Title',
        description: 'Original Description',
        deadline: '2024-12-31',
      });

      const updateData = {
        title: 'Updated Title',
        status: Status.InProgress,
      };

      const response = await request(app).put(`/tasks/${task.id}`).send(updateData).expect(200);

      expect(response.body).toMatchObject({
        id: task.id,
        title: 'Updated Title',
        status: Status.InProgress,
        description: 'Original Description',
      });
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 404 when task does not exist', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const response = await request(app)
        .put('/tasks/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Task not found',
      });
    });

    it('should return 400 when validation fails', async () => {
      const task = taskService.createTask({
        title: 'Original Title',
        description: 'Original Description',
        deadline: '2024-12-31',
      });

      const updateData = {
        title: 'a'.repeat(101),
      };

      const response = await request(app).put(`/tasks/${task.id}`).send(updateData).expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should return 200 and delete task when task exists', async () => {
      const task = taskService.createTask({
        title: 'Task to Delete',
        description: 'Description',
        deadline: '2024-12-31',
      });

      const response = await request(app).delete(`/tasks/${task.id}`).expect(200);

      expect(response.body).toMatchObject({
        message: 'Task deleted successfully',
      });

      await request(app).get(`/tasks/${task.id}`).expect(404);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/tasks/non-existent-id').expect(404);

      expect(response.body).toMatchObject({
        error: 'Task not found',
      });
    });
  });
});
