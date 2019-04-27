#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const split = require('split2')

const data = []
const regex = /(.*)\s+dc\_(\w+)\s+(.*);/
const header = path.resolve(__dirname, '../deltachat-core/src/deltachat.h')

fs.createReadStream(header)
  .pipe(split())
  .on('data', line => {
    const match = regex.exec(line)
    console.log(match, line)
    if (match) data.push(match[2])
  })
  .on('end', () => {
    const fnames = data.sort((lhs, rhs) => {
      if (lhs< rhs) return -1
      else if (lhs> rhs) return 1
      return 0
    }).map(row => {
      return `    'dc_${row}'`
    }).join(',\n')

    fs.writeFileSync(
      path.resolve(__dirname, '../dc_functions.js'),
      `// Generated!\n\nmodule.exports = [\n${fnames}\n]\n`
    )
  })
