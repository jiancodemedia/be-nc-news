const { fetchTopics, fetchArticleById, fetchArticles } = require("../models/api_model");
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
  res
    .status(200)
    .send(endPoints)
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
  .then((article) => {
    if (!article) {
      return Promise.reject({status: 404, msg: "Article not found" });
    }
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err)
  })
};

exports.getArticles = (req, res, next) => {
fetchArticles()
.then((articles) => {
    res.status(200).send({articles})
})
.catch((err) => {
    
    next(err)
})
}
