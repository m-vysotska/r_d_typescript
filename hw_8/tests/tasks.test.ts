import request from 'supertest';
import app from '../server.js';
import { sequelize } from '../config/database.js';
import { User } from '../models/User.model.js';
import { Task } from '../models/Task.model.js';

describe('Tasks API', () => {
  let testUser: User;
  let testUser2: User;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com'
    });

    testUser2 = await User.create({
      name: 'Test User 2',
      email: 'test2@example.com'
    });
  });

  describe('GET /tasks', () => {
    it('should return 200 and empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 200 and all tasks', async () => {
      const task1 = await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const task2 = await Task.create({
        title: 'Task 2',
        description: 'Description 2',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].assignee).toBeDefined();
    });

    it('should filter tasks by status', async () => {
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      await Task.create({
        title: 'Task 2',
        description: 'Description 2',
        status: 'done',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const response = await request(app)
        .get('/tasks?status=done')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('done');
    });

    it('should filter tasks by priority', async () => {
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        priority: 'high',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      await Task.create({
        title: 'Task 2',
        description: 'Description 2',
        priority: 'low',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const response = await request(app)
        .get('/tasks?priority=high')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].priority).toBe('high');
    });

    it('should return 400 for invalid status filter', async () => {
      const response = await request(app)
        .get('/tasks?status=invalid')
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 for invalid priority filter', async () => {
      const response = await request(app)
        .get('/tasks?priority=invalid')
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return 200 and task details', async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const response = await request(app)
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.assignee).toBeDefined();
      expect(response.body.assignee.id).toBe(testUser.id);
    });

    it('should return 404 when task does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .get('/tasks/')
        .expect(404);
    });
  });

  describe('POST /tasks', () => {
    it('should return 201 and create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('New Description');
      expect(response.body.status).toBe('todo');
      expect(response.body.priority).toBe('medium');
      expect(response.body.assignee).toBeDefined();
      expect(response.body.assignee.id).toBe(testUser.id);

      const taskInDb = await Task.findByPk(response.body.id);
      expect(taskInDb).not.toBeNull();
    });

    it('should return 201 and create task with custom status and priority', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'in_progress',
        priority: 'high',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.status).toBe('in_progress');
      expect(response.body.priority).toBe('high');
    });

    it('should return 400 when title is missing', async () => {
      const newTask = {
        description: 'New Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when description is missing', async () => {
      const newTask = {
        title: 'New Task',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when deadline is missing', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when assigneeId is missing', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31'
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when assignee does not exist', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        deadline: '2024-12-31',
        assigneeId: '00000000-0000-0000-0000-000000000000'
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Assignee not found');
    });

    it('should return 400 when title is too long', async () => {
      const newTask = {
        title: 'a'.repeat(101),
        description: 'New Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when description is too long', async () => {
      const newTask = {
        title: 'New Task',
        description: 'a'.repeat(1001),
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when status is invalid', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'invalid',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when priority is invalid', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        priority: 'invalid',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });
  });

  describe('PUT /tasks/:id', () => {
    let existingTask: Task;

    beforeEach(async () => {
      existingTask = await Task.create({
        title: 'Existing Task',
        description: 'Existing Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });
    });

    it('should return 200 and update task', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Task');
      expect(response.body.description).toBe('Updated Description');
      expect(response.body.id).toBe(existingTask.id);

      const taskInDb = await Task.findByPk(existingTask.id);
      expect(taskInDb?.title).toBe('Updated Task');
    });

    it('should return 200 and update task status', async () => {
      const updateData = {
        status: 'done'
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('done');
    });

    it('should return 200 and update task priority', async () => {
      const updateData = {
        priority: 'urgent'
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.priority).toBe('urgent');
    });

    it('should return 200 and update assignee', async () => {
      const updateData = {
        assigneeId: testUser2.id
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.assigneeId).toBe(testUser2.id);
      expect(response.body.assignee.id).toBe(testUser2.id);
    });

    it('should return 404 when task does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const updateData = {
        title: 'Updated Task'
      };

      const response = await request(app)
        .put(`/tasks/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 when assignee does not exist', async () => {
      const updateData = {
        assigneeId: '00000000-0000-0000-0000-000000000000'
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Assignee not found');
    });

    it('should return 400 when title is invalid', async () => {
      const updateData = {
        title: ''
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 when status is invalid', async () => {
      const updateData = {
        status: 'invalid'
      };

      const response = await request(app)
        .put(`/tasks/${existingTask.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should return 200 and delete task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        description: 'Description',
        deadline: '2024-12-31',
        assigneeId: testUser.id
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.message).toBe('Task deleted successfully');

      const taskInDb = await Task.findByPk(task.id);
      expect(taskInDb).toBeNull();
    });

    it('should return 404 when task does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });
  });
});

