const test = require('ava')
const store = require('../../lib/store')

test('has a .delete() function', t => {
  t.not(store.delete, undefined)
})

test('returns the whole store', async t => {
  store.items = [{id: 'fake-song-id', url: 'fake-song-url'}]
  store.delete('fake-song-id')
  t.deepEqual(store.items, [])
})
