const test = require('ava')
const api = require('./helpers').api
const sinon = require('sinon')

test('calls store.findById', async t => {
  const store = { findById: () => Promise.resolve({}) }
  const findByIdSpy = sinon.spy(store, 'findById')
  await api(store).get('/songs/fake-song-id')
  t.is(findByIdSpy.calledOnce, true)
  t.is(findByIdSpy.calledWith('fake-song-id'), true)
})

test('returns what store.findById returns in response', async t => {
  const fakeData = {id: 'fake-song-id', url: 'fake-song-url'}
  const store = { findById: () => Promise.resolve(fakeData) }
  const response = await api(store).get('/songs/fake-song-id')
  t.deepEqual(response.body, fakeData)
})
