const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Task = require('../src/models/task.model');
const jwt = require('jsonwebtoken');

describe('Task Routes', () => {
  let authToken;
  let userId;

  afterAll(async () => {
    // Final cleanup for this test suite - this is the last test file
    // so we can safely disconnect
    await User.deleteMany({});
    await Task.deleteMany({});
    
    // Close all mongoose connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Force disconnect all connections
    await mongoose.disconnect();
    
    // Give time for connections to fully close
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  beforeEach(async () => {
    // Clear data before each test
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create a test user and get token
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    userId = user._id.toString();

    // Generate token
    authToken = jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('POST /tasks', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'High',
        status: 'Pending'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.priority).toBe(taskData.priority);
      expect(response.body.status).toBe(taskData.status);
      expect(response.body.userId).toBe(userId);
    });

    it('should return 401 without authentication token', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 400 for invalid priority', async () => {
      const taskData = {
        title: 'Test Task',
        priority: 'InvalidPriority'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing title', async () => {
      const taskData = {
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should use default values for priority and status', async () => {
      const taskData = {
        title: 'Test Task'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.priority).toBe('Low');
      expect(response.body.status).toBe('Pending');
    });
  });

  describe('GET /tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        {
          title: 'Task 1',
          priority: 'High',
          status: 'Pending',
          userId: userId
        },
        {
          title: 'Task 2',
          priority: 'Medium',
          status: 'In Progress',
          userId: userId
        },
        {
          title: 'Task 3',
          priority: 'Low',
          status: 'Done',
          userId: userId
        }
      ];
      await Task.insertMany(tasks);
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBe(3);
      expect(response.body.meta.total).toBe(3);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/tasks?status=Pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].status).toBe('Pending');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/tasks?priority=High')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].priority).toBe('High');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tasks.length).toBe(2);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(2);
      expect(response.body.meta.total).toBe(3);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });
});

