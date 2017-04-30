const test = require('ava')
const api = require('./helpers').api

test('returns 200', async t => {
  const response = await api().get('/songs')
  t.is(response.status, 200)
})
