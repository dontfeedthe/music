const test = require('ava')
const store = require('../../lib/store')

test('has a .findAll() function', t => {
  t.not(store.findAll, undefined)
})

test('returns a promise', t => {
  const res = store.findAll()
  t.true(res instanceof Promise)
})

test('returns the whole store', async t => {
  store.items = [{id: 'fake-song-id', url: 'fake-song-url'}]
  const res = await store.findAll()
  t.deepEqual(res, [{id: 'fake-song-id', url: 'fake-song-url'}])
})
