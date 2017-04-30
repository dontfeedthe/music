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
      store.findAll().then(items => {
        res.status(200).send(items)
      })
    }
  },

  create (store) {
    return (req, res) => {
      const id = shortid.generate()
      store.create({id, url: req.body.url})
      return res.status(201).location(`/songs/${id}`).send()
    }
  },

  validate (schema) {
    return (req, res, next) => {
      const result = joi.validate(req.body, schema)
      if (result.error) return res.status(400).send()
      return next()
    }
  },

  allowCors (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    return next()
  }
}

module.exports = (store) => {
  const app = express()
  app.use(bodyParser.json())

  app.all('*', _.allowCors)
  app.get('/songs', _.findAll(store))
  app.post('/songs', _.validate(schemas.song), _.create(store))

  return app
}
