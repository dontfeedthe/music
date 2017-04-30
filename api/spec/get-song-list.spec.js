const api = require('./helpers').api
const test = require('ava')

test('returns 200', async t => {
  const response = await api().get('/songs')
  t.is(response.status, 200)
})
