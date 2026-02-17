const request = require('supertest');
const express = require('express');
const healthRouter = require('../routes/healthRoutes');

// Create a minimal app just for testing health endpoint
const app = express();
app.use('/api/v1/health', healthRouter);

describe('Health Endpoint', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.status).toBe(200);
    });

    it('should return success status in response body', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.body.status).toBe('success');
    });

    it('should return a timestamp in ISO format', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp).toISOString()).toBe(
        response.body.timestamp,
      );
    });

    it('should return server uptime', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should return environment information', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.body.environment).toBeDefined();
      expect(['development', 'production', 'test']).toContain(
        response.body.environment,
      );
    });

    it('should return Node.js version', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.body.nodeVersion).toBeDefined();
      expect(response.body.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should be accessible without authentication', async () => {
      // No authentication headers sent
      const response = await request(app).get('/api/v1/health');
      expect(response.status).toBe(200);
    });
  });
});
