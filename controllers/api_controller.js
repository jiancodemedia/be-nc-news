const {fetchTopics} = require('../models/api_model')
const fs = require('fs/promises')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getApi = (req, res, next) => {
   return fs.readFile('./endpoints.json', 'utf-8').then((data) => {
        const endpoint = JSON.parse(data)
        res.status(200).send(endpoint)
    }) 
}