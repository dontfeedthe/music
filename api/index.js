const express = require('express')
const bodyParser = require('body-parser')
const joi = require('joi')
const shortid = require('shortid')

const schemas = {
  song: joi.object().keys({
    url: joi.string().uri().required()
  })
}

const _ = {
  findAll (store) {
    return (req, res) => {
      res.status(200).send([])
    }
  },

  create (store) {
    return (req, res) => {
      const id = shortid.generate()
      return res.status(201).location(`/songs/${id}`).send()
    }
  },

  validate (schema) {
    return (req, res, next) => {
      const result = joi.validate(req.body, schema)
      if (result.error) return res.status(400).send()
      return next()
    }
  }
}

module.exports = (store) => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/songs', _.findAll(store))
  app.post('/songs', _.validate(schemas.song), _.create(store))

  return app
}
