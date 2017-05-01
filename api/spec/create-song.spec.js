const test = require('ava')
const sinon = require('sinon')
const moment = require('moment')
const api = require('./helpers').api

test('returns 400 when url is missing', async t => {
  const response = await api().post('/songs')
  t.is(response.status, 400)
})

test('returns 400 when url is invalid', async t => {
  const response = await api().post('/songs').send({url: 'notAnURL'})
  t.is(response.status, 400)
})

test('returns 201 when url is provided', async t => {
  const response = await api().post('/songs').send({url: 'https://youtube.com'})
  t.is(response.status, 201)
})

test('returns the resource location', async t => {
  const response = await api().post('/songs').send({url: 'https://youtube.com'})
  t.regex(response.headers.location, /\/songs\/.+/)
})

test('calls store.create', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: 'https://youtube.com'})
  const expectedData = {
    id: sinon.match.string,
    created_at: sinon.match.string,
    url: 'https://youtube.com'
  }
  t.is(store.create.calledWith(expectedData), true)
})

test('adds an "id" field', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: 'https://youtube.com'})
  t.not(store.create.getCall(0).args[0].id, undefined)
})

test('adds a date field called "created_at"', async t => {
  const store = { create: sinon.spy() }
  await api(store).post('/songs').send({url: 'https://youtube.com'})
  const createdAt = store.create.getCall(0).args[0].created_at
  t.true(moment(createdAt).isValid())
})

test('returns 400 if uri is not from youtube', async t => {
  const store = { create: sinon.spy() }
  const response = await api(store).post('/songs').send({url: 'https://not-youtube.com'})
  t.is(response.status, 400)
})
