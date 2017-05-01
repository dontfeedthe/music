const express = require('express')
const bodyParser = require('body-parser')
const joi = require('joi')
const shortid = require('shortid')
const helmet = require('helmet')
const moment = require('moment')
const url = require('url')
const got = require('got')

const schemas = {
  song: joi.object().keys({
    url: joi.string().uri().required().regex(/^https:\/\/(www\.)?youtube\.com\/watch\?v=.+$/)
  })
}

const _ = {
  isAuthenticated (req, res, next) {
    const auth = req.headers.authorization
    if (!auth) return res.send(401).send('Missing "Authorization" header')

    const authChunks = auth.split(' ')
    const authType = authChunks[0]
    if (authType.toLowerCase() !== 'bearer') return res.status(401).send('Authentication must be "bearer"')

    const authToken = authChunks[1]
    if (!authToken) return res.status(401).send('Access token is missing')

    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${authToken}`
    got(url)
      .then(googleResponse => {
        res.locals.auth = googleResponse.body
        next()
      })
      .catch(error => {
        return res.status(400).send(error)
      })
  },

  findAll (store) {
    return (req, res, next) => {
      store.findAll().then(items => {
        res.locals.data = items
        next()
      })
    }
  },

  findById (store) {
    return (req, res, next) => {
      const id = req.params.id
      store.findById(id).then(item => {
        res.locals.data = item
        next()
      })
    }
  },

  create (store) {
    return (req, res, next) => {
      const item = {}

      const itemId = shortid.generate()
      item.id = itemId

      const createdAt = moment().toISOString()
      item.created_at = createdAt

      const query = url.parse(res.locals.data.url).query
      item.url_id = query.split('=')[1]

      store.create(Object.assign(item, res.locals.data))

      res.locals.location = `/songs/${item.id}`
      next()
    }
  },

  delete (store) {
    return (req, res, next) => {
      store.deleteById(req.params.id)
      next()
    }
  },

  validate (schema) {
    return (req, res, next) => {
      const result = joi.validate(req.body, schema)
      if (result.error) return res.status(400).send(result.error.details)
      res.locals.data = result.value
      return next()
    }
  },

  allowCors (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    return next()
  },

  failIfRouteDoesNotExist (req, res) {
    return res.status(501).send('Oops, this does not exist (yet!)')
  },

  failIfMissing (req, res, next) {
    const item = res.locals.data
    if (!item) return res.status(404).send()
    next()
  },

  send (code, sendData = false) {
    return (req, res, next) => {
      const data = sendData ? res.locals.data : undefined
      switch (code) {
        case 200: return res.status(code).send(data)
        case 201: return res.status(code).location(res.locals.location).send(data)
        case 204: return res.status(code).send(data)
        default: return res.status(500).send('Oops...')
      }
    }
  }
}

module.exports = (store) => {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(_.allowCors)

  app.get('/songs', _.isAuthenticated, _.findAll(store), _.send(200, true))
  app.post('/songs', _.validate(schemas.song), _.create(store), _.send(201))
  app.delete('/songs/:id', _.findById(store), _.failIfMissing, _.delete(store), _.send(204))
  app.get('/songs/:id', _.findById(store), _.failIfMissing, _.send(200, true))

  app.all('*', _.failIfRouteDoesNotExist)

  return app
}
