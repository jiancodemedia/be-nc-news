const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
} = require("../models/api_model");
const { checkArticleExist } = require("../models/article_id_model");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res, next) => {
  res.status(200).send(endPoints);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExist(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return fetchCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComments = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  if (!username || !body) {
    return res.status(400).send({ msg: "Missing required field" });
  }
  checkArticleExist(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return addCommentToArticle(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
