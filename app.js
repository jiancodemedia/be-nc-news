const express = require("express")

const {getTopics, getApi} = require('./controllers/api_controller')

const app = express();

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'endpoint does not exist'})
})

module.exports = app;