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

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT
        comment_id,
        votes,
        created_at,
        author,
        body,
        article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `, [article_id])
    .then((result) => {
        return result.rows
    })
}

exports.addCommentToArticle = (article_id, username, body) => {
  
    return db.query(`
    INSERT INTO comments(article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`, [article_id, username, body])
    .then((result) => {
        return result.rows[0]
    })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db.query(`
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *;`, [article_id, inc_votes])
  .then((results) => {
    return results.rows[0]
  })
}

exports.deleteCommentById = (comment_id) => {
  return db.query(`
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;`, [comment_id])
  .then((result) => {
    return result.rowCount > 0
  })
}

exports.fetchUsers = () => {
  return db.query(`
  SELECT * FROM users;`)
  .then((result) => {
    return result.rows
  })
}