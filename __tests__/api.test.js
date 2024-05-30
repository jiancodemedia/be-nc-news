const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endPoints = require('../endpoints.json');

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
    return request(app)
    .get('/api')
    .expect(200).then ((res) => {
      expect(res.body).toEqual(endPoints)
    })
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200: responds with an article object', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((res) => {
      const article = res.body.article;
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  });
  test('404: responds with an error message when article not found', () => {
    return request(app)
    .get('/api/articles/9999999')
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('Article not found')
    })
  });
  test('400: responds with an error message when invalid ID', () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
    .then ((res) => {
      expect(res.body.msg).toBe('Invalid ID')
    })
  });
});

describe('GET /api/articles', () => {
  test('200: responds with an array of articles', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const {articles} = body;
      expect(articles).toHaveLength(13)
    })
  });
  test('200: responds with an array of articles in a descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const {articles} = body;
      expect(articles).toBeSortedBy('created_at', {descending: true})
    })
  });
  test('200: responds with an array of Objs with the correct key and values, should not have body property on any object', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
          });
        });
      });
  });
});
          