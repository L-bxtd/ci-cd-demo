import { it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server';

it('GET /api/hello 返回 JSON 消息', async () => {
  const res = await request(app).get('/api/hello');
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toMatch(/json/);
  expect(res.body).toEqual({ message: 'Hello from ECS backend' });
});

it('GET /health 返回 200 与 ok', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.text).toBe('ok');
});

it('GET /api/version 返回版本号', async () => {
  const res = await request(app).get('/api/version');
  expect(res.status).toBe(200);
  expect(res.text).toMatch(/^\d+\.\d+\.\d+$/);
});
