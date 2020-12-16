const db = require('../models')
const { User, Tweet, Reply, Like } = db


module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/admin/tweets', (req, res) => {
    Tweet.findAll({
      raw: true, nest: true,
      include: [User], order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
      }))
      return res.render('admin/tweets', { tweets: tweets })
    }
    )
  })
}
