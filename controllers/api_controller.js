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
    fs.readFile('./endpoints.json', 'utf-8', (data) => {
        console.log(data)
    })

    res.status(200).send({msg: 'all ok'})
}