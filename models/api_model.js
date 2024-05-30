const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
        articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id)::INT AS comment_count
        FROM 
        articles
        FULL JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
 return result.rows;
    });
};
