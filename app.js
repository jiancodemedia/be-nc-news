const express = require("express")

const {getTopics, getApi, getArticleById, getArticles} = require('./controllers/api_controller')

const app = express();

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        return res.status(400).send({msg: 'Invalid ID'})
    } else if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    } 
})

app.all('*', (req, res) => {
    res.status(404).send({msg: 'endpoint does not exist'})
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Serve Broken'})
})

module.exports = app;