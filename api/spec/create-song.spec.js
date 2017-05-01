const test = require('ava')
const sinon = require('sinon')
const moment = require('moment')
const api = require('./helpers').api

const urlId = 'QHV9lnZuFaY'
const validUrl = `https://www.youtube.com/watch?v=QHV9lnZuFaY`

test('returns 400 when url is missing', async t => {
  const response = await api().post('/songs')
  t.is(response.status, 400)
})

test('returns 400 when url is invalid', async t => {
  const response = await api().post('/songs').send({url: 'notAnURL'})
  t.is(response.status, 400)
})

test('returns 400 if uri is not from youtube', async t => {
  const store = { create: sinon.spy() }
  const response = await api(store).post('/songs').send({url: 'https://not-youtube.com'})
  t.is(response.status, 400)
})

test('returns 201 when url is provided', async t => {
  const response = await api().post('/songs').send({url: validUrl})
  t.is(response.status, 201)
})

test('returns the resource location', async t => {
  const response = await api().post('/songs').send({url: validUrl})
  t.regex(response.headers.location, /\/songs\/.+/)
})

test('adds a string field called "id"', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: validUrl})
  t.true(typeof store.create.getCall(0).args[0].id === 'string')
})

test('adds a date field called "created_at"', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: validUrl})
  const createdAt = store.create.getCall(0).args[0].created_at
  t.true(moment(createdAt).isValid())
})

test('adds a string field called "url_id"', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: validUrl})
  const urlId = store.create.getCall(0).args[0].url_id
  t.deepEqual(urlId, 'QHV9lnZuFaY')
})

test('calls store.create with appropriate data', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: validUrl})
  t.is(store.create.calledWith({
    id: sinon.match.string,
    created_at: sinon.match.string,
    url: validUrl,
    url_id: urlId
  }), true)
})
