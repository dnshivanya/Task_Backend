const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

describe('Auth Routes', () => {
  afterAll(async () => {
    // Final cleanup for this test suite
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for password less than 6 characters', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345'
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe('Email already in use');
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        email: 'test@example.com'
        // missing name and password
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      await request(app)
        .post('/users/register')
        .send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
});

