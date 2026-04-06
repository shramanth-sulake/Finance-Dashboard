import request from 'supertest';
import app from '../src/app';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { initializeDatabase } from '../src/db/init';

// Since the DB initializes differently in memory vs file,
// For this simple test suite, it expects the default admin to be seeded.

describe('Zorvyn API Integration Tests', () => {
  beforeAll(() => {
    initializeDatabase();
  });
  let authToken = '';

  describe('Authentication Boundary', () => {
    it('Should login the default admin user and return a JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token; // save token for subsequent tests
    });

    it('Should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });

    it('Should reject accessing private routes without a token', async () => {
      const res = await request(app).get('/api/dashboard/summary');
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBe('Authentication token required');
    });
  });

  describe('Financial Records API', () => {
    it('Should fetch the dashboard summary securely using the JWT', async () => {
      const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalIncome');
      expect(res.body).toHaveProperty('totalExpense');
      expect(res.body).toHaveProperty('netBalance');
    });

    it('Should create a test record properly', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 500,
          type: 'INCOME',
          category: 'Test Salary',
          date: '2026-05-01'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.amount).toEqual(500);
    });

    it('Should enforce validation constraints securely', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -50, // Should be positive
          type: 'INVALID_TYPE',
          category: '',
          date: 'not-a-date'
        });

      expect(res.statusCode).toEqual(400); // Because of Zod validation blocks
      expect(res.body).toHaveProperty('error');
    });
    
    it('Should respect pagination parameters on fetch', async () => {
      const res = await request(app)
        .get('/api/records?limit=1&offset=0')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeLessThanOrEqual(1);
    });
  });
});
