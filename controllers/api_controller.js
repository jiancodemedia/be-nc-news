const {fetchTopics} = require('../models/api_model')

exports.getTopics = (req, res, next) => {
    console.log('controller here')
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
}