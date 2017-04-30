const test = require('ava')
const api = require('./helpers').api
const sinon = require('sinon')

test('returns 200', async t => {
  const response = await api().get('/songs')
  t.is(response.status, 200)
})

test('calls store.findAll', async t => {
  const store = { findAll: () => Promise.resolve([]) }
  const findAllSpy = sinon.spy(store, 'findAll')
  await api(store).get('/songs')
  t.is(findAllSpy.calledOnce, true)
})

test('returns what store.findAll returns in response', async t => {
  const fakeData = [{url: 'foobar'}, {url: 'quxbaz'}]
  const store = { findAll: () => Promise.resolve(fakeData) }
  const response = await api(store).get('/songs')
  t.deepEqual(response.body, fakeData)
})
