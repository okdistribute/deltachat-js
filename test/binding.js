var fnames = require('../dc_functions')

class Binding {
}

fnames.forEach((name) => {
  Binding[name] = function () {
    console.log('called', name, arguments)
  }
})

module.exports = Binding

