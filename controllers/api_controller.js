const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
  updateArticleVotes,
  deleteCommentById,
  fetchUsers,
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
   addCommentToArticle(article_id, username, body)
    .then((comment) => {
     res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes= (req, res, next) => {
  const {article_id} = req.params
  const {inc_votes} = req.body
  
  if (inc_votes === undefined){
    return res.status(400).send({msg: 'Vote missing'})
  }
  
  checkArticleExist(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return  updateArticleVotes(article_id, inc_votes)
    })
      .then((update) => {
    res.status(200).send({article: update})
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params
  deleteCommentById(comment_id)
  .then((comment) => {
    if(!comment) {
      return Promise.reject({status: 404, msg: 'Comment not found'})
    }
    res.status(204).send()
  })
  .catch((err) => {
    next(err)
  })
}

exports.getUsers = (req, res, next) => {
  fetchUsers()
  .then((users) => {
    res.status(200).send({users})
  })
  .catch((err) => {
    next(err)
  })
}