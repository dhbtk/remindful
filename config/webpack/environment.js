const { environment } = require('@rails/webpacker')

environment.loaders.append('yaml', {
  test: /\.ya?ml$/,
  use: ['yaml-loader'],
  type: 'json'
})
module.exports = environment
