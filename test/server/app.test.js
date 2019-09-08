import request from 'supertest';
import app from '../../app.js';

describe('Test /', () => {
  test('It should respond 200', () => {
    return request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
    });
  });
});
