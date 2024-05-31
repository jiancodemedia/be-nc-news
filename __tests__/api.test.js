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
         
describe('GET /api/articles/:article_id/comments', () => {
  test('200: responds with an array of comments with correct properties', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
        const {comments} = body
        expect(comments).toHaveLength(11)
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        })
      })
  })
  test('200: responds with an empty array when valid ID but there are no comments', () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toEqual([])
      })
  });
  test('200: responds with an array of comments with most recent comments first', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
        const {comments} = body
        expect(comments).toBeSortedBy('created_at', {descending: true})
      })
  })
  test('404: responds with an error message when article not found', () => {
    return request(app)
    .get('/api/articles/99999/comments')
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

describe('POST /api/articles/:article_id/comments', () => {
  test('201: responds with the posted comment', () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({username: 'rogersop',
      body: 'comment here'
    })
    .expect(201)
    .then(({body}) => {
      const {comment} = body
      expect(comment).toMatchObject({
        comment_id: 19,
        body: 'comment here',
        article_id: 1,
        author: 'rogersop',
        votes: 0,
      })
    })
  })
  test('201: ignores unnecessary properties', () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({
      username: 'rogersop',
      body: 'comment here',
      random: 'ignore this'
    })
    .expect(201)
    .then(({body}) => {
      const {comment} = body
      expect(comment).toMatchObject({
        comment_id: 19,
        body: 'comment here',
        article_id: 1,
        author: 'rogersop',
        votes: 0,
      })
    })
  })
  test('404: responds with error msg when username does not exist', () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username: 'banana',
      body: 'comment here'
    })
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Username not found')
    })
  });

  test('400: responds with error msg when invalid ID', () => {
    return request(app)
    .post('/api/articles/invalid/comments')
    .send({username: 'rogersop',
    body: 'comment here'
  })
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Invalid ID')
    })
  });
});
  
describe('PATCH /API/articles/:article_id', () => {
  test('200: responds with the updated article', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: 9})
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 109,
      })
    })
  });
  test('400: responds with error msg: inv_votes is not a number', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: 'banana'})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Votes must be a number')
    })
  });
  test('404: responds with error msg when article not exists', () => {
    return request(app)
    .patch('/api/articles/19999')
    .send({inc_votes: 1})
  .expect(404)
  .then(({body}) => {
    expect(body.msg).toBe('Article not found')
  })
  })
  test('400: responds with error msg when article not exists', () => {
    return request(app)
    .patch('/api/articles/invalid')
    .send({inc_votes: 1})
  .expect(400)
  .then(({body}) => {
    expect(body.msg).toBe('Invalid ID')
  })
  })
});

        
  