module.exports = {
  items: [],

  findAll () {
    return Promise.resolve(this.items)
  },

  create (item) {
    this.items.push(item)
  },

  delete (id) {
    const itemToRemoveIndex = this.items.findIndex(item => item.id === id)
    this.items.splice(itemToRemoveIndex, 1)
  }
}
