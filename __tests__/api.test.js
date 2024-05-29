const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const fs = require('fs/promises');

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test('GET: 404 when given a valid but non-existent endpoint', () => {
    return request(app)
    .get('/api/banana')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('endpoint does not exist')
    })
  })
});

describe('GET /api', () => {
  test('200: responds with the correct json object', () => {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((endPoints) => {
      const parSedEndpoints = JSON.parse(endPoints);
      
      return request(app)
    .get('/api')
    .expect(200).then ((res) => {
      expect(res.body).toEqual(parSedEndpoints)
    })
    })
  });
});
