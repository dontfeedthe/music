const express = require('express')
const bodyParser = require('body-parser')
const joi = require('joi')

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
      const schema = joi.object().keys({
        url: joi.string().uri().required()
      })
      const result = joi.validate(req.body, schema)
      if (result.error) return res.status(400).send()

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
