const db = require('../db/connection');

exports.fetchTopics = () => {
    console.log('model here')
    return db.query(
        `SELECT * FROM topics`
    ).then((result) => {
        return result.rows
    })
}