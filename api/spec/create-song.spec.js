const api = require('./helpers').api
const test = require('ava')

test('returns 400 when url is missing', async t => {
  const response = await api().post('/songs')
  t.is(response.status, 400)
})

test('return 201 when url is provided', async t => {
  const response = await api().post('/songs').send({url: 'fakeURL'})
  t.is(response.status, 201)
})
