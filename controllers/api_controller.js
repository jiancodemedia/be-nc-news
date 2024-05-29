const { fetchTopics, fetchArticleById } = require("../models/api_model");
const fs = require("fs/promises");
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

    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    if (!article) {
      return res.status(404).send({ msg: "Article not found" });
    }
    res.status(200).send({ article });
  })
  .catch((err) => {
    if (err.code === '22P02') {
        return res.status(400).send({msg: 'Invalid ID'})
    }
    next(err)
  })
};
