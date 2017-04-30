const test = require('ava')
const api = require('./helpers').api

test('returns 404 when resource does not exist', async t => {
  const response = await api().delete('/route-that-will-never-exist')
  t.is(response.status, 501)
})
