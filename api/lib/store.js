module.exports = {
  items: [],

  findAll () {
    return Promise.resolve(this.items)
  },

  findById (id) {
    const item = this.items.find(item => item.id === id)
    return Promise.resolve(item)
  },

  create (item) {
    this.items.push(item)
  },

  delete (id) {
    const itemToRemoveIndex = this.items.findIndex(item => item.id === id)
    this.items.splice(itemToRemoveIndex, 1)
  }
}
