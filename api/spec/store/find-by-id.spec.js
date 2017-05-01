const test = require('ava')
const store = require('../../lib/store')

test('has a .findById() function', t => {
  t.not(store.findById, undefined)
})

test('returns a promise', t => {
  const response = store.findById()
  t.true(response instanceof Promise)
})

test('returns undefined when the item is not found', async t => {
  store.items = []
  const item = await store.findById('missing-song-id')
  t.is(item, undefined)
})

test('returns the item when it is found', async t => {
  store.items = [{ id: 'fake-song-id', url: 'fake-song-url' }]
  const item = await store.findById('fake-song-id')
  t.deepEqual(item, { id: 'fake-song-id', url: 'fake-song-url' })
})
