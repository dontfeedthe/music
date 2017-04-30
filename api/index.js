const express = require('express')
const bodyParser = require('body-parser')

const _ = {
  findAll (store) {
    return (req, res) => {
      store.findAll().then(items => {
        res.status(200).send(items)
      })
    }
  },

  create (store) {
    return (req, res) => {
      const url = req.body.url
      if (!url) {
        return res.status(400).send()
      }

      return res.status(201).send()
    }
  }
}

module.exports = (store) => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/songs', _.findAll(store))
  app.post('/songs', _.create(store))

  return app
}
