# deltachat-js

> abstract js bindings for [`deltachat-core`][deltachat-core]

[![npm](https://img.shields.io/npm/v/deltachat-node.svg)](https://www.npmjs.com/package/deltachat-node)
[![Build Status](https://travis-ci.org/deltachat/deltachat-node.svg?branch=master)](https://travis-ci.org/deltachat/deltachat-node)
![Node version](https://img.shields.io/node/v/deltachat-node.svg)
[![Coverage Status](https://coveralls.io/repos/github/deltachat/deltachat-node/badge.svg)](https://coveralls.io/github/deltachat/deltachat-node)
[![dependencies](https://david-dm.org/deltachat/deltachat-node.svg)](https://david-dm.org/deltachat/deltachat-node)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**WORK IN PROGRESS** The API can change at any time and will not follow semver versioning until `v1.0.0` has been released.

`deltachat-js` primarily aims to offer two things:

* A high level JavaScript api with syntactic sugar
* Plugabble API for deltachat bindings that you implement
* Client-side JavaScript browser support

## Install

```
npm install deltachat-js
```

See example usage in `test/binding.js`.


```
// all of the function names in deltachat that you need to implement
var functionNames = require('deltachat-js/dc_functions')

// an example implementation of the above functions
var binding = require('./test/binding')

// pass bindings into the deltachat wrapper
var dc = new DeltaChat(binding)

dc.configure(...)
```

## License

Licensed under the GPLv3, see [LICENSE](./LICENSE) file for details.

Copyright © 2018 Delta Chat contributors.

[deltachat-core]: https://github.com/deltachat/deltachat-core
>>>>>>> initial commit
