const test = require('ava')
const api = require('./helpers').api
const sinon = require('sinon')

test('returns 404 when resource does not exist', async t => {
  const store = { findById: () => Promise.resolve() }
  const response = await api(store).delete('/songs/missing')
  t.is(response.status, 404)
})

test('calls store.findById', async t => {
  const store = { findById: () => Promise.resolve() }
  const findByIdSpy = sinon.spy(store, 'findById')
  await api(store).delete('/songs/fake-song-id')
  t.is(findByIdSpy.calledOnce, true)
})

test('calls store.deleteById', async t => {
  const fakeSong = { id: 'fake-song-id', url: 'fake-url' }
  const store = {
    findById: () => Promise.resolve(fakeSong),
    deleteById: () => Promise.resolve()
  }
  const deleteByIdSpy = sinon.spy(store, 'deleteById')
  await api(store).delete('/songs/fake-song-id')
  t.is(deleteByIdSpy.calledWith('fake-song-id'), true)
})

test('returns 204', async t => {
  const fakeSong = { id: 'fake-song-id', url: 'fake-url' }
  const store = {
    findById: () => Promise.resolve(fakeSong),
    deleteById: () => Promise.resolve()
  }
  const response = await api(store).delete('/songs/fake-song-id')
  t.is(response.status, 204)
})
