const test = require('ava')
const store = require('../../lib/store')

test('has a .create() function', t => {
  t.not(store.create, undefined)
})

test('inserts a new item in the store', async t => {
  const fakeSong = {id: 'fake-song-id', url: 'fake-song-url'}
  store.create(fakeSong)
  t.deepEqual(store.items, [{id: 'fake-song-id', url: 'fake-song-url'}])
})
