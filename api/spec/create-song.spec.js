const test = require('ava')
const api = require('./helpers').api

test('returns 400 when url is missing', async t => {
  const response = await api().post('/songs')
  t.is(response.status, 400)
})

test('returns 400 when url is invalid', async t => {
  const response = await api().post('/songs').send({url: 'notAnURL'})
  t.is(response.status, 400)
})

test('return 201 when url is provided', async t => {
  const response = await api().post('/songs').send({url: 'http://google.com'})
  t.is(response.status, 201)
})
