const supertest = require('supertest')
const server = require('..')

const fakeStore = {
  findAll () {
    return Promise.resolve([])
  },

  create () {
    return Promise.resolve()
  }
}

exports.api = () => supertest(server(fakeStore))
